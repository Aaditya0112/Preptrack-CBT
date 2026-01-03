import uuid
from django.db import models

# Create your models here.
class Exam(models.Model):
    examId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    examTitle = models.CharField(max_length=255)
    durationInSec = models.IntegerField()
    date = models.DateTimeField()
    totalMarks = models.IntegerField()

    def __str__(self):
        return self.examTitle
    
class Section(models.Model):
    sectionId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sectionTitle = models.CharField(max_length=255)
    numberOfQuestions = models.IntegerField()
    marksPerQuestion = models.IntegerField()
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='sections', default=None, blank=True, null=True)

    def __str__(self):
        return self.sectionTitle
class Practice(models.Model):

    PRACTICE_SUBJECTS = [
        ('Physics', 'Physics'),
        ('Chemistry', 'Chemistry'), 
        ('Mathematics', 'Mathematics'),
    ]
    
    subject = models.CharField(max_length=11, choices=PRACTICE_SUBJECTS)
    subjImage = models.ImageField(upload_to='practice_subject_images/', blank=True, null=True)
    durationInMin = models.IntegerField()
    

    @property
    def totalTopics(self):
        return self.topics.count()


    def __str__(self):
        return self.subject
    
class Topic(models.Model):
    DIFFICULTY_LEVELS = [
        ('E', 'Easy'),
        ('M', 'Medium'),
        ('H', 'Hard'),
    ]

    topicId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    difficulty = models.CharField(max_length=1, choices=DIFFICULTY_LEVELS)
    summary = models.TextField()
    estMinutes = models.IntegerField()
    progressPercent = models.DecimalField(max_digits=5, decimal_places=2)
    subject= models.ForeignKey(Practice, on_delete=models.CASCADE, related_name='topics', blank=True, null=True)
    def __str__(self):
        return self.title    

class Question(models.Model):
    QUESTION_TYPES = [
        ('MCQ', 'Multiple Choice Question'),
        ('NUM', 'NUMERICAL'),
    ]

    DIFFICULTY_LEVELS = [
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard'),
    ]
    # since all topics will folow same hierarchy of questions
    category = [
        ('Level 1', 'Level 1'),
        ('Level 2', 'Level 2'),
    ]

    questionId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    questionText = models.TextField()
    questionType = models.CharField(max_length=3, choices=QUESTION_TYPES)
    difficulty = models.CharField(max_length=6, choices=DIFFICULTY_LEVELS)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='questions', blank=True, null=True )
    refImage = models.ImageField(upload_to='question_images/', blank=True, null=True)
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='questions', blank=True, null=True)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='questions', blank=True, null=True)
    practice = models.ForeignKey(Practice, on_delete=models.CASCADE, related_name='questions', blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True, choices=category)  
    marks = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f" {self.questionText[:100]}..."

class Option(models.Model):
    MCQ_CHOICES = [
        ('A', 'A'),
        ('B', 'B'),
        ('C', 'C'),
        ('D', 'D'),
    ]

    optionId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    text = models.CharField(max_length=255)
    identifier = models.CharField(max_length=1, choices=MCQ_CHOICES) # e.g., 'A', 'B', 'C', 'D'
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')

    def __str__(self):
        return f"Option {self.optionId} for Q{self.question.questionId}"

class CorrectAnswer(models.Model):
    question = models.OneToOneField(Question, on_delete=models.CASCADE, related_name='correct_answer')

    MCQ_CHOICES = [
        ('A', 'A'),        
        ('B', 'B'),
        ('C', 'C'),
        ('D', 'D'),
    ]
    mcq_correct_option = models.CharField(max_length=1, null=True, blank=True, choices=MCQ_CHOICES)


    numerical_answer = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)
    numerical_answer_range_min = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)
    numerical_answer_range_max = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)

    def __str__(self):
        return f"Answer for Q: {self.question.questionId}"
