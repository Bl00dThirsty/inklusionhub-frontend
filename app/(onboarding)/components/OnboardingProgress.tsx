'use client';

import { usePathname } from 'next/navigation';
import { Check } from 'lucide-react';
import { ThemeToggle } from "../../Components/ThemeToggle";

const steps = [
  { id: 'signup', name: 'Inscription', path: '/sign-up' },
  { id: 'role-selection', name: 'Rôle', path: '/role-selection' },
  { id: 'basic-profile', name: 'Profil', path: '/basic-profile' },
  { id: 'advanced-profiles', name: 'Détails', path: '/advanced-profiles' },
  { id: 'preferences', name: 'Préférences', path: '/preferences' },
];

export function OnboardingProgress() {
  const pathname = usePathname();
  
  const currentStepIndex = steps.findIndex(step => 
    pathname.includes(step.path)
  );
  const OnboardProgress = Number(localStorage.getItem("OnboardProgress")) || 0;
  return (
    <div className="px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isUpcoming = index > currentStepIndex;

            return (
              <div key={step.id} className="flex items-center">
                {/* Étape */}
                <div className="flex flex-col items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full
                    ${isCompleted ? 'bg-blue-600 text-white' : ''}
                    ${isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-100' : ''}
                    ${isUpcoming ? 'bg-gray-200 text-gray-500' : ''}
                  `}>
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span className={`
                    mt-2 text-xs font-medium
                    ${isCompleted || isCurrent ? 'text-blue-600' : 'text-gray-500'}
                  `}>
                    {step.name}
                  </span>
                </div>

                {/* Ligne entre les étapes */}
                {index < steps.length - 1 && (
                  <div className={`
                    flex-1 h-1 mx-4
                    ${isCompleted ? 'bg-blue-600' : 'bg-gray-200'}
                  `} />
                )}
              </div>
              
            );
          })}
          <div className="flex justify-end items-center   p-5">
        <ThemeToggle />
      </div>
        </div>
        
      </div>
      
    </div>
  );
}