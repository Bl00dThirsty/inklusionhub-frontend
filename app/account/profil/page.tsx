'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetCurrentUserQuery } from '../../../state/api';
import { UserProfileForm } from '../../Components/UserProfileForm';
import DashboardHeader from '../../Components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../Components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../Components/ui/avatar';
import { Badge } from '../../Components/ui/badge';
import { Button } from '../../Components/ui/button'
import { Loader2 } from 'lucide-react';

export default function ProfilePage() { 
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  
  // Récupérer l'utilisateur connecté via Redux RTK Query
  const { 
    data: user, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetCurrentUserQuery();
  
  // Mettre à jour formData quand user est chargé
  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);
  
  // Rediriger si erreur d'authentification
  useEffect(() => {
    if (isError) {
      console.error('Erreur de chargement:', error);
      router.push('/sign-in');
    }
  }, [isError, error, router]);
  
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // Si on annule l'édition, réinitialiser avec les données originales
    if (isEditing && user) {
      setFormData(user);
    }
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
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non spécifié';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader 
        userName={user.name}
        userRole={user.role}
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
                onClick={() => console.log('Sauvegarder', formData)}
                className="bg-green-600 hover:bg-green-700"
              >
                Sauvegarder
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
                  <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-800 shadow-md">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                    
                    <Badge className={`mt-2 ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </Badge>
                  </div>
                  
                  <div className="w-full pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <p>Membre depuis le {formatDate(user.createdAt)}</p>
                    {user.updatedAt && (
                      <p>Dernière mise à jour : {formatDate(user.updatedAt)}</p>
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
                      {user.phone ? '80%' : '40%'}
                    </Badge>
                  </div>
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
                      user={isEditing ? formData : user}
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