"use client";

import { Mic, Volume2, StopCircle, RotateCcw, Download, Settings, Headphones, MessageSquare, Zap, User, Globe, VolumeX, Volume1, Volume2 as Volume2Icon, ArrowLeft } from "lucide-react";
import { useSpeechRecognition } from "../../Components/hooks/useSpeechResognition";
import { useTextToSpeech } from "../../Components/hooks/useTextToSpeech";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGetCurrentUserQuery } from '@/state/api';
import { toast } from 'sonner';
import DashboardHeader from "@/app/Components/DashboardHeader";
import Footer from "../../Components/Footer";

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
  company_name?: string;
  niveau_expertise?: string;
  niveau_perte_auditive?: string;
  Jour_disponible?: string;
  Creneau_horaire_disponible?: string;
  Tarif_horaire?: number;
  Domaine_activity?: string;
  Type_company?: string;
  Adresse_company?: string;
  Taille_Company?: string;
  Site_web?: string;
  secondary_roles?: string[];
  preferences?: string[];
}

export default function LiveCommunication() {
  
  const { isListening, transcript, start, stop } = useSpeechRecognition();
  const { speak: originalSpeak } = useTextToSpeech();
  const [text, setText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [language, setLanguage] = useState("fr-FR");
  const [volume, setVolume] = useState(100);
  const [showSettings, setShowSettings] = useState(false);
  const [history, setHistory] = useState<Array<{text: string, type: 'input' | 'output', timestamp: Date}>>([]);
  
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
   // Récupération des données utilisateur via RTK Query
  const { 
    data: apiUserData, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetCurrentUserQuery();  
   // Vérifier si l'utilisateur est authentifié
   useEffect(() => {
    if (isError) {
      toast.error('Erreur de chargement, vous êtes redirigé vers la page de connexion');
      router.push('/');
    }
  }, [isError, error, router]);
  
  const [userData, setUserData] = useState<UserData>({
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
    langue_parlee: []
  });

  // Gestion améliorée de la synthèse vocale avec détection de fin
  const handleSpeak = (textToSpeak: string) => {
    if (!textToSpeak.trim()) return;
    
    setIsPlaying(true);
    
    // Créer un nouvel utterance avec les paramètres
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = speechSpeed;
    utterance.volume = volume / 100;
    utterance.lang = language;
    
    // Gérer la fin de la lecture
    utterance.onend = () => {
      setIsPlaying(false);
    };
    
    utterance.onerror = () => {
      setIsPlaying(false);
    };
    
    // Utiliser la synthèse vocale du navigateur directement
    window.speechSynthesis.speak(utterance);
    
    // Ajouter à l'historique
    setHistory(prev => [...prev, {
      text: textToSpeak,
      type: 'input',
      timestamp: new Date()
    }]);
  };

  // Arrêter la lecture
  const handleStopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

 

  // Mettre à jour les données utilisateur
  useEffect(() => {
    if (apiUserData) {
      let user;
      
      if (apiUserData.user) {
        user = apiUserData.user;
      } else if (apiUserData.id) {
        user = apiUserData;
      } else {
        console.error('Structure API inattendue:', apiUserData);
        return;
      }
      
      setUserData({
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
        company_name: user.company_name,
        niveau_expertise: user.niveau_expertise,
        niveau_perte_auditive: user.niveau_perte_auditive
      });
    }
  }, [apiUserData]);

  // Fonction pour obtenir l'URL de l'avatar
  const getAvatarUrl = (avatarPath: string | undefined): string => {
    if (!avatarPath) return '';
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const filename = avatarPath.split('/').pop() || '';
    return `${baseUrl}/avatars/${filename}`;
  };

  const avatarUrl = getAvatarUrl(userData.avatar);

  // Fonction pour obtenir les initiales
  const getInitials = (name: string) => {
    if (!name) return '??';
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Gestion améliorée de la transcription
  const handleStartListening = () => {
    start();
  };

  const handleStopListening = () => {
    stop();
    if (transcript) {
      setHistory(prev => [...prev, {
        text: transcript,
        type: 'output',
        timestamp: new Date()
      }]);
    }
  };

  // Effet pour ajuster la hauteur du textarea
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [text]);

  // Télécharger la transcription
  const downloadTranscript = () => {
    const content = history.map(item => 
      `${item.timestamp.toLocaleTimeString()} [${item.type === 'input' ? 'Écrit → Parole' : 'Parole → Écrit'}] ${item.text}`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcription-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Réinitialiser
  const handleReset = () => {
    setText("");
    setHistory([]);
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <DashboardHeader 
        userName={`${userData.name} ${getInitials(userData.forename)}.`}
        userRole={userData.role}
        userEmail={userData.email}
        userAvatar={avatarUrl}
      />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* En-tête */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Communication <span className="text-primary">Live</span>
          </h1>
          <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
          aria-label="Retour"
        >
          <ArrowLeft size={22} />
        </button>
        </div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Système de communication accessible en temps réel : transformez la parole en texte et le texte en parole
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium">Temps réel</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Globe className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Multi-langues</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Headphones className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Accessible</span>
            </div>
          </div>
        </div>

        {/* Panneau principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Carte 1 : Parole → Texte */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Mic className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Parole → Texte</h2>
                  <p className="text-gray-500 text-sm">Pour les utilisateurs entendants</p>
                </div>
              </div>
              {isListening && (
                <div className="flex items-center gap-2 animate-pulse">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-red-600">Enregistrement en cours</span>
                </div>
              )}
            </div>

            {/* Visualisation audio */}
            {isListening && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="flex items-center justify-center space-x-1 h-12">
                  {[...Array(20)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-2 bg-gradient-to-t from-blue-400 to-blue-600 rounded-full animate-pulse"
                      style={{
                        height: `${20 + Math.sin(i * 0.5) * 20}px`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
                <p className="text-center text-sm text-blue-600 mt-2">Parlez maintenant...</p>
              </div>
            )}

            {/* Zone de transcription */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Transcription</label>
                <span className="text-xs text-gray-500">
                  {transcript.split(/\s+/).filter(w => w).length} mots
                </span>
              </div>
              <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                isListening 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="min-h-[120px] whitespace-pre-wrap text-gray-800">
                  {transcript || (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Votre parole apparaîtra ici...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contrôles */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={isListening ? handleStopListening : handleStartListening}
                className={`flex-1 flex items-center justify-center gap-3 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {isListening ? (
                  <>
                    <StopCircle className="w-5 h-5" />
                    Arrêter l'enregistrement
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    Commencer à parler
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  if (transcript) {
                    setText(transcript);
                    if (textAreaRef.current) {
                      textAreaRef.current.focus();
                    }
                  }
                }}
                disabled={!transcript}
                className="py-3 px-4 rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-sm font-medium">Utiliser comme texte</span>
              </button>
            </div>
          </div>

          {/* Carte 2 : Texte → Parole */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Volume2Icon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Texte → Parole</h2>
                  <p className="text-gray-500 text-sm">Pour les utilisateurs sourds/malentendants</p>
                </div>
              </div>
              {isPlaying && (
                <div className="flex items-center gap-2 animate-pulse">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-600">Lecture en cours</span>
                </div>
              )}
            </div>

            {/* Zone de saisie */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Votre message</label>
                <span className="text-xs text-gray-500">
                  {text.length} caractères
                </span>
              </div>
              <textarea
                ref={textAreaRef}
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Écrivez votre message ici... L'appli le lira à voix haute."
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none transition-all duration-300 min-h-[120px] bg-gray-50 hover:bg-white"
                rows={4}
              />
            </div>

            {/* Contrôles synthèse */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleSpeak(text)}
                disabled={!text.trim() || isPlaying}
                className="flex-1 flex items-center justify-center gap-3 py-3 px-6 rounded-xl border-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-800 hover:to-blue-900 text-white shadow-lg transition-colors disabled:cursor-not-allowed font-semibold"
              >
                <Volume2Icon className="w-5 h-5" />
                {isPlaying ? 'Lecture en cours...' : 'Lire à voix haute'}
              </button>
              
              {isPlaying && (
                <button
                  onClick={handleStopSpeaking}
                  className="flex-1 flex items-center justify-center gap-3 py-3 px-6 rounded-xl border-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-800 hover:to-blue-900 text-white shadow-lg transition-colors disabled:cursor-not-allowed font-semibold"
                >
                  <StopCircle className="w-5 h-5" />
                </button>
              )}
              
              <button
                onClick={handleReset}
                className="py-3 px-4 rounded-xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Contrôles avancés */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  <Settings className="w-4 h-4" />
                  Paramètres audio
                </button>
              </div>
              
              {showSettings && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-xl animate-fadeIn">
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vitesse de lecture: {speechSpeed.toFixed(1)}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={speechSpeed}
                      onChange={e => setSpeechSpeed(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                    />
                  </div> */}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Volume: {volume}%
                    </label>
                    <div className="flex items-center gap-3">
                      <VolumeX className="w-4 h-4 text-gray-400" />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={e => setVolume(parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                      />
                      <Volume1 className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Langue
                    </label>
                    <select
                      value={language}
                      onChange={e => setLanguage(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                    >
                      <option value="fr-FR">Français (France)</option>
                      <option value="en-US">English (US)</option>
                      <option value="es-ES">Español</option>
                    </select>
                  </div> */}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Historique et actions */}
        <div className="mt-10 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Historique de communication</h2>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={downloadTranscript}
                disabled={history.length === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Télécharger</span>
              </button>
              
              <button
                onClick={handleReset}
                disabled={history.length === 0 && !text && !transcript}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="text-sm font-medium">Tout effacer</span>
              </button>
            </div>
          </div>
          
          {history.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {history.slice().reverse().map((item, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    item.type === 'input'
                      ? 'border-green-200 bg-green-50'
                      : 'border-blue-200 bg-blue-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`p-1 rounded ${
                        item.type === 'input'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {item.type === 'input' ? (
                          <Volume2Icon className="w-3 h-3" />
                        ) : (
                          <Mic className="w-3 h-3" />
                        )}
                      </div>
                      <span className="text-xs font-medium">
                        {item.type === 'input' ? 'Écrit → Parole' : 'Parole → Écrit'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {item.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800">{item.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucun échange enregistré</p>
              <p className="text-sm">Commencez à communiquer pour voir l'historique</p>
            </div>
          )}
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{userData.name} {userData.forename}</p>
                  <p className="text-xs text-gray-500 capitalize">{userData.role}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>En ligne</span>
                </div>
                {/* <div>•</div>
                <div>Latence: {"<"}200ms</div>
                <div>•</div>
                <div>Précision: ~85%</div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Guide rapide */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-2">Astuce</h4>
            <p className="text-sm text-blue-700">
              Parlez clairement et à rythme modéré pour une meilleure transcription.
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
            <h4 className="font-semibold text-green-800 mb-2"> Conseil</h4>
            <p className="text-sm text-green-700">
              Ajustez la vitesse de lecture selon vos préférences dans les paramètres.
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-100">
            <h4 className="font-semibold text-purple-800 mb-2"> Note</h4>
            <p className="text-sm text-purple-700">
              Pour des résultats optimaux, utilisez Chrome ou Edge et un micro de qualité.
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-100">
            <h4 className="font-semibold text-yellow-800 mb-2">Durée d’écoute</h4>
            <p className="text-sm text-yellow-700">
              Enregistrez 60 s max de dictée continue et evitea des textes longs pour la transcription.
            </p>
          </div>
        </div>
      </main>
 <Footer />
      {/* Styles globaux supplémentaires */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        /* Scrollbar personnalisée */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        /* Focus styles */
        textarea:focus, select:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </div>
  );
}