"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '../lib/i18n';
import { useLanguage } from '../context/LanguageContext';

export default function AboutContent() {
    const { locale } = useLanguage();
    const { t, isLoaded } = useTranslation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoaded) {
            setLoading(false);
        }
    }, [isLoaded]);

    if (loading) {
        return (
            <main className="about-page">
                <section className="page-header">
                    <h1>...</h1>
                    <p>...</p>
                </section>
                <section className="content-section skeleton-loading">
                    <div className="skeleton"></div>
                    <div className="skeleton"></div>
                    <div className="skeleton"></div>
                </section>
            </main>
        );
    }

    return (
        <main className="about-page">
            <section className="page-header">
                <h1>{t('about.title')}</h1>
                <p>{t('about.subtitle')}</p>
            </section>

            <section className="content-section">
                <h2>{t('about.mission')}</h2>
                <p>{t('about.mission_text')}</p>

                <h2>{t('about.team')}</h2>
                <p>{t('about.description')}</p>

                <h2>{t('about.vision')}</h2>
                <p>{t('about.vision_text')}</p>

                <div className="cta-buttons">
                    <Link href="https://github.com/MrXie23/PromptLibrary/blob/main/README.md" className="view-button">
                        {t('ui.how_to_contribute')}
                    </Link>
                    <a
                        href="https://github.com/MrXie23/PromptLibrary"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-button secondary"
                    >
                        {t('footer.github_repo')}
                    </a>
                </div>
            </section>
        </main>
    );
} 