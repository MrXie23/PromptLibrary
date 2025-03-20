"use client";

import { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../lib/i18n';
import { loadTranslation, reloadTranslation } from '../lib/i18n';

export default function LanguageSwitcher() {
    const { locale, changeLanguage, isChangingLanguage } = useLanguage();
    const [isReady, setIsReady] = useState(false);
    const { t, isLoaded } = useTranslation();

    // 确保组件挂载后加载翻译
    useEffect(() => {
        const prepareTranslations = async () => {
            try {
                // 确保当前语言已加载
                await loadTranslation(locale);
                // 预加载其他语言
                const otherLocale = locale === 'zh' ? 'en' : 'zh';
                await loadTranslation(otherLocale);
                setIsReady(true);
            } catch (error) {
                console.error('Failed to prepare translations:', error);
                // 即使出错也允许显示切换器
                setIsReady(true);
            }
        };
        prepareTranslations();
    }, [locale]);

    // 优化的语言切换处理
    const handleLanguageChange = useCallback(async (newLocale: string) => {
        if (newLocale === locale || isChangingLanguage) return;

        try {
            // 在切换前重新加载目标语言翻译，确保获取最新版本
            await reloadTranslation(newLocale);
            changeLanguage(newLocale);
        } catch (error) {
            console.error(`Failed to switch to language ${newLocale}:`, error);
            // 即使出错也尝试切换
            changeLanguage(newLocale);
        }
    }, [locale, changeLanguage, isChangingLanguage]);

    // 基础版本的切换器，适用于任何状态
    const renderSwitcher = () => (
        <div className="language-switcher">
            <div className="language-options">
                <button
                    className={locale === 'zh' ? 'active' : ''}
                    onClick={() => handleLanguageChange('zh')}
                    disabled={isChangingLanguage}
                    aria-label={isLoaded ? t('language.zh') : '中文'}
                >
                    中文
                </button>
                <span className="language-separator">|</span>
                <button
                    className={locale === 'en' ? 'active' : ''}
                    onClick={() => handleLanguageChange('en')}
                    disabled={isChangingLanguage}
                    aria-label={isLoaded ? t('language.en') : 'English'}
                >
                    English
                </button>
            </div>
        </div>
    );

    return renderSwitcher();
} 