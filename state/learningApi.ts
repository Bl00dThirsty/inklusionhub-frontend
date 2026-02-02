
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  subtitle?: string;
  description: string;
  order: number;
  total_points: number;
  estimated_hours: number;
  image?: string;
  lesson_count: number;
}

export interface Lesson {
  id: string;
  module_id: string;
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
  attachments: any[];
}

export interface Quiz {
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
}

export interface Question {
  id: string;
  quiz_id: string;
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
    "Certificates"
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
      query: (slug) => `courses/${slug}/`,
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
      query: (id) => `manage/courses/${id}/`,
      providesTags: (result, error, id) => [{ type: "Course", id }],
    }),

    updateCourse: build.mutation<Course, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `manage/courses/${id}/`,
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
        url: `manage/courses/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Courses"],
    }),

    publishCourse: build.mutation<Course, string>({
      query: (id) => ({
        url: `manage/courses/${id}/publish/`,
        method: 'POST',
      }),
      invalidatesTags: (result) => [
        "Courses",
        { type: "Course", id: result?.slug },
      ],
    }),

    unpublishCourse: build.mutation<Course, string>({
      query: (id) => ({
        url: `manage/courses/${id}/unpublish/`,
        method: 'POST',
      }),
      invalidatesTags: (result) => [
        "Courses",
        { type: "Course", id: result?.slug },
      ],
    }),

    // =================== MODULES ===================
    getCourseModules: build.query<Module[], string>({
      query: (courseId) => `manage/modules/?course=${courseId}`,
      providesTags: (result, error, courseId) => [
        { type: "Modules", id: courseId },
      ],
    }),

    createModule: build.mutation<Module, FormData>({
      query: (formData) => ({
        url: 'manage/modules/',
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
        url: `manage/modules/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Module", id }],
    }),

    deleteModule: build.mutation<void, { id: string; courseId: string }>({
      query: ({ id }) => ({
        url: `manage/modules/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Modules", id: courseId },
      ],
    }),

    // =================== LESSONS ===================
    getModuleLessons: build.query<Lesson[], string>({
      query: (moduleId) => `manage/lessons/?module=${moduleId}`,
      providesTags: (result, error, moduleId) => [
        { type: "Lessons", id: moduleId },
      ],
    }),

    createLesson: build.mutation<Lesson, FormData>({
      query: (formData) => ({
        url: 'manage/lessons/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, args) => {
        const moduleId = args.get('module_id') as string | undefined;
        return [{ type: "Lessons", id: moduleId }];
      },
    }),

    updateLesson: build.mutation<Lesson, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `manage/lessons/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Lesson", id }],
    }),

    deleteLesson: build.mutation<void, { id: string; moduleId: string }>({
      query: ({ id }) => ({
        url: `manage/lessons/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { moduleId }) => [
        { type: "Lessons", id: moduleId },
      ],
    }),

    // =================== QUIZ ===================
    getLessonQuiz: build.query<Quiz, string>({
      query: (lessonId) => `manage/quiz/?lesson=${lessonId}`,
      providesTags: (result, error, lessonId) => [
        { type: "Lesson", id: lessonId },
      ],
    }),

    createQuiz: build.mutation<Quiz, Partial<Quiz>>({
      query: (data) => ({
        url: 'manage/quiz/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { lesson_id }) => [
        { type: "Lesson", id: lesson_id },
      ],
    }),

    // =================== APPRENANT ===================
    enrollCourse: build.mutation<Enrollment, EnrollCourseRequest>({
      query: ({ course_slug }) => ({
        url: `courses/${course_slug}/enroll/`,
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
      query: () => 'learner/dashboard/',
      providesTags: ["Enrollments"],
    }),

    getCourseProgress: build.query<{
      course: any;
      enrollment: any;
      stats: any;
      modules: any[];
    }, string>({
      query: (courseSlug) => `learner/courses/${courseSlug}/progress/`,
      providesTags: ["Progress"],
    }),

    // CORRECTION: Le endpoint de contenu de leçon
    getLessonContent: build.query<{
      lesson: Lesson;
      progress: any;
      navigation: any;
    }, { courseSlug: string; lessonNumber: number }>({
      query: ({ courseSlug, lessonNumber }) => 
        `learner/courses/${courseSlug}/lessons/${lessonNumber}/`,
      providesTags: (result, error, { lessonNumber }) => [
        { type: "Progress", id: lessonNumber },
      ],
    }),


    getQuizQuestions: build.query<{
      quiz: any;
      questions: Question[];
      current_attempt: number;
    }, { courseSlug: string; lessonNumber: number }>({
      query: ({ courseSlug, lessonNumber }) => 
        `learner/courses/${courseSlug}/lessons/${lessonNumber}/quiz/`,
    }),

    submitQuiz: build.mutation<SubmitQuizResponse, {
      courseSlug: string;
      lessonNumber: number;
      data: SubmitQuizRequest;
    }>({
      query: ({ courseSlug, lessonNumber, data }) => ({
        url: `learner/courses/${courseSlug}/lessons/${lessonNumber}/quiz/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ["Progress"],
    }),

    getCertificate: build.query<Certificate, string>({
      query: (courseSlug) => `learner/courses/${courseSlug}/certificate/`,
      providesTags: ["Certificates"],
    }),

    generateCertificate: build.mutation<Certificate, string>({
      query: (courseSlug) => ({
        url: `learner/courses/${courseSlug}/certificate/`,
        method: 'POST',
      }),
      invalidatesTags: ["Certificates"],
    }),

    // =================== DASHBOARD ===================
    getAdminStats: build.query<any, void>({
      query: () => 'admin/stats/',
    }),

    getLearnerDashboard: build.query<any, void>({
      query: () => 'learner/dashboard/',
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
        
        return `catalog/?${queryParams.toString()}`;
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
        
        return `search/?${queryParams.toString()}`;
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
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  usePublishCourseMutation,
  useUnpublishCourseMutation,
  
  // Modules
  useGetCourseModulesQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
  
  // Lessons
  useGetModuleLessonsQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  
  // Quiz
  useGetLessonQuizQuery,
  useCreateQuizMutation,
  
  // Apprenant
  useEnrollCourseMutation,
  useGetMyEnrollmentsQuery,
  useGetCourseProgressQuery,
  useGetLessonContentQuery,
  useGetQuizQuestionsQuery,
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