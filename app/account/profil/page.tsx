'use client';

// Importations des dépendances React et Next.js
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useGetCurrentUserQuery, useUpdateSecondaryRoleProfileMutation } from '@/state/api';

// Importation des composants UI personnalisés
import { UserProfileForm } from '../../Components/UserProfileForm';
import DashboardHeader from '../../Components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../Components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../Components/ui/avatar';
import { Badge, getBadgeVariantFromRole } from '../../Components/ui/badge';
import { Button } from '../../Components/ui/button';
import { Loader2, X } from 'lucide-react';
import { SecondaryRolesDisplay } from './SecondaryRoles';
import { UserRole } from './SecondaryRoles';

// Interface définissant la structure des données utilisateur
interface UserData {
  id: string;
  name: string;
  forename: string;
  email: string;
   role: UserRole;
  phone?: string;
  avatar?: string;
  adresse?: string;
  Profession?: string;
  onboarding_completed: boolean;
  onboarding_step: number;
  langue_parlee: string[];
  preference_apprentissage?: string[];
  
  // Champs spécifiques selon le rôle
  company_name?: string;
  Competence?: string;
  niveau_expertise?: string;
  niveau_perte_auditive?: string;
  status_utilisez_vous_un_appareil_auditif?: boolean;
  level_en_LSF?: string;
  Jour_disponible?: string;
  Creneau_horaire_disponible?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Page de profil utilisateur - Composant principal
 * Affiche et permet de modifier le profil de l'utilisateur connecté
 * Gère l'édition, la sauvegarde et l'affichage des informations
 */
export default function ProfilePage() { 
  const router = useRouter();
  
  // États pour gérer le mode édition et la sauvegarde
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Récupération des données utilisateur via RTK Query
  const { 
    data: apiUserData, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetCurrentUserQuery();  

  // État local pour les données utilisateur en cours d'édition
  const [user, setUser] = useState<UserData>({
    id: '',
    name: '',
    forename: '',
    email: '',
    role: 'malentendant',
    phone: '',
    avatar: '',
    adresse: '',
    Profession: '',
    onboarding_completed: false,
    onboarding_step: 1,
    langue_parlee: [],
    company_name: '',
    niveau_expertise: '',
    niveau_perte_auditive: '',
    status_utilisez_vous_un_appareil_auditif: false,
    level_en_LSF: '',
    Jour_disponible: '',
    Creneau_horaire_disponible: '',
    Tarif_horaire: 0,
    Annee_experience: 0,
    Domaine_activity: '',
    Type_company: '',
    Adresse_company: '',
    Taille_Company: '',
    certification: '',
    Site_web: '',
    secondary_roles: [],
    preferences: [],
    createdAt: '',
    updatedAt: '',
  });

  // Fonction utilitaire pour sécuriser le rôle de l'utilisateur
const parseUserRole = (role: string | undefined): UserRole => {
  const validRoles: UserRole[] = ['apprenant','entendant','malentendant','employeur','traducteur','admin'];
  return role && validRoles.includes(role as UserRole) ? (role as UserRole) : 'malentendant';
};

  /**
   * Effet pour synchroniser les données de l'API avec l'état local
   * Se déclenche lorsque les données de l'API changent
   */
  useEffect(() => {
    if (apiUserData) {
      // Déterminer la structure des données selon la réponse API
      let userData;
      
      if (apiUserData.user) {
        // Structure: { success: true, user: {...} }
        userData = apiUserData.user;
      } else if (apiUserData.id) {
        // Structure: user directement dans la réponse
        userData = apiUserData;
      } else {
        console.error('Structure API inattendue:', apiUserData);
        return;
      }
      
      console.log('Rôles secondaires API:', userData.secondary_roles);
      // Mettre à jour l'état local avec les données formatées
      setUser({
        id: userData.id || '',
        name: userData.name || '',
        forename: userData.forename || '',
        email: userData.email || '',
        role: userData.role || 'malentendant',
        phone: userData.phone || '',
        avatar: userData.avatar || '',
        adresse: userData.adresse || '',
        Profession: userData.Profession || '',
        onboarding_completed: userData.onboarding_completed || false,
        onboarding_step: userData.onboarding_step || 1,
        preference_apprentissage: Array.isArray(userData.preference_apprentissage) ? userData.preference_apprentissage : [],
        langue_parlee: Array.isArray(userData.langue_parlee) ? userData.langue_parlee : [],
        level_en_LSF: userData.level_en_LSF || '',
        company_name: userData.company_name || '',
        niveau_expertise: userData.niveau_expertise || '',
        niveau_perte_auditive: userData.niveau_perte_auditive || '',
        status_utilisez_vous_un_appareil_auditif: userData.status_utilisez_vous_un_appareil_auditif || false,
        Jour_disponible: userData.Jour_disponible || '',
        Creneau_horaire_disponible: userData.Creneau_horaire_disponible || '',
        Tarif_horaire: userData.Tarif_horaire || 0,
        Domaine_activity: userData.Domaine_activity || '',
        Annee_experience: userData.Annee_experience || 0,
        Type_company: userData.Type_company || '',
        Adresse_company: userData.Adresse_company || '',
        Taille_Company: userData.Taille_Company || '',
        certification: userData.certification || '',
        Site_web: userData.Site_web || '',
        secondary_roles: Array.isArray(userData.secondary_roles) ? userData.secondary_roles : [],
        preferences: Array.isArray(userData.preferences) ? userData.preferences : [],
        createdAt: userData.createdAt || '',
        updatedAt: userData.updatedAt || '',
      });
    }
  }, [apiUserData]);
  
  /**
   * Effet pour rediriger en cas d'erreur d'authentification
   * Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
   */
  useEffect(() => {
    if (isError) {
      console.error('Erreur de chargement du profil:', error);
      router.push('/sign-in');
    }
  }, [isError, error, router]);
  
  /**
   * Gère les changements dans les champs du formulaire
   * @param field - Nom du champ à modifier
   * @param value - Nouvelle valeur du champ
   */
  const handleInputChange = (field: string, value: any) => {
    setUser(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  /**
   * Bascule entre le mode édition et le mode visualisation
   * Réinitialise les données en cas d'annulation
   */
  const handleEditToggle = () => {
    if (isEditing) {
      // Annuler l'édition et recharger les données originales
      if (apiUserData) {
        const originalData = apiUserData.user || apiUserData;
        setUser(prev => ({ ...prev, ...originalData }));
      }
    }
    setIsEditing(!isEditing);
    setSaveError(null);
    setSaveSuccess(false);
  };
  
  /**
   * Sauvegarde les modifications du profil
   * Envoie les données mises à jour à l'API
   */
  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    try {
      // TODO: Remplacer par l'appel API réel de mise à jour
      console.log('Envoi des données pour sauvegarde:', user);
      
      // Simulation d'un appel API (à remplacer par votre logique réelle)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Exemple d'appel API (à adapter selon votre implémentation)
      // const response = await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(user),
      // });
      
      // if (!response.ok) throw new Error('Échec de la sauvegarde');
      
      setSaveSuccess(true);
      setIsEditing(false);
      
      // Recharger les données fraîches depuis l'API
      refetch();
      
      // Cacher le message de succès après 3 secondes
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSaveError('Échec de la sauvegarde. Veuillez vérifier vos données et réessayer.');
    } finally {
      setIsSaving(false);
    }
  };
  
  /**
   * Génère les initiales à partir du prénom et du nom
   * Utilise useMemo pour éviter les recalculs inutiles
   */
  const initials = useMemo(() => {
    if (!user.forename && !user.name) return '??';
    
    const firstInitial = user.forename ? user.forename[0].toUpperCase() : '';
    const lastInitial = user.name ? user.name[0].toUpperCase() : '';
    
    return `${firstInitial}${lastInitial}` || '??';
  }, [user.forename, user.name]);
  
  /**
   * Traduit le rôle de l'utilisateur en libellé lisible
   */
  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      'apprenant': 'Apprenant',
      'entendant': 'Personne entendante',
      'malentendant': 'Personne malentendante',
      'employeur': 'Employeur',
      'traducteur': 'Traducteur LSF',
      'admin': 'Administrateur'
    };
    return roleLabels[role] || role;
  };
  
  /**
   * Détermine la classe CSS pour le badge de rôle
   * @param role - Rôle de l'utilisateur
   * @returns Classes Tailwind pour le badge
   */
  const getRoleColor = (role: string) => {
    const roleColors: Record<string, string> = {
      'apprenant': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'entendant': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'malentendant': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'employeur': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      'traducteur': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'admin': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return roleColors[role] || 'bg-gray-100 text-gray-800';
  };
  

  // État pour gérer le rôle secondaire sélectionné et l'ouverture du modal
 const [selectedSecondaryRole, setSelectedSecondaryRole] = useState<UserRole | null>(null);
 const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
 const [isEditingSecondaryRole, setIsEditingSecondaryRole] = useState(false);
 const [secondaryRoleBackup, setSecondaryRoleBackup] = useState<UserData | null>(null);

 const [updateSecondaryRoleProfile] = useUpdateSecondaryRoleProfileMutation();

  const getSecondaryRoleData = (role: UserRole) => {
  switch(role) {
    case 'apprenant':
      return {
        preference_apprentissage: user.preference_apprentissage || [],
        langue_parlee: user.langue_parlee || [],
        level_en_LSF: user.level_en_LSF || ''
      };
    case 'traducteur':
    return {
      certification: user.certification || '',
      Annee_experience: user.Annee_experience || 0,
      niveau_expertise: user.niveau_expertise || '',
      Competence: user.Competence || '',
      Jour_disponible: user.Jour_disponible || '',
      Creneau_horaire_disponible: user.Creneau_horaire_disponible || '',
      Tarif_horaire: user.Tarif_horaire || 0
    };
    case 'employeur':
      return {
        company_name: user.company_name || '',
        Domaine_activity: user.Domaine_activity || '',
        Type_company: user.Type_company || '',
        Adresse_company: user.Adresse_company || '',
        Taille_Company: user.Taille_Company || '',
        Site_web: user.Site_web || ''
      };
    case 'malentendant':
      return {
        niveau_perte_auditive: user.niveau_perte_auditive || '',
        status_utilisez_vous_un_appareil_auditif: user.status_utilisez_vous_un_appareil_auditif || false,
        level_en_LSF: user.level_en_LSF || ''
      };
    case 'entendant':
      return {
        Profession: user.Profession || ''
      };
    default:
      return {};
  }
};

const handleSaveSecondaryRole = async () => {
    if (!selectedSecondaryRole) return;
    try {
      const response = await updateSecondaryRoleProfile({
        role: selectedSecondaryRole,
        data: getSecondaryRoleData(selectedSecondaryRole)
      }).unwrap();

      console.log("Profil secondaire mis à jour :", response.user);

      // Mise à jour locale des rôles secondaires si besoin
      setUser(prev => ({
        ...prev,
        secondary_roles: prev.secondary_roles?.includes(selectedSecondaryRole)
          ? prev.secondary_roles
          : [...(prev.secondary_roles || []), selectedSecondaryRole]
      }));

      setIsEditingSecondaryRole(false);
      setIsRoleDialogOpen(false);
    } catch (err: any) {
      console.error("Erreur lors de la sauvegarde :", err?.data?.message || err?.message || err);
    }
  };


  /**
   * Formate une date ISO en format français lisible
   * @param dateString - Date au format ISO string
   * @returns Date formatée en français
   */
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non spécifié';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
      return 'Date invalide';
    }
  };
  
  /**
   * Génère l'URL complète de l'avatar
   * Gère différents formats d'URL (absolues, relatives, stockage local)
   */
  const getAvatarUrl = (avatarPath: string | undefined): string => {
    if (!avatarPath) return '';
    
    // Si déjà une URL complète
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
      return avatarPath;
    }
    
    // Si chemin relatif commençant par /
    if (avatarPath.startsWith('/')) {
      return avatarPath;
    }
    
    // Ajouter le chemin de base de l'API
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return `${baseUrl}/media/${avatarPath}`;
  };
  
  // URL d'avatar calculée
  const avatarUrl = getAvatarUrl(user.avatar);
  
  /**
   * Calcule le pourcentage de complétion du profil
   * Basé sur l'état d'onboarding de l'utilisateur
   */
  const calculateOnboardingProgress = () => {
    if (user.onboarding_completed) return 100;
    return Math.min(user.onboarding_step * 20, 100);
  };
  
  const onboardingProgress = calculateOnboardingProgress(); 
  // Gestion des états de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement du profil...</p>
        </div>
      </div>
    );
  }
  
  // Gestion des erreurs de chargement
  if (isError) {
  // Fonction pour extraire le message d'erreur de manière sécurisée
  const getErrorMessage = () => {
    if (error) {
      // Vérifier si c'est une erreur avec une propriété data
      if ('data' in error) {
        // Type assertion pour FetchBaseQueryError
        const fetchError = error as { data?: { message?: string } };
        return fetchError.data?.message || 'Impossible de charger votre profil.';
      }
      // Vérifier si c'est une SerializedError
      if ('message' in error) {
        return error.message || 'Une erreur est survenue.';
      }
    }
    return 'Impossible de charger votre profil. Veuillez réessayer.';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center max-w-md p-6">
        <div className="text-red-500 mb-4">
          <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Erreur de chargement
        </h2>
        {/* CORRECTION ICI : Utiliser la fonction getErrorMessage() */}
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {getErrorMessage()}
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => refetch()} variant="outline">
            Réessayer
          </Button>
          <Button onClick={() => router.push('/sign-in')}>
            Se connecter
          </Button>
        </div>
      </div>
    </div>
  );
}
  
  // Vérification que les données utilisateur existent
  if (!user || !user.id) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Utilisateur non trouvé
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Veuillez vous connecter pour accéder à votre profil.
          </p>
          <Button 
            onClick={() => router.push('/sign-in')}
            className="mt-4"
          >
            Se connecter
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* En-tête du tableau de bord avec informations utilisateur */}
      <DashboardHeader 
        userName={`${user.forename} ${user.name}`}
        userRole={user.role}
        userEmail={user.email}
        userAvatar={user.avatar}
      />
      
      <div className="container mx-auto px-4 py-8">
        
        {/* Section d'en-tête avec titre et boutons d'action */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mon Profil</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gérez vos informations personnelles et vos préférences
            </p>
          </div>
          
          {/* Messages de statut et boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {saveSuccess && (
              <div className="mb-2 p-2 bg-green-100 text-green-700 rounded-md text-sm dark:bg-green-900 dark:text-green-300">
               Profil mis à jour avec succès
              </div>
            )}
            
            {saveError && (
              <div className="mb-2 p-2 bg-red-100 text-red-700 rounded-md text-sm dark:bg-red-900 dark:text-red-300">
                 {saveError}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                onClick={handleEditToggle}
                variant={isEditing ? "outline" : "default"}
                disabled={isSaving}
              >
                {isEditing ? 'Annuler' : 'Modifier le profil'}
              </Button>
              
              {isEditing && (
                <Button 
                  onClick={handleSaveProfile}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sauvegarde...
                    </>
                  ) : 'Sauvegarder'}
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Grille principale avec deux colonnes sur grand écran */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne de gauche - Informations générales et statut */}
          <div className="lg:col-span-1 space-y-6">
            {/* Carte d'identité utilisateur */}
            <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Avatar utilisateur avec fallback aux initiales */}
                  <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-800 shadow-md">
                    <AvatarImage src={avatarUrl} alt={`${user.forename} ${user.name}`} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Nom et email */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {user.forename} {user.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                    
                    {/* Badge du rôle principal */}
                    <Badge className={`mt-2 ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </Badge>
                  </div>
                  
                  {/* Informations de date */}
                  <div className="w-full pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <p>Membre depuis le {formatDate(user.createdAt)}</p>
                    {user.updatedAt && (
                      <p>Dernière mise à jour : {formatDate(user.updatedAt)}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Carte de statut du compte */}
            <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white">Statut du compte</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Email vérifié */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Email vérifié</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300">
                      ✓ Vérifié
                    </Badge>
                  </div>
                  
                  {/* Progression du profil */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Profil complété</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300">
                      {onboardingProgress}%
                    </Badge>
                  </div>
                  
                  {/* Statut d'abonnement */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Abonnement</span>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900 dark:text-amber-300">
                      Gratuit
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Colonne de droite - Formulaire et détails par onglets */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="w-full">
              {/* Navigation par onglets */}
              <TabsList className="grid grid-cols-3 mb-8 dark:bg-gray-800">
                <TabsTrigger value="profile" className="dark:text-gray-300">Profil</TabsTrigger>
                <TabsTrigger value="preferences" className="dark:text-gray-300">Préférences</TabsTrigger>
                <TabsTrigger value="security" className="dark:text-gray-300">Sécurité</TabsTrigger>
              </TabsList>
              
              {/* Onglet Profil - Informations principales */}
              <TabsContent value="profile" className="space-y-6">
                {/* Carte des informations personnelles */}
                <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Informations personnelles</CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      {isEditing 
                        ? 'Modifiez vos informations personnelles' 
                        : 'Vos informations personnelles'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Formulaire de profil utilisateur */}
                    <UserProfileForm
                      user={user}
                      isEditing={isEditing}
                      onInputChange={handleInputChange}
                      userType={user.role}
                    />
                  </CardContent>
                </Card>
                
                {/* Informations spécifiques selon le rôle */}
                {['apprenant', 'traducteur', 'employeur', 'malentendant'].includes(user.role) && (
                  <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-gray-900 dark:text-white">
                        {user.role === 'apprenant' && "Informations d'apprenant"}
                        {user.role === 'traducteur' && 'Informations de traducteur'}
                        {user.role === 'employeur' && 'Informations professionnelles'}
                        {user.role === 'malentendant' && "Préférences d'accessibilité"}
                      </CardTitle>
                      <CardDescription className="dark:text-gray-400">
                        {user.role === 'apprenant' && "Ces informations aident à personnaliser votre expérience d'apprentissage."}
                        {user.role === 'traducteur' && 'Vos informations professionnelles en tant que traducteur LSF.'}
                        {user.role === 'employeur' && 'Vos informations en tant qu’employeur.'}
                        {user.role === 'malentendant' && 'Configurez vos préférences pour une meilleure expérience.'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Affichage des rôles secondaires avec le composant réutilisable */}
                        {user.role !== 'admin' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Rôles secondaires
                            </label>
                             <SecondaryRolesDisplay
                                secondaryRoles={user.secondary_roles || []}
                                mainRole={user.role}
                                selectable={true} 
                                editable={isEditing}
                                onRoleSelect={(roleString: string) => {
                                  console.log("Rôle sélectionné:", roleString);
                                  const role = parseUserRole(roleString);
                                  setSelectedSecondaryRole(role);
                                  setIsRoleDialogOpen(true);
                                }}
                                onRemoveRole={(role: string) => {
                                  const updatedRoles = (user.secondary_roles || []).filter(r => r !== role);
                                  handleInputChange('secondary_roles', updatedRoles);
                                }}
                              />
                            </div>
                          )}

                          {/* Modal pour rôle secondaire */}
                          {isRoleDialogOpen && selectedSecondaryRole && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <Badge className={getRoleColor(selectedSecondaryRole)}>
            {getRoleLabel(selectedSecondaryRole)}
          </Badge>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Profil {getRoleLabel(selectedSecondaryRole)}
          </h3>
        </div>
      </div>
      {/* CONTENU */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* ENTENDANT */}
        {selectedSecondaryRole === 'entendant' && (
          <div>
            <label className="text-sm font-medium">Profession</label>
            {!isEditingSecondaryRole ? (
              <p>{user.Profession || '—'}</p>
            ) : (
              <input
                className="w-full border rounded px-3 py-2"
                value={user.Profession || ''}
                onChange={(e) =>
                  handleInputChange('Profession', e.target.value)
                }
              />
            )}
          </div>
        )}

        {/* APPRENANT */}
        {selectedSecondaryRole === 'apprenant' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Préférences d'apprentissage</label>
                {!isEditingSecondaryRole ? (
                  <p>{(user.preference_apprentissage || []).join(', ') || '—'}</p>
                ) : (
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={(user.preference_apprentissage || []).join(', ')}
                    onChange={(e) =>
                      handleInputChange('preference_apprentissage', e.target.value.split(',').map(s => s.trim()))
                    }
                  />
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Langues parlées</label>
                {!isEditingSecondaryRole ? (
                  <p>{(user.langue_parlee || []).join(', ') || '—'}</p>
                ) : (
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={(user.langue_parlee || []).join(', ')}
                    onChange={(e) =>
                      handleInputChange('langue_parlee', e.target.value.split(',').map(s => s.trim()))
                    }
                  />
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium">Niveau en LSF</label>
                {!isEditingSecondaryRole ? (
                  <p>{user.level_en_LSF || '—'}</p>
                ) : (
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={user.level_en_LSF || ''}
                    onChange={(e) => handleInputChange('level_en_LSF', e.target.value)}
                  />
                )}
              </div>
            </div>
          )}
        {/* TRADUCTEUR */}
        {selectedSecondaryRole === 'traducteur' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Certification</label>
              {!isEditingSecondaryRole ? (
                <p>{user.certification || '—'}</p>
              ) : (
                <input
                  className="w-full border rounded px-3 py-2"
                  value={user.certification || ''}
                  onChange={(e) => handleInputChange('certification', e.target.value)}
                />
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Années d’expérience</label>
              {!isEditingSecondaryRole ? (
                <p>{user.Annee_experience || '—'}</p>
              ) : (
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={user.Annee_experience || 0}
                  onChange={(e) => handleInputChange('Annee_experience', Number(e.target.value))}
                />
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Niveau d’expertise</label>
              {!isEditingSecondaryRole ? (
                <p>{user.niveau_expertise || '—'}</p>
              ) : (
                <input
                  className="w-full border rounded px-3 py-2"
                  value={user.niveau_expertise || ''}
                  onChange={(e) => handleInputChange('niveau_expertise', e.target.value)}
                />
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Compétences</label>
              {!isEditingSecondaryRole ? (
                <p>{user.Competence || '—'}</p>
              ) : (
                <input
                  className="w-full border rounded px-3 py-2"
                  value={user.Competence || ''}
                  onChange={(e) => handleInputChange('Competence', e.target.value)}
                />
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Jour disponible</label>
              {!isEditingSecondaryRole ? (
                <p>{user.Jour_disponible || '—'}</p>
              ) : (
                <input
                  className="w-full border rounded px-3 py-2"
                  value={user.Jour_disponible || ''}
                  onChange={(e) => handleInputChange('Jour_disponible', e.target.value)}
                />
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Créneau horaire disponible</label>
              {!isEditingSecondaryRole ? (
                <p>{user.Creneau_horaire_disponible || '—'}</p>
              ) : (
                <input
                  className="w-full border rounded px-3 py-2"
                  value={user.Creneau_horaire_disponible || ''}
                  onChange={(e) => handleInputChange('Creneau_horaire_disponible', e.target.value)}
                />
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Tarif horaire</label>
              {!isEditingSecondaryRole ? (
                <p>{user.Tarif_horaire || '—'}</p>
              ) : (
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={user.Tarif_horaire || 0}
                  onChange={(e) => handleInputChange('Tarif_horaire', Number(e.target.value))}
                />
              )}
            </div>
          </div>
        )}

        {/* EMPLOYEUR */}
        {selectedSecondaryRole === 'employeur' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Entreprise</label>
                  {!isEditingSecondaryRole ? (
                    <p>{user.company_name || '—'}</p>
                  ) : (
                    <input
                      className="w-full border rounded px-3 py-2"
                      value={user.company_name || ''}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                    />
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Domaine</label>
                  {!isEditingSecondaryRole ? (
                    <p>{user.Domaine_activity || '—'}</p>
                  ) : (
                    <input
                      className="w-full border rounded px-3 py-2"
                      value={user.Domaine_activity || ''}
                      onChange={(e) => handleInputChange('Domaine_activity', e.target.value)}
                    />
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Type d'entreprise</label>
                  {!isEditingSecondaryRole ? (
                    <p>{user.Type_company || '—'}</p>
                  ) : (
                    <input
                      className="w-full border rounded px-3 py-2"
                      value={user.Type_company || ''}
                      onChange={(e) => handleInputChange('Type_company', e.target.value)}
                    />
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Adresse</label>
                  {!isEditingSecondaryRole ? (
                    <p>{user.Adresse_company || '—'}</p>
                  ) : (
                    <input
                      className="w-full border rounded px-3 py-2"
                      value={user.Adresse_company || ''}
                      onChange={(e) => handleInputChange('Adresse_company', e.target.value)}
                    />
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Taille de l'entreprise</label>
                  {!isEditingSecondaryRole ? (
                    <p>{user.Taille_Company || '—'}</p>
                  ) : (
                    <input
                      className="w-full border rounded px-3 py-2"
                      value={user.Taille_Company || ''}
                      onChange={(e) => handleInputChange('Taille_Company', e.target.value)}
                    />
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Site web</label>
                  {!isEditingSecondaryRole ? (
                    <p>{user.Site_web || '—'}</p>
                  ) : (
                    <input
                      className="w-full border rounded px-3 py-2"
                      value={user.Site_web || ''}
                      onChange={(e) => handleInputChange('Site_web', e.target.value)}
                    />
                  )}
                </div>
              </div>
            )}

        {/* MALENTENDANT */}
        {selectedSecondaryRole === 'malentendant' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Perte auditive</label>
              {!isEditingSecondaryRole ? (
                <p>{user.niveau_perte_auditive || '—'}</p>
              ) : (
                <input
                  className="w-full border rounded px-3 py-2"
                  value={user.niveau_perte_auditive || ''}
                  onChange={(e) =>
                    handleInputChange('niveau_perte_auditive', e.target.value)
                  }
                />
              )}
            </div>

            <div>
              <label className="text-sm font-medium">
                Utilisez-vous un appareil auditif ?
              </label>
              {!isEditingSecondaryRole ? (
                <p>
                  {user.status_utilisez_vous_un_appareil_auditif ? 'Oui' : 'Non'}
                </p>
              ) : (
                <select
                  className="w-full border rounded px-3 py-2"
                  value={user.status_utilisez_vous_un_appareil_auditif ? 'oui' : 'non'}
                  onChange={(e) =>
                    handleInputChange(
                      'status_utilisez_vous_un_appareil_auditif',
                      e.target.value === 'oui'
                    )
                  }
                >
                  <option value="oui">Oui</option>
                  <option value="non">Non</option>
                </select>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Niveau en LSF</label>
              {!isEditingSecondaryRole ? (
                <p>{user.level_en_LSF || '—'}</p>
              ) : (
                <input
                  className="w-full border rounded px-3 py-2"
                  value={user.level_en_LSF || ''}
                  onChange={(e) => handleInputChange('level_en_LSF', e.target.value)}
                />
              )}
            </div>
          </div>
        )}
      </div>
       {/* BOUTONS À GAUCHE */}
        <div className="mt-6 flex justify-end gap-3 border-t pt-4">
          {!isEditingSecondaryRole ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSecondaryRoleBackup({ ...user });
                setIsEditingSecondaryRole(true);
              }}
            >
              Modifier
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (secondaryRoleBackup) {
                    setUser(secondaryRoleBackup);
                  }
                  setIsEditingSecondaryRole(false);
                }}
              >
                Annuler
              </Button>

              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={async () => {
                // Appel API pour sauvegarder le rôle secondaire
                try {
                  await updateSecondaryRoleProfile({
                    role: selectedSecondaryRole,
                    data: getSecondaryRoleData(selectedSecondaryRole)
                  }).unwrap();

                  setIsEditingSecondaryRole(false);
                  setIsRoleDialogOpen(false);
                } catch (err: any) {
                const errorMessage = err?.data?.message || err?.message || JSON.stringify(err);
                console.error("Erreur lors de la sauvegarde :", errorMessage);
              }
              }}
            >
                Sauvegarder
              </Button>
            </>
          )}
          {/* BOUTON FERMER */}
              <Button
                variant="outline"
                onClick={() => {
                  if (secondaryRoleBackup) setUser(secondaryRoleBackup);
                  setIsEditingSecondaryRole(false);
                  setIsRoleDialogOpen(false);
                }}
              >
                Fermer
              </Button>
                    </div>
                </div>
              </div>
            )}
                        {/* Informations spécifiques selon le rôle */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Informations pour les apprenants */}
                          {user.role === 'apprenant' && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Niveau en LSF
                                </label>
                                <p className="text-gray-900 dark:text-white">{user.level_en_LSF || 'Non spécifié'}</p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Langues parlées
                                </label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {user.langue_parlee?.length > 0 ? (
                                    user.langue_parlee.map((langue: string, index: number) => (
                                      <Badge key={index} variant="secondary" className="dark:bg-blue-900 dark:text-blue-200">
                                        {langue}
                                      </Badge>
                                    ))
                                  ) : (
                                    <span className="text-gray-500 dark:text-gray-400">Aucune langue spécifiée</span>
                                  )}
                                  
                                </div>
                              </div>
                            </>
                          )}
                          
                          {/* Informations pour les traducteurs */}
                          {user.role === 'traducteur' && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Certification
                                </label>
                                <p className="text-gray-900 dark:text-white">{user.certification || 'Non spécifiée'}</p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Années d'expérience
                                </label>
                                <p className="text-gray-900 dark:text-white">
                                  {user.Annee_experience ? `${user.Annee_experience} an(s)` : 'Non spécifié'}
                                </p>
                              </div>
                            </>
                          )}
                          
                          {/* Informations pour les employeurs */}
                          {user.role === 'employeur' && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Entreprise
                                </label>
                                <p className="text-gray-900 dark:text-white">{user.company_name || 'Non spécifiée'}</p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Domaine d'activité
                                </label>
                                <p className="text-gray-900 dark:text-white">{user.Domaine_activity || 'Non spécifié'}</p>
                              </div>
                            </>
                          )}
                          
                          {/* Informations pour les malentendants */}
                          {user.role === 'malentendant' && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Niveau de perte auditive
                                </label>
                                <p className="text-gray-900 dark:text-white">{user.niveau_perte_auditive || 'Non spécifié'}</p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Utilise un appareil auditif
                                </label>
                                <p className="text-gray-900 dark:text-white">
                                  {user.status_utilisez_vous_un_appareil_auditif ? 'Oui' : 'Non'}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              {/* Les autres onglets (préférences, sécurité) restent inchangés */}
              <TabsContent value="preferences">
                {/* ... contenu préférences ... */}
              </TabsContent>
              
              <TabsContent value="security">
                {/* ... contenu sécurité ... */}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}