"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { loadTranslation } from '../lib/i18n';

// 定义支持的语言
const supportedLocales = ['zh', 'en'];
const defaultLocale = 'zh';

type LanguageContextType = {
    locale: string;
    changeLanguage: (newLocale: string) => void;
    isChangingLanguage: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [locale, setLocale] = useState<string>(defaultLocale);
    const [isChangingLanguage, setIsChangingLanguage] = useState(false);
    const [translationsReady, setTranslationsReady] = useState(false);

    // 初始化加载当前语言
    useEffect(() => {
        const initializeLanguage = async () => {
            // 从localStorage获取用户设置的语言，如果存在
            const savedLocale = localStorage.getItem('language');
            let selectedLocale = defaultLocale;

            if (savedLocale && supportedLocales.includes(savedLocale)) {
                selectedLocale = savedLocale;
            } else {
                // 检测浏览器语言
                const browserLocale = navigator.language.split('-')[0];
                if (supportedLocales.includes(browserLocale)) {
                    selectedLocale = browserLocale;
                    localStorage.setItem('language', browserLocale);
                } else {
                    // 设置默认语言
                    localStorage.setItem('language', defaultLocale);
                }
            }

            // 设置初始语言
            setLocale(selectedLocale);

            // 预加载翻译
            try {
                await loadTranslation(selectedLocale);
                setTranslationsReady(true);
            } catch (err) {
                console.error('Failed to preload translation:', err);
            }
        };

        initializeLanguage();
    }, []);

    const changeLanguage = async (newLocale: string) => {
        if (supportedLocales.includes(newLocale) && newLocale !== locale && !isChangingLanguage) {
            setIsChangingLanguage(true);

            try {
                // 先加载翻译，确保能成功获取
                const data = await loadTranslation(newLocale, 'common');

                // 只有在成功加载翻译后才改变语言
                if (data && Object.keys(data).length > 0) {
                    setLocale(newLocale);
                    localStorage.setItem('language', newLocale);
                    console.log(`Successfully changed language to ${newLocale}`);
                } else {
                    throw new Error('Translation data is empty');
                }
            } catch (error) {
                console.error(`Failed to load translation for ${newLocale}:`, error);
            } finally {
                setIsChangingLanguage(false);
            }
        }
    };

    return (
        <LanguageContext.Provider value={{ locale, changeLanguage, isChangingLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};