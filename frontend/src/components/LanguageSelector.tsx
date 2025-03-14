import React from 'react';

interface LanguageSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

interface Language {
  code: string;
  name: string;
}

const LanguageSelector = ({ label, value, onChange, disabled }: LanguageSelectorProps) => {
  const languages: Language[] = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'es-ES', name: 'Spanish (Spain)' },
    { code: 'fr-FR', name: 'French (France)' },
    { code: 'de-DE', name: 'German (Germany)' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'ar-SA', name: 'Arabic (Saudi Arabia)' },
    { code: 'hi-IN', name: 'Hindi (India)' },
    { code: 'ja-JP', name: 'Japanese (Japan)' },
    { code: 'ru-RU', name: 'Russian (Russia)' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)' }
  ];

  return (
    <div className="flex flex-col">
      <label htmlFor={`language-${label}`} className="mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={`language-${label}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
