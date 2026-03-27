import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Simulation = ({ scenario, onEnd, onResetSession }) => {
    const { t } = useTranslation();
    // Initialize state from localStorage or defaults
    const [currentStepId, setCurrentStepId] = useState(() => {
        const saved = localStorage.getItem(`sim_step_${scenario.id}`);
        return saved || scenario.initialStep || 'start';
    });

    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem(`sim_history_${scenario.id}`);
        return saved ? JSON.parse(saved) : [];
    });

    const [timeLeft, setTimeLeft] = useState(() => {
        const saved = localStorage.getItem(`sim_time_${scenario.id}`);
        return saved ? parseInt(saved, 10) : 90; // 1 minute 30 seconds
    });

    const [isTimeout, setIsTimeout] = useState(false);
    const [showLegitEscapeModal, setShowLegitEscapeModal] = useState(false);

    const currentStep = scenario.steps[currentStepId];

    // Persist state
    useEffect(() => {
        localStorage.setItem(`sim_step_${scenario.id}`, currentStepId);
        localStorage.setItem(`sim_history_${scenario.id}`, JSON.stringify(history));
        localStorage.setItem(`sim_time_${scenario.id}`, timeLeft.toString());
    }, [currentStepId, history, timeLeft, scenario.id]);

    // Timer logic
    useEffect(() => {
        if (isTimeout || showLegitEscapeModal) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsTimeout(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentStepId, isTimeout, showLegitEscapeModal]);

    const handleChoice = (choice) => {
        const newHistory = [...history, { step: currentStepId, choice: choice.label, timeSpent: 90 - timeLeft }];
        setHistory(newHistory);

        const nextStepId = choice.next;
        const nextStep = scenario.steps[nextStepId];

        if (nextStep.isEnd) {
            // Clear persistence for this scenario on end
            localStorage.removeItem(`sim_step_${scenario.id}`);
            localStorage.removeItem(`sim_history_${scenario.id}`);
            localStorage.removeItem(`sim_time_${scenario.id}`);

            onEnd({
                success: nextStep.success,
                message: nextStep.message,
                feedback: nextStep.feedback,
                history: newHistory
            });
        } else {
            setCurrentStepId(nextStepId);
            setTimeLeft(90); // Reset timer for next step
        }
    };

    const handleEmergencyExit = () => {
        if (scenario.isScam) {
            // Win
            localStorage.removeItem(`sim_step_${scenario.id}`);
            localStorage.removeItem(`sim_history_${scenario.id}`);
            localStorage.removeItem(`sim_time_${scenario.id}`);

            onEnd({
                success: true,
                message: t('simulation.winMessage'),
                feedback: t('simulation.winFeedback'),
                history: [...history, { step: currentStepId, choice: t('simulation.choiceEmergencyExit'), timeSpent: 90 - timeLeft }]
            });
        } else {
            // Legit - Show Modal
            setShowLegitEscapeModal(true);
        }
    };

    const handleLegitEscapeConfirm = (leave) => {
        setShowLegitEscapeModal(false);
        if (leave) {
            localStorage.removeItem(`sim_step_${scenario.id}`);
            localStorage.removeItem(`sim_history_${scenario.id}`);
            localStorage.removeItem(`sim_time_${scenario.id}`);

            onEnd({
                success: true, // Safe choice
                message: t('simulation.legitSafeMessage'),
                feedback: t('simulation.legitSafeFeedback'),
                history: [...history, { step: currentStepId, choice: `${t('simulation.choiceEmergencyExit')} (Legit)`, timeSpent: 90 - timeLeft }]
            });
        } else {
            // Continue - do nothing, timer resumes
        }
    };

    const handleTimeoutAction = (action) => {
        if (action === 'retry') {
            setTimeLeft(90);
            setIsTimeout(false);
        } else if (action === 'home') {
            localStorage.removeItem(`sim_step_${scenario.id}`);
            localStorage.removeItem(`sim_history_${scenario.id}`);
            localStorage.removeItem(`sim_time_${scenario.id}`);

            onEnd({
                success: false,
                message: t('simulation.timeoutMessage'),
                feedback: t('simulation.timeoutFeedback'),
                history: [...history, { step: currentStepId, choice: t('simulation.choiceTimeout'), timeSpent: 90 }]
            });
        } else if (action === 'reset') {
            localStorage.clear(); // Clear all
            onResetSession();
        }
    };

    if (isTimeout) {
        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.9)', color: 'white',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                zIndex: 1000
            }}>
                <h1 style={{ color: 'red', fontSize: '3rem' }}>{t('simulation.timeUp')}</h1>
                <p style={{ fontSize: '1.5rem', maxWidth: '600px', textAlign: 'center' }}>
                    {t('simulation.timeUpMsg')}
                </p>
                <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
                    <button
                        onClick={() => handleTimeoutAction('retry')}
                        className="btn btn-primary"
                        style={{ fontSize: '1.2rem', padding: '15px 30px' }}
                    >
                        {t('simulation.retryStep')}
                    </button>
                    <button
                        onClick={() => handleTimeoutAction('home')}
                        className="btn btn-secondary"
                        style={{ fontSize: '1.2rem', padding: '15px 30px' }}
                    >
                        {t('simulation.goHomeFail')}
                    </button>
                    <button
                        onClick={() => handleTimeoutAction('reset')}
                        className="btn btn-danger"
                        style={{ fontSize: '1.2rem', padding: '15px 30px' }}
                    >
                        {t('simulation.fullReset')}
                    </button>
                </div>
            </div>
        );
    }

    if (showLegitEscapeModal) {
        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.8)', color: 'white',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                zIndex: 1000
            }}>
                <div style={{ backgroundColor: 'white', color: 'black', padding: '40px', borderRadius: '10px', maxWidth: '500px', textAlign: 'center' }}>
                    <h2>{t('simulation.wait')}</h2>
                    <p>{t('simulation.legitMsg')}</p>
                    <p>{t('simulation.legitDetail')}</p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
                        <button
                            onClick={() => handleLegitEscapeConfirm(false)}
                            className="btn btn-primary"
                        >
                            {t('simulation.continue')}
                        </button>
                        <button
                            onClick={() => handleLegitEscapeConfirm(true)}
                            className="btn btn-secondary"
                        >
                            {t('simulation.leave')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Helper to render fake UI content based on type
    const renderContent = (content) => {
        const boxStyle = {
            backgroundColor: 'white',
            border: '2px solid black',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
            fontFamily: 'Arial, sans-serif', // Generic font for fake UI
            color: 'black'
        };

        switch (content.type) {
            case 'email':
                return (
                    <div style={boxStyle}>
                        <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px' }}>
                            <strong>{t('simulation.from')}:</strong> {content.sender}<br />
                            <strong>{t('simulation.subject')}:</strong> {content.subject}
                        </div>
                        <div>{content.body}</div>
                    </div>
                );
            case 'phone':
                return (
                    <div style={{ ...boxStyle, backgroundColor: '#f8f9fa', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>📞 {t('simulation.incomingCall')}</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{content.caller}</div>
                        <div style={{ marginTop: '20px', fontStyle: 'italic', color: '#555' }}>
                            ({t('simulation.voice')}): {content.audio_text}
                        </div>
                    </div>
                );
            case 'social':
                return (
                    <div style={{ ...boxStyle, border: '1px solid #ddd' }}>
                        <div style={{ color: '#3b5998', fontWeight: 'bold', marginBottom: '5px' }}>{content.platform} {t('simulation.platformMessage')}</div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#ccc', borderRadius: '50%', marginRight: '10px' }}></div>
                            <strong>{content.sender}</strong>
                        </div>
                        <div style={{ backgroundColor: '#f1f0f0', padding: '10px', borderRadius: '10px' }}>
                            {content.message}
                        </div>
                    </div>
                );
            case 'web':
            case 'popup':
                return (
                    <div style={boxStyle}>
                        {content.url && <div style={{ backgroundColor: '#eee', padding: '5px', marginBottom: '10px', fontSize: '0.9rem' }}>🔒 {content.url}</div>}
                        {content.header && <h3 style={{ color: 'red' }}>{content.header}</h3>}
                        {content.headline && <h3>{content.headline}</h3>}
                        {content.product && <h3>{content.product} - {content.price}</h3>}
                        <p>{content.body}</p>
                        {content.input && <input type="text" placeholder={content.input} disabled style={{ marginTop: '10px', padding: '5px', width: '100%' }} />}
                        {content.timer && <p style={{ color: 'red', fontWeight: 'bold' }}>{content.timer}</p>}
                    </div>
                );
            case 'info':
            default:
                return (
                    <div style={{ ...boxStyle, backgroundColor: '#e3f2fd', border: '2px solid #2196f3' }}>
                        <p>{content.text}</p>
                    </div>
                );
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>{scenario.title}</h2>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                        onClick={onResetSession}
                        className="btn btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '1rem' }}
                    >
                        {t('layout.reset')}
                    </button>
                    <div style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: timeLeft < 10 ? 'red' : 'black',
                        border: '2px solid black',
                        padding: '5px 10px',
                        borderRadius: '8px',
                        backgroundColor: 'white'
                    }}>
                        ⏱ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                </div>
            </div>

            {renderContent(currentStep.content)}

            <div style={{ display: 'grid', gap: '16px', marginBottom: '40px' }}>
                {currentStep.options.map((choice, index) => (
                    <button
                        key={index}
                        data-testid={`option-${index}`}
                        onClick={() => handleChoice(choice)}
                        className="btn btn-secondary"
                        style={{ textAlign: 'left' }}
                    >
                        {choice.label}
                    </button>
                ))}
            </div>

            <div style={{ borderTop: '2px solid #ccc', paddingTop: '20px', textAlign: 'center' }}>
                <button
                    data-testid="escape-button"
                    onClick={handleEmergencyExit}
                    className="btn btn-danger"
                >
                    {t('simulation.escape')}
                </button>
            </div>
        </div>
    );
};

export default Simulation;
