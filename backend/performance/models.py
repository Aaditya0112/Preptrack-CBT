from django.db import models
from django.conf import settings
import uuid
from assessments.models import Exam, Question, Option, Practice, Topic

class ExamAttempt(models.Model):
    """ Represents a single instance of a user taking an exam. """

    STATUS_CHOICES = [
        ('in-progress', 'In Progress'), 
        ('incomplete', 'Incomplete'),
        ('completed', 'Completed'),
    ]
    attemptId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=150, default='demo_user')

    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, null=True, blank=True)
    practice = models.ForeignKey(Practice, on_delete=models.CASCADE, null=True, blank=True)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in-progress')
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    total_attempts = models.IntegerField(default=0)

    def __str__(self):
        title = self.exam.title if self.exam else self.practice.subject
        return f"Attempt by {self.username} for {title}"

    def calculate_and_save_score(self):
        """
        Calculates the score based on correct answers and saves the instance.
        """
        total_score = 0
        

        for user_answer in self.answers.all():
            if user_answer.is_correct:
                total_score += user_answer.question.marks or 0  # assuming each question has a 'marks' field
        self.score = total_score
        self.save()

    @property
    def totalTimeTaken(self):
        if self.end_time and self.start_time:
            return (self.end_time - self.start_time).total_seconds() # in seconds
        return None

class UserAnswer(models.Model):
    """ Stores a user's answer to a single question within an attempt. """

    ANSWER_STATUS = [
        ('NOT_VISITED', 'Not Visited'),
        ('ANSWERED', 'Answered'),
        ('NOT_ANSWERED', 'Not Answered'),
        ('MARKED_FOR_REVIEW', 'Marked for Review'),
        ('ANSWERED_AND_MARKED', 'Answered and Marked for Review'),
    ]

    OPTION_CHOICES = [
        ('A', 'A'),
        ('B', 'B'),
        ('C', 'C'),
        ('D', 'D')
    ]
    answerId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    exam_attempt = models.ForeignKey(ExamAttempt, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)

    # Store the user's given answer depending on type of question the payload will vary
    selected_option_identifier = models.CharField(max_length=1, null=True, blank=True, choices=OPTION_CHOICES)
    numerical_answer = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)
    
    # is_correct = models.BooleanField(null=True, blank=True)
    time_spent = models.IntegerField(null=True, blank=True)  # time taken in seconds
    answer_status = models.CharField(max_length=20, choices=ANSWER_STATUS, default='not_answered')

    @property
    def is_correct(self):
        if self.question.questionType == 'MCQ':
            correct_option = self.question.correct_answer.mcq_correct_option
            return self.selected_option_identifier == correct_option
        elif self.question.questionType == 'NUM':
            correct_numerical = self.question.correct_answer.numerical_answer
            range_min = self.question.correct_answer.numerical_answer_range_min
            range_max = self.question.correct_answer.numerical_answer_range_max

            if correct_numerical is not None:
                return self.numerical_answer == correct_numerical
            elif range_min is not None and range_max is not None:
                return range_min <= self.numerical_answer <= range_max
        else:
            return False
    # You could add more fields like 'time_taken', 'status' (answered, skipped), etc.

    def __str__(self):
        return f"Answer to Q:{self.question.pk} in attempt {self.exam_attempt.pk}"

class Stats(models.Model):
    """ Aggregated statistics for a user's performance in an exam. """

    statsId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    exam_attempt = models.ForeignKey(ExamAttempt, on_delete=models.CASCADE, related_name='stats')
    username = models.CharField(max_length=150, default='demo_user')
    total_questions = models.IntegerField(default=0)
    questions_attempted = models.IntegerField(default=0)
    correct_answers = models.IntegerField(default=0)
    marks = models.DecimalField(max_digits=7, decimal_places=2, default=0.0)

    not_attempted = models.IntegerField(default=0) # iski zaroorat nhi hai
    attempt_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)  # percentage
    accuracy = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    difficulty_wise_stats = models.JSONField(default=dict)  

    def __str__(self):
        return f"Stats for {self.username} on {self.exam.examTitle}"
