// 'use client';

// import React, { useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useGetCourseBySlugQuery } from '@/state/learningApi';
// import CourseEnrollmentButton from './CourseEnrollmentButton';
// import { 
//   FiClock, 
//   FiUsers, 
//   FiBookOpen, 
//   FiChevronRight,
//   FiStar,
//   FiBarChart2,
//   FiCheckCircle
// } from 'react-icons/fi';
// import { useAuth } from '../../Components/hooks/useAuth';;

// const CoursePublicPage = () => {
//   const { slug } = useParams();
//   const router = useRouter();
//   const { user, isLoading: isLoadingAuth } = useAuth();
  
//   const { data: course, isLoading, error } = useGetCourseBySlugQuery(
//     slug as string,
//     { skip: !slug }
//   );

//   const [selectedModule, setSelectedModule] = useState<number | null>(null);

//   if (isLoading || isLoadingAuth) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="animate-pulse space-y-6">
//             <div className="h-12 bg-gray-200 rounded w-3/4"></div>
//             <div className="h-64 bg-gray-200 rounded"></div>
//             <div className="h-32 bg-gray-200 rounded"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !course) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//             <h2 className="text-xl font-semibold text-red-800 mb-2">Cours non trouvé</h2>
//             <p className="text-red-600 mb-4">
//               Le cours que vous cherchez n'existe pas ou a été supprimé.
//             </p>
//             <button
//               onClick={() => router.push('/courses')}
//               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//             >
//               Retour aux cours
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Si le cours n'est pas publié et l'utilisateur n'est pas admin
//   if (!course.is_published) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
//             <FiClock className="mx-auto text-yellow-500 mb-4" size={48} />
//             <h2 className="text-2xl font-bold text-yellow-800 mb-2">Cours en préparation</h2>
//             <p className="text-yellow-600 mb-6">
//               Ce cours n'est pas encore disponible. Revenez bientôt !
//             </p>
//             <button
//               onClick={() => router.push('/courses')}
//               className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
//             >
//               Découvrir d'autres cours
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Section */}
//       <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
//         <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
//             {/* Contenu */}
//             <div>
//               <div className="flex items-center gap-2 mb-4">
//                 <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
//                   {course.difficulty}
//                 </span>
//                 {course.is_free && (
//                   <span className="px-3 py-1 bg-green-500 rounded-full text-sm">
//                     Gratuit
//                   </span>
//                 )}
//                 {course.is_featured && (
//                   <span className="px-3 py-1 bg-yellow-500 rounded-full text-sm">
//                     <FiStar className="inline mr-1" /> Vedette
//                   </span>
//                 )}
//               </div>
              
//               <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              
//               {course.subtitle && (
//                 <p className="text-xl text-blue-100 mb-6">{course.subtitle}</p>
//               )}
              
//               <div className="flex flex-wrap gap-4 mb-8">
//                 <div className="flex items-center">
//                   <FiClock className="mr-2" />
//                   <span>{course.estimated_total_hours}h</span>
//                 </div>
//                 <div className="flex items-center">
//                   <FiUsers className="mr-2" />
//                   <span>{course.enrolled_count || 0} apprenants</span>
//                 </div>
//                 <div className="flex items-center">
//                   <FiBookOpen className="mr-2" />
//                   <span>{course.module_count || 0} modules</span>
//                 </div>
//               </div>
              
//               {/* Bouton d'inscription */}
//               <div className="space-y-4">
//                 <CourseEnrollmentButton 
//                   course={course}
//                   userProfile={user}
//                   variant="secondary"
//                   size="lg"
//                 />
                
//                 {!user && (
//                   <p className="text-sm text-blue-200">
//                     Inscrivez-vous gratuitement pour commencer l'apprentissage
//                   </p>
//                 )}
//               </div>
//             </div>
            
//             {/* Image */}
//             {course.cover_image && (
//               <div className="relative">
//                 <img
//                   src={course.cover_image}
//                   alt={course.title}
//                   className="rounded-xl shadow-2xl"
//                 />
//                 {course.promo_video_url && (
//                   <button
//                     onClick={() => window.open(course.promo_video_url, '_blank')}
//                     className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl hover:bg-black/50 transition-colors"
//                   >
//                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
//                       <FiChevronRight className="text-blue-600 ml-1" size={24} />
//                     </div>
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Contenu détaillé */}
//       <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Colonne principale */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Description */}
//             <section className="bg-white rounded-xl shadow p-6">
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">À propos de ce cours</h2>
//               <div className="prose max-w-none">
//                 <p className="text-lg text-gray-700 mb-4">{course.short_description}</p>
//                 <p className="text-gray-600">{course.description}</p>
//               </div>
//             </section>

