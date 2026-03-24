
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FiPlus, FiTrash2, FiVideo, FiImage, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import ChoiceForm from './ChoiceForm';

interface QuestionFormProps {
  index: number;
  question?: any;
  onRemove: () => void;
  onChange: (data: any) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const QuestionForm = ({ 
  index, 
  question, 
  onRemove, 
  onChange, 
  onMoveUp, 
  onMoveDown,
  isFirst,
  isLast 
}: QuestionFormProps) => {
  const [correctChoiceIndex, setCorrectChoiceIndex] = useState<number>(
    question?.choices?.findIndex((c: any) => c.is_correct) || 0
  );

  const { register, control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: question || {
      text: '',
      media_url: '',
      media_type: 'gif',
      points: 2,
      explanation: '',
      demonstration_video_url: '',
      order: index,
      choices: [
        { text: '', sign_video_url: '', is_correct: true, order: 0 },
        { text: '', sign_video_url: '', is_correct: false, order: 1 },
        { text: '', sign_video_url: '', is_correct: false, order: 2 },
        { text: '', sign_video_url: '', is_correct: false, order: 3 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'choices',
  });

  // Observer les changements
  React.useEffect(() => {
    const subscription = watch((value) => {
      // S'assurer qu'un seul choix est correct
      const choices = value.choices?.map((c: any, idx: number) => ({
        ...c,
        is_correct: idx === correctChoiceIndex,
      }));
      
      onChange({
        ...value,
        choices,
        order: index,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, index, correctChoiceIndex, onChange]);


  // Mettre à jour correctChoiceIndex quand question change
  React.useEffect(() => {
    if (question?.choices) {
      const newCorrectIndex = question.choices.findIndex((c: any) => c.is_correct);
      if (newCorrectIndex !== -1 && newCorrectIndex !== correctChoiceIndex) {
        setCorrectChoiceIndex(newCorrectIndex);
      }
    }
  }, [question]);

  const handleSetCorrectChoice = (choiceIndex: number) => {
    setCorrectChoiceIndex(choiceIndex);
    // Mettre à jour is_correct pour tous les choix
    fields.forEach((_, idx) => {
      setValue(`choices.${idx}.is_correct`, idx === choiceIndex);
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
      {/* En-tête de la question */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Question {index + 1}
          </h3>
          <div className="flex items-center gap-1">
            {!isFirst && (
              <button
                type="button"
                onClick={onMoveUp}
                className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                title="Déplacer vers le haut"
              >
                <FiChevronUp size={18} />
              </button>
            )}
            {!isLast && (
              <button
                type="button"
                onClick={onMoveDown}
                className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                title="Déplacer vers le bas"
              >
                <FiChevronDown size={18} />
              </button>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Supprimer cette question"
        >
          <FiTrash2 size={18} />
        </button>
      </div>

      {/* Contenu de la question */}
      <div className="space-y-4">
        {/* Texte de la question */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Intitulé de la question *
          </label>
          <input
            type="text"
            {...register('text', { 
    required: "Le texte de la question est requis" 
  })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Ex: Que signifie ce signe ?"
          />
            {errors.text && (
            <p className="mt-1 text-sm text-red-600">error</p>
          )}
        </div>

        {/* Média (GIF/Vidéo) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de média
            </label>
            <select
              {...register('media_type', { 
    required: "Le type de média est requis" 
  })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="gif">GIF animé</option>
              <option value="video">Vidéo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL du média *
            </label>
            <input
              type="url"
              {...register('media_url', { 
    required: "L'URL du média est requise" 
  })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://exemple.com/signe.gif"
            />
                        {errors.media_url && (
              <p className="mt-1 text-sm text-red-600">error</p>
            )}
          </div>
        </div>

        {/* Points */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Points *
          </label>
          <input
            type="number"
            {...register('points', { min: 1, max: 10 })}
            className="w-32 px-3 py-2 border border-gray-300 rounded-md"
            min="1"
            max="10"
          />
        </div>

        {/* Vidéo démonstration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vidéo d'explication (optionnel)
          </label>
          <input
            type="url"
            {...register('demonstration_video_url')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="https://exemple.com/explication.mp4"
          />
        </div>

        {/* Explication textuelle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Explication détaillée (optionnel)
          </label>
          <textarea
            {...register('explanation')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Expliquez pourquoi cette réponse est correcte..."
          />
        </div>

        {/* Choix de réponses */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Choix de réponses</h4>
            <button
              type="button"
              onClick={() => append({ 
                text: '', 
                sign_video_url: '', 
                is_correct: false, 
                order: fields.length 
              })}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
            >
              <FiPlus size={16} />
              Ajouter un choix
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, choiceIndex) => (
              <ChoiceForm
                key={field.id}
                index={choiceIndex}
                choice={question?.choices?.[choiceIndex]}
                onRemove={() => remove(choiceIndex)}
                onChange={(data) => {
                  // Mettre à jour le choix dans le formulaire
                  setValue(`choices.${choiceIndex}`, data);
                }}
                isCorrect={choiceIndex === correctChoiceIndex}
                onSetCorrect={() => handleSetCorrectChoice(choiceIndex)}
              />
            ))}

            {fields.length < 2 && (
              <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded">
                Ajoutez au moins 2 choix de réponse
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionForm;