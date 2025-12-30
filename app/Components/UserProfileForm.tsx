
'use client';

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from './ui/select';

interface UserProfileFormProps {
  user: any;
  isEditing: boolean;
  onInputChange: (field: string, value: any) => void;
  userType: string;
}

export function UserProfileForm({ 
  user, 
  isEditing, 
  onInputChange,
  userType 
}: UserProfileFormProps) {
  
  // Liste des rôles disponibles
  const availableRoles = [
    { value: 'malentendant', label: '👂 Personne malentendante' },
    { value: 'entendant', label: '👤 Personne entendante' },
    { value: 'apprenant', label: '📚 Apprenant' },
    { value: 'traducteur', label: '👋 Traducteur LSF' },
    { value: 'employeur', label: '💼 Employeur' },
  ];

  const commonFields = [
    { name: 'name', label: 'Nom', type: 'text' },
    { name: 'forename', label: 'Prénom', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Téléphone', type: 'tel' },
    { name: 'adresse', label: 'Adresse', type: 'text' },
    { name: 'Profession', label: 'Profession', type: 'text' },
  ];

  const handleChange = (field: string, value: any) => {
    onInputChange(field, value);
  };

  return (
    <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">
          {isEditing ? 'Modifier le profil' : 'Profil utilisateur'}
        </CardTitle>
        <CardDescription className="dark:text-gray-400">
          {isEditing 
            ? 'Modifiez vos informations personnelles' 
            : 'Vos informations personnelles'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commonFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              {isEditing ? (
                <Input
                  id={field.name}
                  type={field.type}
                  value={user[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              ) : (
                <p className="text-gray-900 dark:text-white p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                  {user[field.name] || 'Non spécifié'}
                </p>
              )}
            </div>
          ))}
          
          {/* Champ rôle avec select */}
          <div className="space-y-2">
            <Label htmlFor="role">Rôle principal</Label>
            {isEditing ? (
              <Select
                value={user.role || ''}
                onValueChange={(value) => handleChange('role', value)}
              >
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {availableRoles.map((role) => (
                    <SelectItem 
                      key={role.value} 
                      value={role.value}
                      className="dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                    >
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-gray-900 dark:text-white p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                {availableRoles.find(r => r.value === user.role)?.label || user.role || 'Non spécifié'}
              </p>
            )}
          </div>

          {/* Champ pour les rôles secondaires (optionnel) */}
          <div className="space-y-2">
            <Label htmlFor="secondary_roles">Rôles secondaires</Label>
            {isEditing ? (
              <div className="space-y-2">
                <Select
                  value=""
                  onValueChange={(value) => {
                    if (value && !user.secondary_roles?.includes(value)) {
                      const newRoles = [...(user.secondary_roles || []), value];
                      handleChange('secondary_roles', newRoles);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ajouter un rôle secondaire" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles
                      .filter(role => role.value !== user.role) // Exclure le rôle principal
                      .map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                
                {/* Afficher les rôles secondaires sélectionnés */}
                {user.secondary_roles && user.secondary_roles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.secondary_roles.map((role: string, index: number) => (
                      <div 
                        key={index}
                        className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                      >
                        {availableRoles.find(r => r.value === role)?.label || role}
                        <button
                          type="button"
                          onClick={() => {
                            const newRoles = user.secondary_roles.filter((r: string) => r !== role);
                            handleChange('secondary_roles', newRoles);
                          }}
                          className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.secondary_roles && user.secondary_roles.length > 0 ? (
                  user.secondary_roles.map((role: string, index: number) => (
                    <span 
                      key={index}
                      className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                    >
                      {availableRoles.find(r => r.value === role)?.label || role}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-900 dark:text-white p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                    Aucun rôle secondaire
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}