'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetCurrentUserQuery, useUpdateProfileMutation, useUpdateAvatarMutation } from '@/state/api';
import { UserProfileForm } from '../../Components/UserProfileForm';
import DashboardHeader from '../../Components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../Components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../Components/ui/avatar';
import { Badge } from '../../Components/ui/badge';
import { Button } from '../../Components/ui/button'
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner'; 
import { Camera } from 'lucide-react';
import RoleSelectionPage from '@/app/(onboarding)/role-selection/page';

interface UserData {
  id: string;
  name: string;
  forename: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
  adresse?: string;
  Profession?: string;
  onboarding_completed: boolean;
  onboarding_step: number;
  langue_parlee: string[];
  // Champs spécifiques selon le rôle
  company_name?: string;
  niveau_expertise?: string;
  niveau_perte_auditive?: string;
  status_utilisez_vous_un_appareil_auditif?: Boolean;
  level_en_LSF?: string;
  Jour_disponible?: string;// Pour traducteur
  Creneau_horaire_disponible?: string;// Pour traducteur
  Tarif_horaire?: number;// Pour traducteur
  Annee_experience?: number;
  Domaine_activity?: string;//Pour employeur
  Type_company?: string;//Pour employeur
  Adresse_company?: string;//Pour employeur
  Taille_Company?: string;//Pour employeur
  certification?: string;
  Site_web?: string;//Pour employeur
  secondary_roles?: string[];
  preferences?: string[];
 date_joined?:Date;
 updated_at?:Date;
}
export default function ProfilePage() { 
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
    const { 
    data: apiUserData, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetCurrentUserQuery();  

  // Mutation pour update le profil
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

 // Mutation pour update l'avatar
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [updateAvatar, { isLoading: isUpdatingAvatar }] = useUpdateAvatarMutation();

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
    Jour_disponible: '',// Pour traducteur
    Creneau_horaire_disponible: '',// Pour traducteur
    Tarif_horaire: 0,// Pour traducteur
    Annee_experience: 0,
    Domaine_activity: '',//Pour employeur
    Type_company: '',//Pour employeur
    Adresse_company: '',//Pour employeur
    Taille_Company: '',//Pour employeur
    certification: '',
    Site_web: '',//Pour employeur
    secondary_roles: [],
    preferences: [],
    date_joined: new Date(),
    updated_at: new Date(),
  });
  
 
  // Mettre à jour formData quand user est chargé
   useEffect(() => {
  if (apiUserData) {
    // console.log('=== DEBUG API RESPONSE ===');
    // console.log('Type:', typeof apiUserData);
    // console.log('Full response:', apiUserData);
    // console.log('Has user property?', 'user' in apiUserData);
    // console.log('Keys:', Object.keys(apiUserData));
    // console.log('Role from API:', apiUserData.role || apiUserData.user?.role);
    // console.log('==========================');
    
    // Vérifiez la structure exacte
    let user;
    
    // Essayez différentes structures possibles
    if (apiUserData.user) {
      // Structure: { success: true, user: {...} }
      user = apiUserData.user;
    } else if (apiUserData.id) {
      // Structure: user directement
      user = apiUserData;
    } else {
      console.error('Structure API inattendue:', apiUserData);
      return;
    }
    
    setUser({
      id: user.id || '',
      name: user.name || '',
      forename: user.forename || '',
      email: user.email || '',
      role: user.role || 'malentendant',
      phone: user.phone || '',
      avatar: user.avatar || '',
      adresse: user.adresse || '',
      Profession: user.Profession || '',
      onboarding_completed: user.onboarding_completed || false,
      onboarding_step: user.onboarding_step || 1,
      langue_parlee: Array.isArray(user.langue_parlee) ? user.langue_parlee : [],
      level_en_LSF: user.level_en_LSF || '',
      company_name: user.company_name,
      niveau_expertise: user.niveau_expertise,
      niveau_perte_auditive: user.niveau_perte_auditive,
      status_utilisez_vous_un_appareil_auditif: user.status_utilisez_vous_un_appareil_auditif || false,
      Jour_disponible: user.Jour_disponible || '',// Pour traducteur
      Creneau_horaire_disponible: user.Creneau_horaire_disponible || '',// Pour traducteur
      Tarif_horaire: user.Tarif_horaire || 0,// Pour traducteur
      Domaine_activity: user.Domaine_activity || '',//Pour employeur
      Annee_experience: user.Annee_experience || 0,
      Type_company: user.Type_company || '',//Pour employeur
      Adresse_company: user.Adresse_company || '',//Pour employeur
      Taille_Company: user.Taille_Company || '',//Pour employeur
      certification: user.certification || '',
      Site_web: user.Site_web || '',//Pour employeur
      secondary_roles: Array.isArray(user.secondary_roles) ? user.secondary_roles : [],
      preferences: Array.isArray(user.preferences) ? user.preferences : [],
    });
  }
}, [apiUserData]);
  
  // Rediriger si erreur d'authentification
  useEffect(() => {
    if (isError) {
      toast.error('Erreur de chargement, vous êtes redirigé vers la page de connexion');
      router.push('/sign-in');
    }
  }, [isError, error, router]);
  
  const handleInputChange = (field: string, value: any) => {
    setUser((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };
  
   // Fonction pour gérer la sauvegarde
  const handleSaveProfile = async () => {
    try {
      // Préparer les données de base uniquement
      const basicProfileData = {
        name: user.name,
        forename: user.forename,
        email: user.email,
        phone: user.phone,
        adresse: user.adresse,
        Profession: user.Profession,
        role: user.role,
        secondary_roles: user.secondary_roles || [],
      };

      // Appel API
      await updateProfile({ data: basicProfileData }).unwrap();
      
      // Recharger les données
      await refetch();
      
      // Désactiver le mode édition
      setIsEditing(false);
      
      // Afficher un message de succès
      toast.success('Profil mis à jour avec succès!');
      
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error);
      
      // Afficher l'erreur
      toast.error(
        error.data?.errors ? 
        Object.values(error.data.errors).flat().join(', ') : 
        'Erreur lors de la mise à jour du profil'
      );
    }
  };

  // Fonction pour gérer l'annulation
  const handleCancelEdit = () => {
    // Réinitialiser avec les données originales de l'API
    if (apiUserData) {
      let userData;
      
      if (apiUserData.user) {
        userData = apiUserData.user;
      } else if (apiUserData.id) {
        userData = apiUserData;
      }
      
      if (userData) {
        setUser({
          id: userData.id || '',
          name: userData.name || '',
          forename: userData.forename || '',
          email: userData.email || '',
          phone: userData.phone || '',
          avatar: userData.avatar || '',
          adresse: userData.adresse || '',
          Profession: userData.Profession || '',
          role: userData.role || 'malentendant',
          onboarding_completed: userData.onboarding_completed || false,
          onboarding_step: userData.onboarding_step || 1,
          langue_parlee: Array.isArray(userData.langue_parlee) ? userData.langue_parlee : [],
          level_en_LSF: userData.level_en_LSF || '',
          company_name: userData.company_name,
          niveau_expertise: userData.niveau_expertise,
          niveau_perte_auditive: userData.niveau_perte_auditive,
          status_utilisez_vous_un_appareil_auditif: userData.status_utilisez_vous_un_appareil_auditif || false,
          Jour_disponible: userData.Jour_disponible || '',// Pour traducteur
          Creneau_horaire_disponible: userData.Creneau_horaire_disponible || '',// Pour traducteur
          Tarif_horaire: userData.Tarif_horaire || 0,// Pour traducteur
          Domaine_activity: userData.Domaine_activity || '',//Pour employeur
          Annee_experience: userData.Annee_experience || 0,
          Type_company: userData.Type_company || '',//Pour employeur
          Adresse_company: userData.Adresse_company || '',//Pour employeur
          Taille_Company: userData.Taille_Company || '',//Pour employeur
          certification: userData.certification || '',
          Site_web: userData.Site_web || '',//Pour employeur
          secondary_roles: Array.isArray(userData.secondary_roles) ? userData.secondary_roles : [],
          preferences: Array.isArray(userData.preferences) ? userData.preferences : [],
        });
      }
    }
    
    setIsEditing(false);
  };

  // Modifiez la fonction handleEditToggle
  const handleEditToggle = () => {
    if (!isEditing) {
      // Activer le mode édition
      setIsEditing(true);
    } else {
      // Annuler l'édition
      handleCancelEdit();
    }
  };

  // Fonction pour gérer la sélection d'un fichier avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier la taille (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 2MB');
        return;
      }
      
      // Vérifier le type
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner une image valide');
        return;
      }
      
      setAvatarFile(file);
      
      // Créer une preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fonction pour uploader l'avatar
  const handleUploadAvatar = async () => {
    if (!avatarFile) {
      toast.error('Veuillez sélectionner une image');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      const result = await updateAvatar(formData).unwrap();
      
      if (result.success) {
        toast.success('Avatar mis à jour avec succès!');
        
        // Réinitialiser les états
        setAvatarFile(null);
        setPreviewAvatar(null);
        
        // Recharger les données utilisateur
        await refetch();
        
        // Si l'URL est retournée, mettre à jour localement
        if (result.avatar_url) {
          setUser(prev => ({ ...prev, avatar: result.avatar_url }));
        }
      }
    } catch (error: any) {
      console.error('Erreur upload avatar:', error);
      toast.error(error.data?.error || 'Erreur lors de l\'upload de l\'avatar');
    }
  };

  // Fonction pour annuler la sélection d'avatar
  const handleCancelAvatar = () => {
    setAvatarFile(null);
    setPreviewAvatar(null);
  };

  
  // Fonction pour obtenir les initiales du nom
  const getInitials = (name: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  // Fonction pour traduire le rôle
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
  
  // Fonction pour obtenir la couleur du badge selon le rôle
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
  
  // Formater la date
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'Non spécifié';
    try {
      const dateObj = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return dateObj.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

 const getAvatarUrl = (avatarPath: string | undefined): string => {
  if (!avatarPath) return '';
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  // Extraire juste le nom du fichier
  const filename = avatarPath.split('/').pop() || '';
  return `${baseUrl}/avatars/${filename}`;
};

  const avatarUrl = getAvatarUrl(user.avatar);


  // États de chargement
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
  
  if (!user) {
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
  const calculateOnboardingProgress = () => {
    if (user.onboarding_completed) return 100;
    return Math.min(user.onboarding_step * 20, 100);
  };
   const onboardingProgress = calculateOnboardingProgress();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader 
        userName={`${user.name} ${getInitials(user.forename)}.`}
        userRole={user.role}
        userEmail={user.email}
        userAvatar={avatarUrl}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Ajoutez des boutons d'action en haut */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mon Profil</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gérez vos informations personnelles et vos préférences
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleEditToggle}
              variant={isEditing ? "outline" : "default"}
            >
              {isEditing ? 'Annuler' : 'Modifier le profil'}
            </Button>
            {isEditing && (
              <Button 
                onClick={handleSaveProfile}
                className="bg-green-600 hover:bg-green-700"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : 'Sauvegarder'}
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne de gauche - Informations générales */}
          <div className="lg:col-span-1 space-y-6">
            {/* Carte d'identité */}
            <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Avatar avec option de changement */}
                  <div className="relative group">
                    <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-800 shadow-md">
                      {previewAvatar ? (
                        <AvatarImage src={previewAvatar} alt={user.name} />
                      ) : (
                        <AvatarImage src={avatarUrl} alt={user.name} />
                      )}
                    </Avatar>
                    
                    {/* Overlay pour upload */}
                    {!isEditing && (
                      <div className="absolute inset-0 bg-black-100 bg-opacity-10 group-hover:bg-opacity-40 rounded-full flex items-center justify-center transition-all duration-300">
                        <label htmlFor="avatar-upload" className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg">
                            <Camera className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                          </div>
                          <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  
                  {/* Boutons pour upload d'avatar */}
                  {(avatarFile || previewAvatar) && (
                    <div className="flex gap-2 animate-in fade-in">
                      <Button
                        onClick={handleUploadAvatar}
                        disabled={isUpdatingAvatar}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isUpdatingAvatar ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Upload...
                          </>
                        ) : 'Sauvegarder avatar'}
                      </Button>
                      <Button
                        onClick={handleCancelAvatar}
                        variant="outline"
                        size="sm"
                      >
                        Annuler
                      </Button>
                    </div>
                  )}
                  
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name} {user.forename}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                    
                    <Badge className={`mt-2 ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </Badge>
                  </div>
                  
                  <div className="w-full pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <p>Membre depuis le {formatDate(user.date_joined)}</p>
                    {user.updated_at && (
                      <p>Dernière mise à jour : {formatDate(user.updated_at)}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Statut du compte */}
            <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white">Statut du compte</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Email vérifié</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300">
                      ✓ Vérifié
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Profil complété</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300">
                      {onboardingProgress}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Colonne de droite - Formulaire et informations détaillées */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid grid-cols-3 mb-8 dark:bg-gray-800">
                <TabsTrigger value="profile" className="dark:text-gray-300">Profil</TabsTrigger>
                <TabsTrigger value="preferences" className="dark:text-gray-300">Préférences</TabsTrigger>
                <TabsTrigger value="security" className="dark:text-gray-300">Sécurité</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-6">
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
                    <UserProfileForm
                      user={isEditing ? user : user}
                      isEditing={isEditing}
                      onInputChange={handleInputChange}
                      userType={user.role}
                    />
                  </CardContent>
                </Card>
                
                {/* Informations spécifiques selon le rôle */}
                {user.role === 'apprenant' && (
                  <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-gray-900 dark:text-white">Informations d'apprenant</CardTitle>
                      <CardDescription className="dark:text-gray-400">
                        Ces informations aident à personnaliser votre expérience d'apprentissage.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            {user.langue_parlee?.map((langue: string, index: number) => (
                              <Badge key={index} variant="secondary" className="dark:bg-blue-900 dark:text-blue-200">
                                {langue}
                              </Badge>
                            )) || 'Aucune langue spécifiée'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {user.role === 'traducteur' && (
                  <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-gray-900 dark:text-white">Informations de traducteur</CardTitle>
                      <CardDescription className="dark:text-gray-400">
                        Vos informations professionnelles en tant que traducteur LSF.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Certification
                          </label>
                          <p className="text-gray-900 dark:text-white">{user.certification || 'Non spécifiée'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Expérience
                          </label>
                          <p className="text-gray-900 dark:text-white">
                            {user.Annee_experience ? `${user.Annee_experience} an(s)` : 'Non spécifiée'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {user.role === 'employeur' && (
                  <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-gray-900 dark:text-white">Informations professionnelles</CardTitle>
                      <CardDescription className="dark:text-gray-400">
                        Vos informations en tant qu'employeur.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {user.role === 'malentendant' && (
                  <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-gray-900 dark:text-white">Préférences d'accessibilité</CardTitle>
                      <CardDescription className="dark:text-gray-400">
                        Configurez vos préférences pour une meilleure expérience.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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