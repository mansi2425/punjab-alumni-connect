import google.generativeai as genai
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
import re # Import the regular expression module for cleaning text

# Import our database models to search them
from users.models import User
from events.models import Event
from jobs.models import Job

# Configure the Gemini AI Model
try:
    genai.configure(api_key=settings.GOOGLE_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash-latest')
except Exception as e:
    print(f"CRITICAL ERROR: Could not configure Google AI. Check your GOOGLE_API_KEY. Error: {e}")
    model = None


def search_platform_data(query):
    """
    Performs a robust keyword search across our database models to find relevant context.
    This acts as our "librarian".
    """
    context_parts = []
    # Clean the query and break it into a set of unique keywords for searching
    query_words = set(re.sub(r'[^\w\s]', '', query.lower()).split())

    # --- Search Alumni ---
    alumni = User.objects.filter(role='alumni', is_approved=True).prefetch_related('profile')
    for person in alumni:
        # Create a single string of searchable text for each alumnus
        searchable_text = f"{person.first_name or ''} {person.username} {person.profile.company or ''} {person.profile.skills or ''}".lower()
        # Check if any of the query words appear in the user's info
        if any(word in searchable_text for word in query_words):
            context_parts.append(f"Alumnus '{person.first_name or person.username}' works at '{person.profile.company}' with skills in '{person.profile.skills}'.")

    # --- Search Jobs ---
    jobs = Job.objects.all()
    for job in jobs:
        # Create a single string of searchable text for each job
        searchable_text = f"{job.title} {job.company} {job.description}".lower()
        # Check if any of the query words appear in the job's info
        if any(word in searchable_text for word in query_words):
            context_parts.append(f"There is a '{job.job_type}' opening for a '{job.title}' at '{job.company}'.")

    # This can be expanded to search events in the future
    
    return "\n".join(context_parts)


class ChatbotQueryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        if not model:
            return Response({"error": "AI model not configured."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        user_query = request.data.get('query', '')
        history = request.data.get('history', [])
        if not user_query:
            return Response({"error": "Query is empty."}, status=status.HTTP_400_BAD_REQUEST)
        history_transcript = ""
        for message in history:
            role = "User" if message.get('type') == 'user' else "Assistant"
            history_transcript += f"{role}: {message.get('text')}\n"


        
        # --- AI BRAIN 1: The "Department Head" for Intent Classification ---
        classification_prompt = f"""
        Given the following conversation history, classify the user's LATEST query into one of the categories:
        'alumni_count', 'student_count', 'keyword_search', 'general_question'.
        Respond with ONLY the category name.

        History:
        {history_transcript}
        """
        try:
            intent_response = model.generate_content(classification_prompt)
            intent = intent_response.text.strip().lower().replace("'", "").replace('"', '')
        except Exception as e:
            print(f"Error during intent classification: {e}")
            intent = 'general_question'

        # --- AI BRAIN 2: The "Delegation" Logic ---
        
        # Task: Get Alumni Count
        if 'alumni_count' in intent:
            try:
                count = User.objects.filter(role='alumni', is_approved=True).count()
                response_text = f"There are currently {count} approved alumni registered on the Punjab Alumni Connect platform."
                return Response({"response": response_text})
            except Exception:
                return Response({"error": "Could not query the alumni count."}, status=500)

        # Task: Get Student Count
        elif 'student_count' in intent:
            try:
                count = User.objects.filter(role='student', is_approved=True).count()
                response_text = f"There are currently {count} approved students registered on the platform."
                return Response({"response": response_text})
            except Exception:
                return Response({"error": "Could not query the student count."}, status=500)

        # Task: Search the Database (The "Librarian")
        elif 'keyword_search' in intent:
            context = search_platform_data(user_query)
            if context:
                prompt = f"You are Alumni Assist. Given the conversation history, use ONLY the provided information to answer the user's latest query.\n\nHistory:\n{history_transcript}\nInformation:\n{context}"
            else:
                prompt = f"You are Alumni Assist. You searched the database for the user's latest query but found no results. Given the conversation history, inform the user of this, then try to answer generally.\n\nHistory:\n{history_transcript}"
        else: # general_question
            # The prompt now includes the history
            prompt = f"You are Alumni Assist. Continue the following conversation naturally.\n\nHistory:\n{history_transcript}"

        # --- Final Answer Generation ---
        try:
            final_response = model.generate_content(prompt)
            return Response({"response": final_response.text})
        except Exception as e:
            print(f"ERROR during final Gemini API call: {e}")
            return Response({"error": "An error occurred while generating the AI response."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)