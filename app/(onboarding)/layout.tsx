import { OnboardingProgress } from './components/OnboardingProgress';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <OnboardingProgress />
      <main className="pt-4 pb-20">
        {children}
      </main>
    </div>
  );
}