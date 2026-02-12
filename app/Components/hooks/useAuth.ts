// src/hooks/useAuth.js
import { useEffect, useState } from 'react';
import { useGetCurrentUserQuery } from '@/state/api';

// Interface définissant la structure des données utilisateur
interface User {
  id: string;
  name: string;
  forename: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
  adresse?: string;
  Profession?: string;
  onboarding_completed?: boolean;
  onboarding_step?: number;
  langue_parlee?: string[];
  preference_apprentissage?: string[];
  
  // Champs spécifiques selon le rôle
  company_name?: string;
  Competence?: string | string[];
  niveau_expertise?: string;
  niveau_perte_auditive?: string;
  status_utilisez_vous_un_appareil_auditif?: boolean | Boolean;
  level_en_LSF?: string;
  Jour_disponible?: string | string[];
  Creneau_horaire_disponible?: {
    start: string;
    end: string;
  };
  
  Tarif_horaire?: number;
  Annee_experience?: number;
  Domaine_activity?: string;
  Type_company?: string;
  Adresse_company?: string;
  Taille_Company?: string;
  certification?: string;
  Site_web?: string;
  secondary_roles?: string[];
  preferences?: string[];
 date_joined?:Date;
 updated_at?:Date;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { data, error, isLoading: queryLoading } = useGetCurrentUserQuery();

  useEffect(() => {
    if (!queryLoading) {
      if (data) {
        // Transform the API response to match the local User interface
        const transformedUser: User = {
          ...data,
          Creneau_horaire_disponible: typeof data.Creneau_horaire_disponible === 'string' 
            ? undefined 
            : data.Creneau_horaire_disponible,
        };
        setUser(transformedUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    }
  }, [data, queryLoading]);

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isInstructor: user?.role === 'traducteur' || user?.role === 'admin' || user?.role === 'employeur',
    isLearner: user?.role === 'apprenant' || user?.secondary_roles?.includes('apprenant'),
  };
};