import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
  user: any;
  id: string;
  name: string;
  forename: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
  adresse?: string;
  Profession?: string;
  date_joined: Date;
  updated_at: Date;

  // Champs spécifiques selon le rôle
  niveau_perte_auditive?: string;// Pour Malentendant
  status_utilisez_vous_un_appareil_auditif?: Boolean;// Pour Malentendant
  level_en_LSF?: string; // Pour Malentendant
  langue_parlee?:string[];//Malentendant, entendant, apprenant et Traducteur LSF
  preference_apprentissage?: string[]; // Pour apprenant
  certification?: string; // Pour traducteur
  Annee_experience?: number; // Pour traducteur
  niveau_expertise?: string;// Pour traducteur
  Competence?: string;// Pour traducteur
  Jour_disponible?: string;// Pour traducteur
  Creneau_horaire_disponible?: string;// Pour traducteur
  Tarif_horaire?: number;// Pour traducteur
  company_name?: string; // Pour employeur
  Domaine_activity?: string;//Pour employeur
  Type_company?: string;//Pour employeur
  Adresse_company?: string;//Pour employeur
  Taille_Company?: string;//Pour employeur
  Site_web?: string;//Pour employeur
  secondary_roles?: string[];
  onboarding_completed?:boolean;
  onboarding_step?: number;
  preferences?: string[];

}

// Interface pour la mise à jour des rôles
export interface UpdateRolesRequest {
  role: string;
  secondary_roles: string[];
}

export interface UpdateRolesResponse {
  message: string;
  user: User;
}

export interface AdvancedProfileRequest {
  // Pour employeur
  company_name?: string;
  Domaine_activity?: string;
  Type_company?: string;
  Adresse_company?: string;
  Taille_Company?: string;
  Site_web?: string;
  
  // Pour traducteur
  certification?: string;
  Annee_experience?: number;
  niveau_expertise?: string;
  Competence?: string;
  Jour_disponible?: string;
  Creneau_horaire_disponible?: string;
  Tarif_horaire?: number;
  
  // Pour malentendant
  niveau_perte_auditive?: string;
  status_utilisez_vous_un_appareil_auditif?: boolean;
  level_en_LSF?: string;
  
  // Pour apprenant
  preference_apprentissage?: string[];
  
  // Commun (langues)
  langue_parlee?: string[];
}

export interface AdvancedProfileResponse {
  success: boolean;
  message: string;
  user: User;
  next_step?: string;
}

export interface PreferencesRequest {
  email_notifications?: boolean;
  push_notifications?: boolean;
  // marketing_emails?: boolean;
  // auto_subtitles?: boolean;
  // sign_language_videos?: boolean;
  // high_contrast_mode?: boolean;
  // font_size?: string;
  timezone?: string;
  language?: string;
  profile_visibility?: string;
  show_online_status?: boolean;
  langue_parlee?: string[];
}

export interface PreferencesResponse {
  success: boolean;
  message: string;
  user: User;
  redirect: string;
}

export interface UpdateAvatarResponse {
  success: boolean;
  message: string;
  avatar_url?: string;
}


export interface UpdateSecondaryRoleProfileRequest {
  role: string;
  data: Partial<AdvancedProfileRequest>; 
}

export interface UpdateSecondaryRoleProfileResponse {
  success: boolean;
  message: string;
  role: string;
  user: User;
}

export interface UpdateAvatarResponse {
  success: boolean;
  message: string;
  avatar_url?: string;

}


export const api = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access_token"); 
      console.log('Token récupéré:', token); 
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        console.log('Headers Authorization:', headers.get('Authorization'));
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: ["User", "Profile"],
  
  endpoints: (build) => ({
    // Récupérer l'utilisateur 
    getCurrentUser: build.query<User, void>({
      query: () => '/user/me/',
      providesTags: ["User"],
    }),
    
    // Mettre à jour les rôles (onboarding étape 2)
    updateUserRoles: build.mutation<UpdateRolesResponse, UpdateRolesRequest>({
      query: (rolesData) => ({
        url: '/onboarding/roles/',
        method: 'PUT',
        body: rolesData,
      }),
      invalidatesTags: ["User"],
    }),

    // Inscription
    // registerUser: build.mutation<any, {
    //   email: string;
    //   name: string;
    //   forename: string;
    //   password: string;
    // }>({
    //   query: (userData) => ({
    //     url: '/register/',
    //     method: 'POST',
    //     body: userData,
    //   }),
    // }),
    
    // Login (pour plus tard)
    loginUser: build.mutation<any, {
      email: string;
      password: string;
    }>({
      query: (credentials) => ({
        url: '/login/',
        method: 'POST',
        body: credentials,
      }),
    }),
    updateBasicProfile: build.mutation<any, FormData>({
      query: (formData) => ({
        url: '/onboarding/basic-profile/',
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

    updateAdvancedProfile: build.mutation<AdvancedProfileResponse, AdvancedProfileRequest>({
      query: (profileData) => ({
        url: '/onboarding/advanced-profile/',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ["User"],
    }),

    // Sauvegarder les préférences et terminer l'onboarding
    updatePreferences: build.mutation<PreferencesResponse, PreferencesRequest>({
      query: (preferencesData) => ({
        url: '/onboarding/preferences/',
        method: 'PUT',
        body: preferencesData,
      }),
      invalidatesTags: ["User"],
    }),

     // Marquer l'onboarding comme terminé (optionnel)
    completeOnboarding: build.mutation({
      query: () => ({
        url: '/onboarding/complete/',
        method: 'POST',
      }),
      invalidatesTags: ["User"],
    }),

updateSecondaryRoleProfile: build.mutation<
UpdateSecondaryRoleProfileResponse,
UpdateSecondaryRoleProfileRequest
>({
  query: ({ role, data }) => ({
    url: `/user/me/secondary-roles/${role}/`,  // Rôle dans l'URL
    method: 'PATCH',
    body: data,  // Seulement les données dans le body
  }),
  invalidatesTags: ["User"],
}),

    getTempData: build.query<{company_name: string; niveau_expertise: string}, void>({
      queryFn: () => ({
        data: {
          company_name: localStorage.getItem('temp_company_name') || '',
          niveau_expertise: localStorage.getItem('temp_translator_level') || ''
        }
      }),
    }),
    // Endpoint pour update le profile d'un utilisateur connecté
    updateProfile: build.mutation<User, {data: Partial<User>}>({
      query: (data) => ({
        url: '/user/update/',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    updateAvatar: build.mutation<UpdateAvatarResponse, FormData>({
      query: (formData) => ({
        url: '/user/update-avatar/',
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

  }),
});

// Exportez les hooks
export const { 
  useGetCurrentUserQuery,
  useUpdateUserRolesMutation,
  useUpdateSecondaryRoleProfileMutation, 
  // useRegisterUserMutation,
  useLoginUserMutation,
  useUpdateBasicProfileMutation,
  useUpdateAdvancedProfileMutation,
  useUpdatePreferencesMutation,
  useCompleteOnboardingMutation,
  useGetTempDataQuery,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
} = api;