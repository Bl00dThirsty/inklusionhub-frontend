'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetCourseByIdQuery } from '@/state/learningApi';
import CourseFormUpdate from '../../../Components/Formation/CourseFormUpdate';
import { FiArrowLeft, FiLoader } from 'react-icons/fi';

const EditCoursePage = () => {
  const { courseId } = useParams();
  const router = useRouter();
  
  const { data: course, isLoading, error } = useGetCourseByIdQuery(
    courseId as string,
    { skip: !courseId }
  );

  const handleSuccess = (updatedCourse: any) => {
    // Redirection vers la page de détail après mise à jour
    router.push(`/formation/${courseId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-lg p-8">
            <div className="flex flex-col items-center justify-center">
              <FiLoader className="animate-spin h-12 w-12 text-blue-600 mb-4" />
              <p className="text-gray-600">Chargement du cours...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Cours non trouvé</h2>
              <p className="text-gray-600 mb-4">
                Le cours que vous essayez de modifier n'existe pas ou vous n'avez pas les permissions nécessaires.
              </p>
              <button
                onClick={() => router.push('/courses')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FiArrowLeft className="mr-2" />
                Retour à la liste des cours
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push(`/formation/${courseId}`)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="mr-2" />
            Retour au cours
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Modification du cours: <span className="text-blue-600">{course.title}</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Modifiez les informations de votre cours ci-dessous.
          </p>
        </div>

        {/* Formulaire */}
        <CourseFormUpdate 
          course={course} 
          onSuccess={handleSuccess}
        />

        {/* Informations supplémentaires */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Informations de suivi
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600 block">ID du cours</span>
              <code className="font-mono bg-gray-100 px-2 py-1 rounded">
                {courseId}
              </code>
            </div>
            <div>
              <span className="text-gray-600 block">Date de création</span>
              <span className="font-medium">
                {new Date(course.created_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <div>
              <span className="text-gray-600 block">Statut</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                course.is_published 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {course.is_published ? 'Publié' : 'Brouillon'}
              </span>
            </div>
            <div>
              <span className="text-gray-600 block">Apprenants inscrits</span>
              <span className="font-medium">{course.enrolled_count || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCoursePage;