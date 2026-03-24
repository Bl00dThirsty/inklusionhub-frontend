// app/formation/lessons/[lessonId]/quiz/page.tsx
"use client";
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetLessonQuizQuery, useGetLessonByIdQuery, useGetQuizQuestionsQuery } from '@/state/learningApi';
import { FiArrowLeft, FiLoader } from 'react-icons/fi';
import QuizForm from '../../../../../../../../Components/Formation/QuizForm';

const QuizPage = () => {
  const { lessonId } = useParams();
  const { moduleId, courseId } = useParams();
  const router = useRouter();

  const { data: lesson, isLoading: isLoadingLesson } = useGetLessonByIdQuery(lessonId as string);
  const { data: quizData, isLoading: isLoadingQuiz } = useGetLessonQuizQuery(lessonId as string);
  const { data: questions, isLoading: isLoadingQuestions } = useGetQuizQuestionsQuery(
    quizData?.id ?? '', 
    { skip: !quizData?.id }
  );

  const quiz = Array.isArray(quizData) && quizData.length === 0 ? undefined : quizData;

  if (isLoadingLesson || isLoadingQuiz || isLoadingQuestions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FiLoader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto bg-red-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-red-800">Leçon non trouvée</h2>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const handleSuccess = (quiz: { id: string }) => {
  // Rediriger vers la page des questions du quiz
  router.push(`/formation/${courseId}/modules/${moduleId}/lessons/${lessonId}/Quiz/${quiz.id}/question`);
};

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft />
            Retour à la leçon
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Créer un quiz - {lesson.title}
          </h1>
          <p className="text-gray-600 mt-2">
           Créez un quiz pour valider les connaissances de cette leçon
          </p>
        </div>

        {/* Formulaire */}
        <QuizForm 
           lessonId={lessonId as string}
           //initialQuiz={quiz}
           //initialQuestions={questions || []}  // 👈 Utilisez les questions récupérées
           onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
};

export default QuizPage;