//             {/* Objectifs d'apprentissage */}
//             {course.learning_outcomes && course.learning_outcomes.length > 0 && (
//               <section className="bg-white rounded-xl shadow p-6">
//                 <h2 className="text-2xl font-bold text-gray-900 mb-4">Ce que vous apprendrez</h2>
//                 <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                   {course.learning_outcomes.map((outcome: string, index: number) => (
//                     <li key={index} className="flex items-start">
//                       <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
//                       <span className="text-gray-700">{outcome}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </section>
//             )}

//             {/* Contenu du cours */}
//             <section className="bg-white rounded-xl shadow p-6">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">Contenu du cours</h2>
              
//               {/* Modules */}
//               <div className="space-y-4">
//                 {course.modules?.map((module: any, index: number) => (
//                   <div 
//                     key={module.id} 
//                     className="border border-gray-200 rounded-lg overflow-hidden"
//                   >
//                     <button
//                       onClick={() => setSelectedModule(selectedModule === index ? null : index)}
//                       className="w-full p-4 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left transition-colors"
//                     >
//                       <div className="flex items-center">
//                         <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-4">
//                           {index + 1}
//                         </div>
//                         <div>
//                           <h3 className="font-semibold text-gray-900">{module.title}</h3>
//                           <p className="text-sm text-gray-600 mt-1">
//                             {module.lessons_count || 0} leçons • {module.estimated_hours || 0}h
//                           </p>
//                         </div>
//                       </div>
//                       <FiChevronRight 
//                         className={`transform transition-transform ${
//                           selectedModule === index ? 'rotate-90' : ''
//                         }`} 
//                       />
//                     </button>
                    
//                     {selectedModule === index && module.lessons && (
//                       <div className="border-t border-gray-200 p-4 bg-white">
//                         {module.lessons.map((lesson: any) => (
//                           <div key={lesson.id} className="flex items-center py-2">
//                             <FiCheckCircle className="text-gray-400 mr-3 flex-shrink-0" />
//                             <span className="text-gray-700">{lesson.title}</span>
//                             {lesson.duration_minutes && (
//                               <span className="ml-auto text-sm text-gray-500">
//                                 {lesson.duration_minutes} min
//                               </span>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
              
//               {/* Statistiques du cours */}
//               <div className="mt-8 pt-8 border-t border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   <div className="text-center p-4 bg-blue-50 rounded-lg">
//                     <div className="text-2xl font-bold text-blue-600">{course.enrolled_count || 0}</div>
//                     <div className="text-sm text-gray-600">Apprenants</div>
//                   </div>
//                   <div className="text-center p-4 bg-green-50 rounded-lg">
//                     <div className="text-2xl font-bold text-green-600">{course.completion_rate || 0}%</div>
//                     <div className="text-sm text-gray-600">Taux de complétion</div>
//                   </div>
//                   <div className="text-center p-4 bg-yellow-50 rounded-lg">
//                     <div className="text-2xl font-bold text-yellow-600">{course.avg_rating || '4.8'}</div>
//                     <div className="text-sm text-gray-600">Note moyenne</div>
//                   </div>
//                   <div className="text-center p-4 bg-purple-50 rounded-lg">
//                     <div className="text-2xl font-bold text-purple-600">{course.total_points_available || 1000}</div>
//                     <div className="text-sm text-gray-600">Points disponibles</div>
//                   </div>
//                 </div>
//               </div>
//             </section>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Cartouche d'inscription */}
//             <div className="bg-white rounded-xl shadow p-6 sticky top-6">
//               <div className="text-center mb-6">
//                 <div className="text-4xl font-bold text-gray-900 mb-2">
//                   {course.is_free ? 'Gratuit' : '€49,99'}
//                 </div>
//                 {!course.is_free && (
//                   <div className="text-sm text-gray-500">
//                     Accès à vie • Certificat inclus
//                   </div>
//                 )}
//               </div>
              
//               <CourseEnrollmentButton 
//                 course={course}
//                 userProfile={user}
//                 variant="primary"
//                 size="md"
//               />
              
//               <div className="mt-6 space-y-3 text-sm">
//                 <div className="flex items-center text-gray-600">
//                   <FiCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
//                   <span>Accès à vie au contenu</span>
//                 </div>
//                 <div className="flex items-center text-gray-600">
//                   <FiCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
//                   <span>Certificat de complétion</span>
//                 </div>
//                 <div className="flex items-center text-gray-600">
//                   <FiCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
//                   <span>Support communautaire</span>
//                 </div>
//                 <div className="flex items-center text-gray-600">
//                   <FiCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
//                   <span>Mises à jour gratuites</span>
//                 </div>
//               </div>
//             </div>

//             {/* Instructeur */}
//             <div className="bg-white rounded-xl shadow p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructeur</h3>
//               <div className="flex items-center">
//                 <img
//                   src={course.instructor_avatar || '/default-avatar.png'}
//                   alt={course.instructor_name}
//                   className="w-12 h-12 rounded-full mr-4"
//                 />
//                 <div>
//                   <div className="font-medium text-gray-900">{course.instructor_name}</div>
//                   <div className="text-sm text-gray-600">Expert en LSF</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CoursePublicPage;