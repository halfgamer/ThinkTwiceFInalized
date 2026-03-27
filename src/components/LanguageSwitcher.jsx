import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Español' },
        { code: 'zh', name: '中文' },
        { code: 'hi', name: 'हिंदी' },
        { code: 'ja', name: '日本語' },
        { code: 'ko', name: '한국어' }
    ];

    const handleLanguageChange = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <select
            value={i18n.language}
            onChange={handleLanguageChange}
            className="btn btn-secondary"
            style={{
                padding: '8px 16px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontFamily: 'inherit'
            }}
            aria-label="Select language"
        >
            {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                    {lang.name}
                </option>
            ))}
        </select>
    );
};

export default LanguageSwitcher;
