// app/courses/[courseId]/modules/edit/[moduleId]/page.tsx
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetLessonByIdQuery } from '@/state/learningApi';
import LessonForm from '../../../../../../../Components/Formation/lessonForm';
import { FiArrowLeft, FiLoader } from 'react-icons/fi';

const EditLessonPage = () => {
  const { courseId, moduleId, lessonId } = useParams();
  const router = useRouter();
  
  const { data: lesson, isLoading, error } = useGetLessonByIdQuery(
   lessonId as string,
    { skip: !lessonId }
  );

  const handleSuccess = (updatedLesson: any) => {
    router.push(`/formation/${courseId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center justify-center">
            <FiLoader className="animate-spin h-12 w-12 text-blue-600 mb-4" />
            <p className="text-gray-600">Chargement de la leçon...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 mb-2">Leçon non trouvée</h3>
            <p className="text-red-600 mb-4">
              La leçon que vous essayez de modifier n'existe pas.
            </p>
            <button
              onClick={() => router.push(`/formation/${courseId}`)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retour au cours
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push(`/formation/${courseId}/modules/${moduleId}/lessons/${lessonId}`)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="mr-2" />
            Retour à la leçon
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Modification de la leçon: <span className="text-blue-600">{lesson.title}</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Modifiez les informations de votre leçon ci-dessous.
          </p>
        </div>

        {/* Formulaire */}
        <LessonForm 
        //   courseId={courseId as string}
            moduleId={moduleId as string}
            lesson={lesson}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
};

export default EditLessonPage;