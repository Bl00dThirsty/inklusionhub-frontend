'use client';

import * as React from "react";
import { cn } from "../lib/trendUtils";

// Définir TOUS les types de variants
export type BadgeVariant = 
  | 'default' 
  | 'secondary' 
  | 'destructive' 
  | 'outline'
  | 'apprenant' 
  | 'entendant' 
  | 'malentendant' 
  | 'employeur' 
  | 'traducteur'
  | 'success' 
  | 'warning' 
  | 'info';

// Props avec typage correct
interface BadgeProps extends React.ComponentProps<"span"> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'full' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  clickable?: boolean;
}

// CORRECTION : Déclarer TOUS les variants avec leur type
const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200',
  secondary: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200',
  destructive: 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200',
  outline: 'border border-gray-300 bg-transparent text-gray-700 dark:border-gray-600 dark:text-gray-300',
  
  // Vos variants spécifiques
  apprenant: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200',
  entendant: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200',
  malentendant: 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200',
  employeur: 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-200',
  traducteur: 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200',
  
  success: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200',
  warning: 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-200',
  info: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
} as const;

const roundedClasses = {
  full: 'rounded-full',
  md: 'rounded-md',
  lg: 'rounded-lg',
} as const;

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  rounded = 'md',
  icon,
  iconPosition = 'left',
  clickable = false,
  children,
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
  
  return (
    <span
      className={cn(
        baseStyles,
        variantClasses[variant], // CORRIGÉ : TypeScript sait maintenant que variant est de type BadgeVariant
        sizeClasses[size],
        roundedClasses[rounded],
        clickable && 'cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200',
        className
      )}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="mr-1">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-1">{icon}</span>}
    </span>
  );
}

// Fonction utilitaire
export function getBadgeVariantFromRole(role: string): BadgeVariant {
  const roleVariantMap: Record<string, BadgeVariant> = {
    'apprenant': 'apprenant',
    'entendant': 'entendant',
    'malentendant': 'malentendant',
    'employeur': 'employeur',
    'traducteur': 'traducteur',
    'admin': 'default',
  };
  
  return roleVariantMap[role] || 'default';
}

// Version SimpleBadge corrigée
export function SimpleBadge({ 
  variant = 'default', 
  className, 
  children, 
  ...props 
}: { 
  variant?: BadgeVariant; 
  className?: string; 
  children: React.ReactNode; 
  [key: string]: any;
}) {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
  
  // CORRECTION : Utiliser le même Record que variantClasses
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    secondary: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    destructive: 'bg-red-100 text-red-800 hover:bg-red-200',
    outline: 'border border-gray-300 bg-transparent',
    
    // Ajouter tous les variants
    apprenant: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    entendant: 'bg-green-100 text-green-800 hover:bg-green-200',
    malentendant: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    employeur: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
    traducteur: 'bg-red-100 text-red-800 hover:bg-red-200',
    
    success: 'bg-green-100 text-green-800 hover:bg-green-200',
    warning: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
    info: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  };
  
  // TypeScript sait maintenant que variant est de type BadgeVariant
  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}