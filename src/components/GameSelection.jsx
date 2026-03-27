import React from 'react';
import { useTranslation } from 'react-i18next';

const GameSelection = ({ scenarios, onSelect, completedScenarios = [], onReset }) => {
    const { t } = useTranslation();

    return (
        <div style={{ position: 'relative' }}>
            {onReset && (
                <button
                    onClick={onReset}
                    className="btn btn-secondary"
                    style={{ position: 'absolute', top: 0, right: 0, padding: '8px 16px', fontSize: '1rem' }}
                >
                    {t('layout.reset')}
                </button>
            )}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{t('gameSelection.title')}</h2>
                <p style={{ fontSize: '1.2rem' }}>
                    {t('gameSelection.subtitle')}
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px'
            }}>
                {scenarios.map(scenario => {
                    const isCompleted = completedScenarios.includes(scenario.id);
                    return (
                        <div key={scenario.id} className="card">
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
                                {scenario.title}
                            </h3>
                            <p style={{ marginBottom: '20px' }}>
                                {scenario.description}
                            </p>
                            <button
                                onClick={() => onSelect(scenario.id)}
                                className="btn"
                                style={{ width: '100%', backgroundColor: isCompleted ? '#e0e0e0' : 'var(--color-yellow)' }}
                            >
                                {isCompleted ? t('gameSelection.retry') : t('gameSelection.start')}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GameSelection;
