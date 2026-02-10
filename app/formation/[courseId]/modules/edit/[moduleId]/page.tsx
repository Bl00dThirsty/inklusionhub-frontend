// app/courses/[courseId]/modules/edit/[moduleId]/page.tsx
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetModuleByIdQuery } from '@/state/learningApi';
import ModuleForm from '../../../../../Components/Formation/ModuleForm';
import { FiArrowLeft, FiLoader } from 'react-icons/fi';

const EditModulePage = () => {
  const { courseId, moduleId } = useParams();
  const router = useRouter();
  
  const { data: module, isLoading, error } = useGetModuleByIdQuery(
    moduleId as string,
    { skip: !moduleId }
  );

  const handleSuccess = (updatedModule: any) => {
    router.push(`/formation/${courseId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center justify-center">
            <FiLoader className="animate-spin h-12 w-12 text-blue-600 mb-4" />
            <p className="text-gray-600">Chargement du module...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 mb-2">Module non trouvé</h3>
            <p className="text-red-600 mb-4">
              Le module que vous essayez de modifier n'existe pas.
            </p>
            <button
              onClick={() => router.push(`/courses/${courseId}`)}
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
            onClick={() => router.push(`/formation/${courseId}`)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="mr-2" />
            Retour au cours
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Modification du module: <span className="text-blue-600">{module.title}</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Modifiez les informations de votre module ci-dessous.
          </p>
        </div>

        {/* Formulaire */}
        <ModuleForm 
          courseId={courseId as string}
          module={module}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
};

export default EditModulePage;