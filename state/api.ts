import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
  id: string;
  name: string;
  forename: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
  adresse?: string;
  Profession?: string;
  createdAt: string;
  updatedAt: string;
  
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

}

export const api = createApi({
    baseQuery: fetchBaseQuery({ 
     baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
     prepareHeaders: (headers) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
      }, }),
    reducerPath: "api",
    tagTypes: ["Users"],

    endpoints: (build) => ({

       getCurrentUser: build.query<User, void>({
      query: () => '/user/me/',
      providesTags: ["Users"],
    }),

    })
});

export const { useGetCurrentUserQuery } = api