// app/Components/UserProfileForm.tsx
'use client';

import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
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
  const commonFields = [
    { name: 'name', label: 'Nom', type: 'text' },
    { name: 'forename', label: 'Prénom', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Téléphone', type: 'tel' },
    { name: 'adresse', label: 'Adresse', type: 'text' },
    { name: 'Profession', label: 'Profession', type: 'text' },
  ];

  return (
    <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">
          Informations personnelles
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
                  onChange={(e) => onInputChange(field.name, e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              ) : (
                <p className="text-gray-900 dark:text-white p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                  {user[field.name] || 'Non spécifié'}
                </p>
              )}
            </div>
          ))}
          
          {/* Champ bio/description */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="bio">Bio / Description</Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={user.bio || ''}
                onChange={(e) => onInputChange('bio', e.target.value)}
                rows={3}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            ) : (
              <p className="text-gray-900 dark:text-white p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                {user.bio || 'Aucune description'}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}