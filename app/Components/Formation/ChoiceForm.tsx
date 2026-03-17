
import React from 'react';
import { useForm } from 'react-hook-form';
import { FiTrash2, FiVideo, FiImage } from 'react-icons/fi';

interface ChoiceFormProps {
  index: number;
  choice?: any;
  onRemove: () => void;
  onChange: (data: any) => void;
  isCorrect: boolean;
  onSetCorrect: () => void;
}

const ChoiceForm = ({ 
  index, 
  choice, 
  onRemove, 
  onChange, 
  isCorrect, 
  onSetCorrect
}: ChoiceFormProps) => {
  const { register, watch } = useForm({
    defaultValues: choice || {
      text: '',
      sign_video_url: '',
      is_correct: false,
      order: index,
    },
  });

  // Observer les changements
  React.useEffect(() => {
    const subscription = watch((value) => {
      onChange({ ...value, is_correct: isCorrect, order: index });
    });
    return () => subscription.unsubscribe();
  }, [watch, index, isCorrect, onChange]);

  return (
    <div className={`p-4 border rounded-lg ${isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
      <div className="flex items-start gap-4">
        {/* Indicateur de bonne réponse */}
        <div className="flex-shrink-0 pt-2">
          <button
            type="button"
            onClick={onSetCorrect}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              isCorrect 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'border-gray-300 hover:border-green-500'
            }`}
            title={isCorrect ? "Bonne réponse" : "Marquer comme bonne réponse"}
          >
            {isCorrect && '✓'}
          </button>
        </div>

        {/* Contenu du choix */}
        <div className="flex-1 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Texte du choix {index + 1} *
            </label>
            <input
              type="text"
              {...register(`text`)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Ex: Bonjour"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vidéo du signe (optionnel)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                {...register(`sign_video_url`)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="https://exemple.com/signe.mp4"
              />
              <button
                type="button"
                className="px-3 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
                title="Aperçu vidéo"
              >
                <FiVideo size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Bouton suppression */}
        <button
          type="button"
          onClick={onRemove}
          className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Supprimer ce choix"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChoiceForm;