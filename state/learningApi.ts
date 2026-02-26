
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { get } from "http";

// Interfaces pour les cours
export interface Course {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  short_description: string;
  thumbnail?: string;
  cover_image?: string;
  promo_video_url?: string;
  difficulty: 'debutant' | 'intermediaire' | 'avance' | 'expert';
  language: 'lsf' | 'bilingue' | 'multilingue';
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  estimated_total_hours: number;
  total_points_available: number;
  is_published: boolean;
  is_featured: boolean;
  is_free: boolean;
  enrolled_count: number;
  lesson_count: number;
  module_count: number;
  stats: {
    lesson_count: number;
  module_count: number;
  enrolled_count: number;
  completion_rate: number;
  };
  prerequisites: string;
  learning_outcomes: string[];
  tags: string[];
  completion_rate: number;
  price?: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface Module {
  id: string;
  course: string;
  title: string;
  subtitle?: string;
  description: string;
  order: number;
  total_points: number;
  estimated_hours: number;
  image?: string;
  lesson_count?: number;
  created_at: string;
  
}

export interface Lesson {
  id: string;
  module: string;
  title: string;
  description: string;
  lesson_number: number;
  content_type: 'video' | 'text' | 'interactive' | 'mixed';
  video_url?: string;
  video_duration: number;
  text_content?: string;
  has_subtitles: boolean;
  has_lsf_translation: boolean;
  lsf_video_url?: string;
  has_quiz: boolean;
  quiz_points: number;
  quiz_pass_percentage: number;
  is_free_preview: boolean;
  difficulty: string;
  is_completed: boolean;
  attachments?: any[];
  created_at: string;
}

export interface Quiz {
  length: number;
  id: string;
  lesson_id: string;
  title: string;
  description?: string;
  time_limit_minutes?: number;
  max_attempts: number;
  pass_percentage: number;
  points_available: number;
  question_count: number;
  randomize_questions: boolean;
  created_at: string;
}

export interface Question {
  id: string;
  quiz: string;
  text: string;
  media_url: string;
  media_type: 'gif' | 'video';
  points: number;
  explanation?: string;
  demonstration_video_url?: string;
  order: number;
  choices: Choice[];
}

export interface Choice {
  id: string;
  text: string;
  sign_video_url?: string;
  is_correct: boolean;
  order: number;
}

export interface Enrollment {
  id: string;
  course_id: string;
  user_profile_id: string;
  status: 'enrolled' | 'in_progress' | 'completed' | 'paused';
  enrolled_at: string;
  started_at?: string;
  completed_at?: string;
  progress_percentage: number;
  total_points_earned: number;
  final_score_percentage?: number;
  certificate_issued: boolean;

}

export interface UserProgress {
  id: string;
  enrollment_id: string;
  lesson_id: string;
  status: 'not_started' | 'started' | 'completed';
  best_quiz_score?: number;
  quiz_attempts_count: number;
  points_earned: number;
  time_spent_minutes: number;
  next_lesson: string;
}

export interface Certificate {
  id: string;
  enrollment_id: string;
  certificate_number: string;
  verification_code: string;
  recipient_name: string;
  course_title: string;
  completion_date: string;
  issue_date: string;
  final_score_percentage: number;
  total_points_earned: number;
  grade: string;
  pdf_url?: string;
}

// Requêtes
export interface CreateCourseRequest {
  title: string;
  subtitle?: string;
  description: string;
  short_description: string;
  difficulty: string;
  language: string;
  category_id?: string;
  estimated_total_hours: number;
  is_free: boolean;
  is_featured?: boolean;
  thumbnail?: File;
  cover_image?: File;
  promo_video_url?: string;
  prerequisites?: string;
  learning_outcomes?: string[];
  tags?: string[];
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  id: string;
}

export interface CreateModuleRequest {
  course_id: string;
  title: string;
  subtitle?: string;
  description: string;
  order: number;
  total_points: number;
  estimated_hours: number;
  image?: File;
}

export interface CreateLessonRequest {
  module_id: string;
  title: string;
  description: string;
  lesson_number: number;
  content_type: string;
  video_url?: string;
  video_duration?: number;
  text_content?: string;
  has_subtitles: boolean;
  has_lsf_translation: boolean;
  lsf_video_url?: string;
  has_quiz: boolean;
  quiz_points: number;
  quiz_pass_percentage: number;
  is_free_preview: boolean;
  difficulty: string;
  attachments?: any[];
}

export interface EnrollCourseRequest {
  course_slug: string;
  course_id: string;
}

export interface SubmitQuizRequest {
  answers: { [questionId: string]: string };
  time_spent_seconds?: number;
}

export interface SubmitQuizResponse {
  score_percentage: number;
  correct_answers: number;
  total_questions: number;
  is_passed: boolean;
  points_earned: number;
  answers_detail: any;
  attempt_number: number;
  remaining_attempts: number;
}

// Response types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
  total_pages: number | 1;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Configuration de l'API
export const learningApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_LEARNING_API_URL || 'http://localhost:8002',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      // headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  reducerPath: "learningApi",
  tagTypes: [
    "Courses", 
    "Course", 
    "Modules", 
    "Module", 
    "Lessons", 
    "Lesson", 
    "Enrollments",
    "Progress",
    "Certificates",
    "Quiz",
    "Question"
  ],
  endpoints: (build) => ({
    // =================== COURSES ===================
    getCourses: build.query<PaginatedResponse<Course>, {
      page?: number;
      pageSize?: number;
      search?: string;
      difficulty?: string;
      language?: string;
      category?: string;
      is_free?: boolean;
      sort_by?: string;
    }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.pageSize) queryParams.append('page_size', params.pageSize.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.difficulty) queryParams.append('difficulty', params.difficulty);
        if (params.language) queryParams.append('language', params.language);
        if (params.category) queryParams.append('category', params.category);
        if (params.is_free !== undefined) queryParams.append('is_free', params.is_free.toString());
        if (params.sort_by) queryParams.append('ordering', params.sort_by);
        
        return `api/manage/courses/?${queryParams.toString()}`;
      },
      providesTags: ["Courses"],
    }),

    getCourseBySlug: build.query<Course, string>({
      query: (slug) => `api/courses/${slug}/`,
      providesTags: (result, error, slug) => [{ type: "Course", id: slug }],
    }),

    createCourse: build.mutation<Course, FormData>({
      query: (formData) => ({
        url: 'api/manage/courses/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ["Courses"],
    }),

    // CORRECTION: Pour l'admin, utiliser l'ID
    getCourseById: build.query<Course, string>({
      query: (id) => `api/manage/courses/${id}/`,
      providesTags: (result, error, id) => [{ type: "Course", id }],
    }),

    updateCourse: build.mutation<Course, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `api/manage/courses/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Courses",
        { type: "Course", id: result?.slug },
      ],
    }),

    deleteCourse: build.mutation<void, string>({
      query: (id) => ({
        url: `api/manage/courses/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Courses"],
    }),

    publishCourse: build.mutation<Course, string>({
      query: (id) => ({
        url: `api/manage/courses/${id}/publish/`,
        method: 'POST',
      }),
      invalidatesTags: (result) => [
        "Courses",
        { type: "Course", id: result?.slug },
      ],
    }),

    unpublishCourse: build.mutation<Course, string>({
      query: (id) => ({
        url: `api/manage/courses/${id}/unpublish/`,
        method: 'POST',
      }),
      invalidatesTags: (result) => [
        "Courses",
        { type: "Course", id: result?.slug },
      ],
    }),

    // =================== MODULES ===================
    getCourseModules: build.query<Module[], string>({
      query: (courseId) => `api/manage/modules/?course=${courseId}`,
      providesTags: (result, error, courseId) => [
        { type: "Modules", id: courseId },
      ],
    }),

    getModuleById: build.query<Module, string>({
      query: (id) => `api/manage/modules/${id}/`,
      providesTags: (result, error, id) => [{ type: "Module", id }],
    }),

    createModule: build.mutation<Module, FormData>({
      query: (formData) => ({
        url: 'api/manage/modules/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, args) => {
        const courseId = args.get('course_id') as string | undefined;
        return [{ type: "Modules", id: courseId }];
      },
    }),

    updateModule: build.mutation<Module, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `api/manage/modules/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Module", id }],
    }),

    deleteModule: build.mutation<void, { id: string; courseId: string }>({
      query: ({ id }) => ({
        url: `api/manage/modules/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Modules", id: courseId },
      ],
    }),

    // =================== LESSONS ===================
    getModuleLessons: build.query<Lesson[], string>({
      query: (moduleId) => `api/manage/lessons/?module=${moduleId}`,
      providesTags: (result, error, moduleId) => [
        { type: "Lessons", id: moduleId },
      ],
    }),

    createLesson: build.mutation<Lesson, FormData>({
      query: (formData) => ({
        url: 'api/manage/lessons/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, args) => {
        const moduleId = args.get('module') as string | undefined;
        return [{ type: "Lessons", id: moduleId }];
      },
    }),

    updateLesson: build.mutation<Lesson, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `api/manage/lessons/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Lesson", id }],
    }),

    getLessonById: build.query<Lesson, string>({
      query: (lessonId) => `api/manage/lessons/${lessonId}/`,
      providesTags: (result, error, lessonId) => [{ type: 'Lesson', id: lessonId }],
    }),

    completeLesson: build.mutation<any, { lessonId: string; courseId: string }>({
      query: ({ lessonId, courseId }) => ({
        url: `api/learner/courses/${courseId}/lessons/${lessonId}/complete/`,
        method: 'POST',
      }),
      // invalidatesTags: (result, error, { lessonId, courseId }) => [
      //   { type: 'Lesson', id: lessonId },
      //   { type: 'CourseProgress', id: courseId },
      // ],
    }),

    markLessonInProgress: build.mutation<any, { lessonId: string; courseId: string }>({
      query: ({ lessonId, courseId }) => ({
        url: `api/learner/courses/${courseId}/lessons/${lessonId}/progress/`,
        method: 'POST',
        body: { status: 'in_progress' },
      }),
    }),

    deleteLesson: build.mutation<void, { id: string; moduleId: string }>({
      query: ({ id }) => ({
        url: `api/manage/lessons/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { moduleId }) => [
        { type: "Lessons", id: moduleId },
      ],
    }),

    // =================== QUIZ ===================
    getLessonQuiz: build.query<Quiz, string>({
      query: (lessonId) => `api/manage/quiz/?lesson=${lessonId}`,
      providesTags: (result, error, lessonId) => [
        { type: "Lesson", id: lessonId },
      ],
    }),

    createQuiz: build.mutation<Quiz, Partial<Quiz>>({
      query: (data) => ({
        url: 'api/manage/quiz/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { lesson_id }) => [
        { type: "Lesson", id: lesson_id },
      ],
    }),
    
    getQuizById: build.query<Quiz, string>({
      query: (id) => `api/manage/quiz/${id}/`,
      providesTags: (result, error, id) => [{ type: "Quiz", id }],
    }),

    updateQuiz: build.mutation<Quiz, { id: string; data: Partial<Quiz> }>({
      query: ({ id, data }) => ({
        url: `api/manage/quiz/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Quiz", id }],
    }),

    deleteQuiz: build.mutation<void, string>({
      query: (id) => ({
        url: `api/manage/quiz/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: "Quiz", id }],
    }),

    // =================== QUESTIONS ===================
getQuizQuestions: build.query<Question[], string>({
  query: (quizId) => `api/manage/questions/?quiz=${quizId}`,
  providesTags: (result, error, quizId) => [{ type: "Quiz", id: quizId }],
}),

createQuestion: build.mutation<Question, any>({
  query: (data) => ({
    url: 'api/manage/questions/',
    method: 'POST',
    body: data,
  }),
  transformErrorResponse: (response) => {
    console.error("Erreur création question:", response);
    return response;
  },
  invalidatesTags: (result, error, { quiz }) => [
    { type: "Quiz", id: quiz },
  ],
}),

updateQuestion: build.mutation<Question, { id: string; data: any }>({
  query: ({ id, data }) => ({
    url: `api/manage/questions/${id}/`,
    method: 'PUT',
    body: data,
  }),
  invalidatesTags: (result, error, { id }) => [{ type: "Question", id }],
}),

deleteQuestion: build.mutation<void, string>({
  query: (id) => ({
    url: `api/manage/questions/${id}/`,
    method: 'DELETE',
  }),
  invalidatesTags: (result, error, id) => [{ type: "Question", id }],
}),

// =================== CHOICES ===================
getQuestionChoices: build.query<Choice[], string>({
  query: (questionId) => `api/manage/choices/?question=${questionId}`,
}),

createChoice: build.mutation<Choice, any>({
  query: (data) => ({
    url: 'api/manage/choices/',
    method: 'POST',
    body: data,
  }),
}),

updateChoice: build.mutation<Choice, { id: string; data: any }>({
  query: ({ id, data }) => ({
    url: `api/manage/choices/${id}/`,
    method: 'PUT',
    body: data,
  }),
}),

deleteChoice: build.mutation<void, string>({
  query: (id) => ({
    url: `api/manage/choices/${id}/`,
    method: 'DELETE',
  }),
}),

    // =================== APPRENANT ===================
    enrollCourse: build.mutation<Enrollment, EnrollCourseRequest>({
      query: ({ course_slug }) => ({
        url: `api/enroll/${course_slug}/`,
        method: 'POST',
      }),
      invalidatesTags: ["Enrollments"],
    }),

     getMyEnrollments: build.query<{
      stats: any;
      active_courses: Enrollment[];
      recent_completions: Enrollment[];
      recommended_courses: Course[];
      user_profile: any;
    }, void>({
      query: () => 'api/learner/dashboard/',
      providesTags: ["Enrollments"],
    }),


    //     # GET /api/learner/courses/<course_slug>/ - Détail cours (pour apprenant inscrit)
    // path('learner/courses/<slug:course_slug>/', 
    //      views.LearnerCourseDetailView.as_view(), name='learner-course-detail'),
    getLearnerCourse: build.query<Course, string>({
      query: (courseSlug) => `api/learner/courses/${courseSlug}/`,
      providesTags: (result, error, courseSlug) => [{ type: "Course", id: courseSlug }],
    }),

    getCourseProgress: build.query<{
      course: any;
      enrollment: any;
      stats: any;
      modules: any[];
    }, string>({
      query: (courseSlug) => `api/learner/courses/${courseSlug}/progress/`,
      providesTags: ["Progress"],
    }),

    // CORRECTION: Le endpoint de contenu de leçon
    getLessonContent: build.query<{
      lesson: Lesson;
      progress: any;
      navigation: any;
    }, { courseSlug: string; lessonNumber: number }>({
      query: ({ courseSlug, lessonNumber }) => 
        `api/learner/courses/${courseSlug}/lessons/${lessonNumber}/`,
      providesTags: (result, error, { lessonNumber }) => [
        { type: "Progress", id: lessonNumber },
      ],
    }),


    getQuizQuestionsLearner: build.query<{
      quiz: any;
      questions: Question[];
      current_attempt: number;
    }, { courseSlug: string; lessonNumber: number }>({
      query: ({ courseSlug, lessonNumber }) => 
        `api/learner/courses/${courseSlug}/lessons/${lessonNumber}/quiz/`,
    }),

    submitQuiz: build.mutation<SubmitQuizResponse, {
      courseSlug: string;
      lessonNumber: number;
      data: SubmitQuizRequest;
    }>({
      query: ({ courseSlug, lessonNumber, data }) => ({
        url: `api/learner/courses/${courseSlug}/lessons/${lessonNumber}/quiz/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ["Progress"],
    }),

    getCertificate: build.query<Certificate, string>({
      query: (courseSlug) => `api/learner/courses/${courseSlug}/certificate/`,
      providesTags: ["Certificates"],
    }),

    generateCertificate: build.mutation<Certificate, string>({
      query: (courseSlug) => ({
        url: `api/learner/courses/${courseSlug}/certificate/`,
        method: 'POST',
      }),
      invalidatesTags: ["Certificates"],
    }),

    // =================== DASHBOARD ===================
    getAdminStats: build.query<any, void>({
      query: () => 'api/admin/stats/',
    }),

    getLearnerDashboard: build.query<any, void>({
      query: () => 'api/learner/dashboard/',
    }),

    // =================== CATALOGUE ===================
    getCourseCatalog: build.query<PaginatedResponse<Course>, {
      page?: number;
      pageSize?: number;
      difficulty?: string;
      language?: string;
      category?: string;
    }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.pageSize) queryParams.append('page_size', params.pageSize.toString());
        if (params.difficulty) queryParams.append('difficulty', params.difficulty);
        if (params.language) queryParams.append('language', params.language);
        if (params.category) queryParams.append('category', params.category);
        
        return `api/catalog/?${queryParams.toString()}`;
      },
      providesTags: ["Courses"],
    }),

    // =================== SEARCH ===================
    searchCourses: build.query<PaginatedResponse<Course>, {
      query: string;
      difficulty?: string;
      language?: string;
      is_free?: boolean;
    }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        queryParams.append('search', params.query);
        if (params.difficulty) queryParams.append('difficulty', params.difficulty);
        if (params.language) queryParams.append('language', params.language);
        if (params.is_free !== undefined) queryParams.append('is_free', params.is_free.toString());
        
        return `api/search/?${queryParams.toString()}`;
      },
    }),
  }),
});

// Export des hooks
export const {
  // Courses
  useGetCoursesQuery,
  useGetCourseBySlugQuery,
  useCreateCourseMutation,
  useGetCourseByIdQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  usePublishCourseMutation,
  useUnpublishCourseMutation,
  
  // Modules
  useGetCourseModulesQuery,
  useGetModuleByIdQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
  
  // Lessons
  useGetModuleLessonsQuery,
  useCreateLessonMutation,
  useGetLessonByIdQuery,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  useCompleteLessonMutation,
  useMarkLessonInProgressMutation,
  
  // Quiz
  useGetLessonQuizQuery,
  useCreateQuizMutation,
  useGetQuizByIdQuery,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
 
  // Questions
  useGetQuizQuestionsQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
   
  // Choices
  useGetQuestionChoicesQuery,
  useCreateChoiceMutation,
  useUpdateChoiceMutation,
  useDeleteChoiceMutation,

  // Apprenant
  useEnrollCourseMutation,
  useGetMyEnrollmentsQuery,
  useGetCourseProgressQuery,
  useGetLessonContentQuery,
  useGetQuizQuestionsLearnerQuery,
  useSubmitQuizMutation,
  useGetCertificateQuery,
  useGenerateCertificateMutation,
  
  // Dashboard
  useGetAdminStatsQuery,
  useGetLearnerDashboardQuery,
  
  // Catalogue
  useGetCourseCatalogQuery,
  
  // Search
  useSearchCoursesQuery,
} = learningApi;