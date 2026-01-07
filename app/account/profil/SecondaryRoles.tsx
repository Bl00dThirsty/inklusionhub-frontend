'use client';

import { cn } from "@/app/Components/lib/trendUtils";
import { Badge } from "@/app/Components/ui/badge";

export type UserRole = 
  | 'apprenant' 
  | 'entendant' 
  | 'malentendant' 
  | 'employeur' 
  | 'traducteur' 
  | 'admin';

export interface SecondaryRolesDisplayProps {
  /** Rôles secondaires de l'utilisateur */
  secondaryRoles: string[];
  /** Rôle principal de l'utilisateur (sera filtré) */
  mainRole: UserRole;
  /** Style personnalisé pour le conteneur */
  className?: string;
  /** Taille des badges (sm, md, lg) */
  badgeSize?: 'sm' | 'md' | 'lg';
  /** Afficher en mode "selectable" (cliquable) */
  selectable?: boolean;
  onClickRole?: (role: UserRole) => void;
  /** Fonction appelée lorsqu'un rôle est sélectionné */
  onRoleSelect?: (role: string) => void;
  /** Rôles actuellement sélectionnés */
  selectedRoles?: string[];
  /** Mode "edit" pour permettre l'ajout/suppression */
  editable?: boolean;
  /** Fonction pour supprimer un rôle */
  onRemoveRole?: (role: string) => void;
  /** Nombre maximum de rôles à afficher (0 = illimité) */
  maxDisplay?: number;
}

/**
 * Composant réutilisable pour afficher les rôles secondaires d'un utilisateur
 */
export function SecondaryRolesDisplay({
  secondaryRoles,
  mainRole,
  className,
  badgeSize = 'md',
  selectable = false,
  onRoleSelect,
  selectedRoles = [],
  editable = false,
  onRemoveRole,
  maxDisplay = 0
}: SecondaryRolesDisplayProps) {
  
  // Filtrer les rôles secondaires
  const filteredRoles = secondaryRoles.filter(
    role => role !== mainRole && role !== 'admin'
  );

  // Limiter l'affichage si nécessaire
  const displayedRoles = maxDisplay > 0 
    ? filteredRoles.slice(0, maxDisplay) 
    : filteredRoles;
  
  const hiddenRolesCount = maxDisplay > 0 
    ? Math.max(0, filteredRoles.length - maxDisplay) 
    : 0;

  // Obtenir le label d'un rôle
  const getRoleLabel = (role: string): string => {
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

  // Obtenir la couleur d'un rôle
  const getRoleColor = (role: string): string => {
    const roleColors: Record<string, string> = {
      'apprenant': 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800',
      'entendant': 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800',
      'malentendant': 'bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-800',
      'employeur': 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200 dark:bg-amber-900 dark:text-amber-200 dark:border-amber-800',
      'traducteur': 'bg-red-100 text-red-800 hover:bg-red-200 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800',
      'admin': 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800'
    };
    return roleColors[role] || 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800';
  };

  // Obtenir la taille du badge
  const getBadgeSizeClass = (): string => {
    switch (badgeSize) {
      case 'sm': return 'px-2 py-0.5 text-xs';
      case 'lg': return 'px-4 py-2 text-base';
      default: return 'px-3 py-1 text-sm';
    }
  };

  // Vérifier si un rôle est sélectionné
  const isRoleSelected = (role: string): boolean => {
    return selectedRoles.includes(role);
  };

  if (filteredRoles.length === 0) {
    return (
      <div className={cn("text-gray-500 dark:text-gray-400 text-sm", className)}>
        Aucun rôle secondaire
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {displayedRoles.map((role, index) => {
        const isSelected = isRoleSelected(role);
        
        return (
          <div 
            key={`${role}-${index}`} 
            className="relative inline-flex"
          >
            <Badge
              variant={isSelected ? "default" : "outline"}
              className={cn(
                getBadgeSizeClass(),
                getRoleColor(role),
                // Toujours rendre cliquable si onRoleSelect existe OU si selectable est true
                (onRoleSelect || selectable) && "cursor-pointer transition-all duration-200 hover:scale-105",
                selectable && isSelected && "ring-2 ring-offset-1 ring-blue-500",
                editable && onRemoveRole && "pr-7"
              )}
              onClick={() => {
                console.log("Badge cliqué:", role);
                if (onRoleSelect) {
                  onRoleSelect(role);
                }
              }}
            >
              {getRoleLabel(role)}
            </Badge>
            
            {editable && onRemoveRole && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveRole(role);
                }}
                className="absolute -top-1.5 -right-1.5 h-4 w-4 flex items-center justify-center bg-red-500 text-white text-xs rounded-full hover:bg-red-600 transition-colors"
                aria-label={`Supprimer le rôle ${getRoleLabel(role)}`}
              >
                ×
              </button>
            )}
          </div>
        );
      })}
      
      {hiddenRolesCount > 0 && (
        <Badge
          variant="outline"
          className={cn(
            getBadgeSizeClass(),
            "bg-gray-50 text-gray-600 border-gray-300"
          )}
        >
          +{hiddenRolesCount} autre{hiddenRolesCount > 1 ? 's' : ''}
        </Badge>
      )}
    </div>
  );
}

/**
 * Version simplifiée du composant pour un usage rapide
 */
export function SimpleSecondaryRolesDisplay({ 
  secondaryRoles, 
  mainRole 
}: Pick<SecondaryRolesDisplayProps, 'secondaryRoles' | 'mainRole'>) {
  return (
    <SecondaryRolesDisplay
      secondaryRoles={secondaryRoles}
      mainRole={mainRole}
    />
  );
}