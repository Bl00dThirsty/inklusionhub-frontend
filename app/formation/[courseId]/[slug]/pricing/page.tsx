'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiCheck, FiCreditCard, FiLock, FiArrowLeft, FiShield, FiClock, FiPlay } from 'react-icons/fi';
import { useAuth } from '../../../../Components/hooks/useAuth';
import { useGetCourseBySlugQuery, useGetCourseByIdQuery } from '@/state/learningApi';
import { toast } from 'sonner';

const CoursePricingPage = () => {
  const { slug, courseId } = useParams() as { slug: string; courseId: string };
  const router = useRouter();
  const { user, isLoading: isLoadingAuth } = useAuth();
  
  const { data: course, isLoading: isLoadingCourse } = useGetCourseByIdQuery(courseId, {
    skip: !courseId
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'stripe'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Options de paiement
  const pricingPlans = [
    {
      id: 'full_access',
      name: 'Accès Complet',
      description: 'Accès à vie à ce cours',
      price: course?.price || 49.90,
      features: [
        'Accès illimité au cours',
        'Toutes les leçons et modules',
        'Certificat de complétion',
        'Support prioritaire',
        'Mises à jour gratuites',
        'Accès à la communauté'
      ],
      popular: true
    },
    {
      id: 'monthly',
      name: 'Abonnement Mensuel',
      description: 'Accès pendant 30 jours',
      price: 19.90,
      features: [
        'Accès au cours pendant 30 jours',
        'Toutes les leçons',
        'Certificat inclus',
        'Renouvellement automatique'
      ],
      popular: false
    }
  ];

  const handlePayment = async (planId: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour effectuer un paiement');
      router.push(`/login?redirect=/formation/${courseId}/${slug}/pricing`);
      return;
    }

    if (!agreeTerms) {
      toast.error('Veuillez accepter les conditions générales');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulation de paiement - À remplacer par votre API de paiement
      toast.success('Paiement simulé avec succès !');
      
      // Rediriger vers le cours avec accès premium
      setTimeout(() => {
        router.push(`/formation/${courseId}/${slug}/`);
        toast.success('🎉 Félicitations ! Vous avez maintenant accès au cours premium.');
      }, 1500);

    } catch (error) {
      console.error('Erreur de paiement:', error);
      toast.error('Une erreur est survenue lors du paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFreePreview = () => {
    router.push(`/formation/${courseId}/${slug}/preview`);
  };

  const handleBackToCourse = () => {
    router.push(`/formation/${courseId}/${slug}`);
  };

  if (isLoadingCourse || isLoadingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-800 mb-4">Cours non trouvé</h2>
            <button
              onClick={() => router.push('/formation')}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retour aux cours
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToCourse}
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft className="mr-2" />
              Retour au cours
            </button>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <FiShield />
                <span>Paiement 100% sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Accédez à <span className="text-blue-600">{course.title}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choisissez la formule qui vous convient pour débloquer l'accès complet à ce cours premium
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plans de tarification */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl border-2 p-6 transition-all duration-300 hover:shadow-xl ${
                    plan.popular
                      ? 'border-blue-500 relative shadow-lg'
                      : 'border-gray-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Le plus populaire
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price.toFixed(2)}€
                      </span>
                      {plan.id === 'monthly' && (
                        <span className="text-gray-500">/mois</span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <FiCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePayment(plan.id)}
                    disabled={isProcessing}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <FiClock className="animate-spin mr-2" />
                        Traitement en cours...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <FiCreditCard className="mr-2" />
                        Choisir cette formule
                      </span>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Méthodes de paiement */}
            <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Méthodes de paiement
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {['card', 'paypal', 'stripe'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method as any)}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-all ${
                      paymentMethod === method
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">
                      {method === 'card' && '💳'}
                      {method === 'paypal' && '🅿️'}
                      {method === 'stripe' && '💸'}
                    </div>
                    <span className="text-sm font-medium capitalize">
                      {method === 'card' && 'Carte bancaire'}
                      {method === 'paypal' && 'PayPal'}
                      {method === 'stripe' && 'Stripe'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Conditions */}
            <div className="mt-8">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 mr-3"
                />
                <label htmlFor="terms" className="text-gray-700">
                  J'accepte les{' '}
                  <a href="/terms" className="text-blue-600 hover:underline">
                    conditions générales
                  </a>{' '}
                  et la{' '}
                  <a href="/privacy" className="text-blue-600 hover:underline">
                    politique de confidentialité
                  </a>
                </label>
              </div>
            </div>
          </div>

          {/* Sidebar - Résumé */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Votre sélection
              </h3>

              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FiLock className="text-blue-600 text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{course.title}</h4>
                    <p className="text-sm text-gray-600">Cours Premium</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Accès complet :</span>
                    <span className="font-semibold">{course.price?.toFixed(2) || '49.90'}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accès à vie :</span>
                    <span className="font-semibold text-green-600">✓ Inclus</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Certificat :</span>
                    <span className="font-semibold text-green-600">✓ Inclus</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Total :</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {course.price?.toFixed(2) || '49.90'}€
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  TVA incluse. Pas de frais cachés.
                </p>

                {/* Options alternatives */}
                <div className="space-y-4">
                  <button
                    onClick={handleFreePreview}
                    className="w-full py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <FiPlay className="mr-2" />
                    Voir l'aperçu gratuit
                  </button>

                  <button
                    onClick={handleBackToCourse}
                    className="w-full py-3 px-4 text-gray-600 hover:text-gray-900 font-medium flex items-center justify-center"
                  >
                    <FiArrowLeft className="mr-2" />
                    Retourner au cours
                  </button>
                </div>

                {/* Garanties */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Garanties</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <FiShield className="text-green-500" />
                      <span>Garantie satisfait ou remboursé 30 jours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock className="text-green-500" />
                      <span>Accès immédiat après paiement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiLock className="text-green-500" />
                      <span>Paiement 100% sécurisé</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Questions fréquentes
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Puis-je me faire rembourser ?',
                a: 'Oui, nous offrons une garantie satisfait ou remboursé de 30 jours.'
              },
              {
                q: 'Quand ai-je accès au cours ?',
                a: 'Immédiatement après votre paiement, vous recevrez un email de confirmation avec vos accès.'
              },
              {
                q: 'Le certificat est-il inclus ?',
                a: 'Oui, tous nos plans premium incluent un certificat de complétion téléchargeable.'
              },
              {
                q: 'Puis-je payer en plusieurs fois ?',
                a: 'Oui, nous proposons des options de paiement en 3 ou 4 fois sans frais.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePricingPage;