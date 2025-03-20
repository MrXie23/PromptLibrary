import { useLanguage } from '../context/LanguageContext';
import { useEffect, useState } from 'react';

// 定义更灵活的类型
type TranslationValue = string | Record<string, any>;
type TranslationsType = Record<string, Record<string, any>>;
type LoadedStateType = Record<string, Record<string, boolean>>;
type LoadingPromisesType = Record<string, Record<string, Promise<any> | undefined>>;

// 用于存储翻译字符串的缓存
const translations: TranslationsType = {
  zh: {},
  en: {}
};

// 标记已加载的翻译
const loadedTranslations: LoadedStateType = {
  zh: {},
  en: {}
};

// 翻译加载状态
const loadingPromises: LoadingPromisesType = {
  zh: {},
  en: {}
};

// 预加载翻译
export const loadTranslation = async (locale: string, namespace: string = 'common') => {
  // 如果正在加载这个翻译，返回已有的Promise
  const currentPromise = loadingPromises[locale]?.[namespace];
  if (currentPromise !== undefined) {
    return currentPromise;
  }

  // 如果这个翻译已经加载过并且有内容，直接返回
  if (loadedTranslations[locale]?.[namespace] === true && 
      translations[locale]?.[namespace] && 
      Object.keys(translations[locale][namespace]).length > 0) {
    return translations[locale][namespace];
  }

  // 确保缓存对象存在
  if (!translations[locale]) translations[locale] = {};
  if (!loadedTranslations[locale]) loadedTranslations[locale] = {};
  if (!loadingPromises[locale]) loadingPromises[locale] = {};

  // 创建加载Promise
  const loadPromise = (async () => {
    try {
      // 从静态资源获取翻译文件，使用随机参数避免缓存
      const timestamp = new Date().getTime();
      const response = await fetch(`/PromptLibrary/locales/${locale}/${namespace}.json?_=${timestamp}`, {
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch translation file: ${response.status}`);
      }
      
      const data = await response.json();
      if (!data || Object.keys(data).length === 0) {
        throw new Error('Translation data is empty');
      }
      
      translations[locale][namespace] = data;
      loadedTranslations[locale][namespace] = true;
      
      console.log(`Successfully loaded translation for ${locale}/${namespace}`);
      return data;
    } catch (error) {
      console.error(`Failed to load translation for ${locale}/${namespace}`, error);
      // 清除加载状态，以便下次可以重试
      loadingPromises[locale][namespace] = undefined;
      throw error;
    }
  })();

  // 存储Promise引用
  loadingPromises[locale][namespace] = loadPromise;
  
  try {
    return await loadPromise;
  } finally {
    // 完成后清除Promise引用
    loadingPromises[locale][namespace] = undefined;
  }
};

// 强制重新加载翻译
export const reloadTranslation = async (locale: string, namespace: string = 'common') => {
  if (loadedTranslations[locale]?.[namespace] === true) {
    loadedTranslations[locale][namespace] = false;
  }
  
  // 重置加载Promise
  if (loadingPromises[locale]) {
    loadingPromises[locale][namespace] = undefined;
  }
  
  return loadTranslation(locale, namespace);
};

// 翻译函数，供组件中使用
export const useTranslation = (namespace: string = 'common') => {
  const { locale, isChangingLanguage } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 每当语言变化时，确保翻译已加载
    const ensureTranslationLoaded = async () => {
      try {
        await loadTranslation(locale, namespace);
        setIsLoaded(true);
      } catch (error) {
        console.error(`Failed to load translation in useEffect: ${locale}/${namespace}`, error);
      }
    };

    ensureTranslationLoaded();
  }, [locale, namespace]);
  
  const t = (key: string, params?: Record<string, string>) => {
    // 如果翻译尚未加载，则自动加载并返回键名
    if (!translations[locale] || 
        !translations[locale][namespace] || 
        isChangingLanguage) {
      
      // 检查是否已经有一个加载中的Promise
      const currentPromise = loadingPromises[locale]?.[namespace];
      if (!currentPromise) {
        // 异步加载翻译
        setTimeout(() => loadTranslation(locale, namespace), 0);
      }
      return key;
    }

    // 处理嵌套键，如 'nav.home'
    const keys = key.split('.');
    let value: any = translations[locale][namespace];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // 如果键不存在，返回原始键
        return key;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // 处理插值参数
    if (params) {
      return Object.entries(params).reduce(
        (str: string, [paramKey, paramValue]) => 
          str.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue),
        value as string
      );
    }

    return value;
  };

  return { t, isLoaded };
}; 