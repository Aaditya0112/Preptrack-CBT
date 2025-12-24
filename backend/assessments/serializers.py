from rest_framework import serializers
from .models import Exam, Section, Question, Option, Practice, Topic, CorrectAnswer

class CorrectAnswerSerializer(serializers.ModelSerializer):

    class Meta:
        model = CorrectAnswer
        fields = [ 'question','mcq_correct_option', 'numerical_answer', 'numerical_answer_range_min', 'numerical_answer_range_max']

class PracticeSerializer(serializers.ModelSerializer):
    # topics = TopicSerializer(many=True, read_only=True)
    totalTopics = serializers.ReadOnlyField()
    class Meta:
        model = Practice
        fields = ['id', 'subject', 'subjImage', 'durationInMin', 'totalTopics']

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['optionId', 'text', 'identifier', 'question']

class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)
    correct_answer = CorrectAnswerSerializer(read_only=True)
    # topic = TopicMinimalSerializer(read_only=True)

 # only these fields

    class Meta:
        model = Question
        fields = ['questionId', 'questionText', 'questionType', 'difficulty', 'refImage', 'section','topic', 'category', 'options', 'exam', 'practice', 'correct_answer']

class QuestionMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['questionId', 'questionText', 'questionType', 'difficulty', 'correct_answer']   


class TopicSerializer(serializers.ModelSerializer):
    subject = PracticeSerializer(read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)
    class Meta:
        model = Topic
        fields = ['topicId', 'title', 'difficulty', 'summary', 'estMinutes', 'progressPercent', 'subject', 'questions']


class TopicMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['topicId', 'title', 'difficulty'] 

class SectionSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Section
        fields = ['sectionId', 'sectionTitle', 'numberOfQuestions', 'marksPerQuestion', 'exam', 'questions']

class ExamSerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True, read_only=True)

    class Meta:
        model = Exam
        fields = ['examId', 'examTitle', 'durationInSec', 'date', 'totalMarks', 'sections']


