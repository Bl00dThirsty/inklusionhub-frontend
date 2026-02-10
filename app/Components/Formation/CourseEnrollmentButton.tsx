'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  FiPlay, 
  FiCheck, 
  FiLoader, 
  FiLock, 
  FiArrowRight,
  FiCreditCard
} from 'react-icons/fi';
import { useGetCourseProgressQuery, useEnrollCourseMutation } from '@/state/learningApi';

interface CourseEnrollmentButtonProps {
  course: {
    id: string;
    slug: string;
    title: string;
    is_published: boolean;
    is_free: boolean;
    price?: number;
    enrolled_count?: number;
  };
  userProfile: any;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const CourseEnrollmentButton: React.FC<CourseEnrollmentButtonProps> = ({ 
  course, 
  userProfile,
  variant = 'primary',
  size = 'md',
  showIcon = true
}) => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Vérifier si l'utilisateur est déjà inscrit
  const { 
    data: progress, 
    isLoading: isLoadingProgress,
    refetch: refetchProgress 
  } = useGetCourseProgressQuery(course.slug, {
    skip: !userProfile
  });
  
  const [enrollCourse, { isLoading: isEnrolling }] = useEnrollCourseMutation();

  const isEnrolled = !!progress?.enrollment;
  const isLoading = isLoadingProgress || isEnrolling || isProcessing;

  const handleEnroll = async () => {
    if (!userProfile) {
      // Rediriger vers la page de connexion
      toast.error('Vous devez être connecté pour vous inscrire à un cours');
      router.push(`/sign-in?redirect=/formation/${course.id}/${course.slug}`);
      return;
    }

    if (!course.is_published) {
      toast.error('Ce cours n\'est pas encore disponible');
      return;
    }

    // Si cours premium, rediriger vers la page de paiement
    if (!course.is_free && !userProfile?.has_premium_access) {
      router.push(`/formation/${course.id}/${course.slug}/pricing`);
      return;
    }

    try {
      setIsProcessing(true);
      
      const result = await enrollCourse({ 
        course_id: course.id, 
        course_slug: course.slug 
      }).unwrap();
      
      toast.success('🎉 Inscription réussie ! Vous pouvez maintenant commencer le cours.');
      
      // Recharger la page pour voir les modules
      setTimeout(() => {
        window.location.reload();
      }, 800);
      
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      
      const errorMessage = error?.data?.detail 
        || error?.data?.message 
        || 'Une erreur est survenue lors de l\'inscription';
      
      if (errorMessage.includes('déjà inscrit')) {
        toast.success('Vous êtes déjà inscrit à ce cours !');
        // Recharger pour mettre à jour l'état
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        toast.error(`❌ ${errorMessage}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePremiumRedirect = () => {
    router.push(`/formation/${course.id}/${course.slug}/pricing`);
  };

//   const handleContinueLearning = () => {
//     // Rediriger vers le premier module ou première leçon
//     if (progress?.next_lesson) {
//       router.push(`/formation/${course.id}/${course.slug}/learn/${progress.next_lesson.id}`);
//     } else {
//       router.push(`/formation/${course.id}/${course.slug}/learn`);
//     }
//   };

const handleContinueLearning = () => {
    router.push(`/formation/${course.id}/${course.slug}/`);
  };

  // Styles selon la variante
  const getButtonStyles = () => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';
    
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-7 py-3 text-lg'
    };
    
    const variantStyles = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
      outline: 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500'
    };
    
    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`;
  };

  // Si le cours n'est pas publié
  if (!course.is_published && !userProfile?.is_staff) {
    return (
      <button
        disabled
        className={`${getButtonStyles()} opacity-60 cursor-not-allowed`}
      >
        {showIcon && <FiLock className="mr-2" />}
        Cours non disponible
      </button>
    );
  }

  // Si l'utilisateur est déjà inscrit
  if (isEnrolled) {
    return (
      <div className="flex flex-col gap-2">
        <button
          disabled
          className={`${getButtonStyles()} bg-green-100 text-green-800 border border-green-300 hover:bg-green-200`}
        >
          {showIcon && <FiCheck className="mr-2" />}
          Inscrit à ce cours
        </button>
        
        <button
          onClick={handleContinueLearning}
          className={`${getButtonStyles()} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`}
        >
          {showIcon && <FiPlay className="mr-2" />}
          Continuer l'apprentissage
          <FiArrowRight className="ml-2" />
        </button>
      </div>
    );
  }

  // Si c'est un cours premium et l'utilisateur n'est pas premium
  if (!course.is_free && !userProfile?.has_premium_access) {
    return (
      <button
        onClick={handlePremiumRedirect}
        className={`${getButtonStyles()} bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 focus:ring-purple-500`}
      >
        {showIcon && <FiCreditCard className="mr-2" />}
        Accès premium requis
        <FiArrowRight className="ml-2" />
      </button>
    );
  }

  // Bouton d'inscription normal (gratuit ou premium avec accès)
  return (
    <button
      onClick={handleEnroll}
      disabled={isLoading}
      className={getButtonStyles()}
    >
      {isLoading ? (
        <>
          <FiLoader className="animate-spin mr-2" />
          Inscription en cours...
        </>
      ) : (
        <>
          {showIcon && <FiPlay className="mr-2" />}
          {userProfile ? 'Démarrer ce cours' : 'Se connecter pour démarrer'}
        </>
      )}
    </button>
  );
};

export default CourseEnrollmentButton;