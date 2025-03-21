"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '../lib/i18n';
import { loadTranslation } from '../lib/i18n';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const { locale } = useLanguage();
  const { t, isLoaded: translationsLoaded } = useTranslation();

  useEffect(() => {
    if (translationsLoaded) {
      setIsLoaded(true);
    }
  }, [translationsLoaded]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // 在翻译加载完成前显示基础版本
  if (!isLoaded) {
    return (
      <section className="hero">
        <div className="hero-content">
          <h1>...</h1>
          <p>...</p>
          <div className="search-container max-w-3xl mx-auto flex items-center border rounded-full shadow-lg overflow-hidden bg-white">
            <input
              type="text"
              disabled
              className="flex-grow p-4 text-lg border-none focus:outline-none focus:ring-0 w-full"
            />
            <button
              className="search-button py-4 px-8 text-lg font-medium bg-blue-500 hover:bg-blue-600 transition-colors text-white"
              disabled
            >
              ...
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>{t('hero.title')}</h1>
        <p>{t('hero.subtitle')}</p>
        <form className="search-container max-w-3xl mx-auto flex items-center border rounded-full shadow-lg overflow-hidden bg-white" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder={t('hero.search_placeholder')}
            id="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow p-4 text-lg border-none focus:outline-none focus:ring-0 w-full"
          />
          <button
            type="submit"
            className="search-button py-4 px-8 text-lg font-medium bg-blue-500 hover:bg-blue-600 transition-colors text-white"
          >
            {t('hero.search_button')}
          </button>
        </form>
      </div>
    </section>
  );
}