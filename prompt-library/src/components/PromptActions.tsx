"use client";

import { useState, useEffect } from 'react';
import { PromptData } from '@/types';
import { useTranslation } from '../lib/i18n';
import { useLanguage } from '../context/LanguageContext';

interface PromptActionsProps {
    prompt: PromptData;
}

export default function PromptActions({ prompt }: PromptActionsProps) {
    const [copyStatus, setCopyStatus] = useState('');
    const [showShareModal, setShowShareModal] = useState(false);
    const { locale } = useLanguage();
    const { t, isLoaded } = useTranslation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoaded) {
            setLoading(false);
        }
    }, [isLoaded]);

    // 获取干净的提示词内容（移除HTML标签）
    const getCleanPromptContent = () => {
        // 使用临时元素解析HTML
        if (!prompt.content) return '';

        const tempElement = document.createElement('div');
        tempElement.innerHTML = prompt.content;
        return tempElement.textContent || tempElement.innerText || '';
    };

    // 复制提示词到剪贴板
    const handleCopy = async () => {
        const content = getCleanPromptContent();

        try {
            await navigator.clipboard.writeText(content);
            setCopyStatus('success');

            // 3秒后重置状态
            setTimeout(() => {
                setCopyStatus('');
            }, 3000);
        } catch (err) {
            setCopyStatus('error');

            // 3秒后重置状态
            setTimeout(() => {
                setCopyStatus('');
            }, 3000);
        }
    };

    // 打开分享模态框
    const handleShare = () => {
        setShowShareModal(true);
    };

    // 关闭分享模态框
    const handleCloseModal = () => {
        setShowShareModal(false);
    };

    // 复制分享链接
    const handleCopyLink = async () => {
        // 获取当前URL
        const shareUrl = window.location.href;

        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopyStatus('link-copied');

            // 3秒后重置状态
            setTimeout(() => {
                setCopyStatus('');
            }, 3000);
        } catch (err) {
            setCopyStatus('link-error');

            // 3秒后重置状态
            setTimeout(() => {
                setCopyStatus('');
            }, 3000);
        }
    };

    if (loading) {
        return (
            <section className="prompt-actions">
                <button className="copy-button" disabled>
                    <i className="fa-solid fa-copy"></i> ...
                </button>
                <button className="share-button" disabled>
                    <i className="fa-solid fa-share-nodes"></i> ...
                </button>
            </section>
        );
    }

    return (
        <section className="prompt-actions">
            <button className="copy-button" onClick={handleCopy}>
                <i className="fa-solid fa-copy"></i> {t('prompt_card.copy_button')}
                {copyStatus === 'success' && <span className="copy-status success">{t('prompt_card.copied')}</span>}
                {copyStatus === 'error' && <span className="copy-status error">{t('ui.error')}</span>}
            </button>
            <button className="share-button" onClick={handleShare}>
                <i className="fa-solid fa-share-nodes"></i> {t('ui.share')}
            </button>

            {/* 分享模态框 */}
            {showShareModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{t('ui.share_prompt')}</h3>
                            <button
                                className="close-button"
                                onClick={handleCloseModal}
                                style={{ width: '24px', height: '24px', minWidth: '24px', padding: 0 }}
                            >
                                <i className="fa-solid fa-xmark" style={{ fontSize: '12px' }}></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>{t('ui.copy_link_and_share')}</p>
                            <div className="share-link-container">
                                <input
                                    type="text"
                                    className="share-link"
                                    value={typeof window !== 'undefined' ? window.location.href : ''}
                                    readOnly
                                />
                                <button
                                    className="copy-link-button"
                                    onClick={handleCopyLink}
                                    title={t('ui.copy_link')}
                                    style={{ width: '36px', height: '36px', minWidth: '36px', padding: 0 }}
                                >
                                    <i className="fa-regular fa-copy" style={{ fontSize: '14px' }}></i>
                                </button>
                            </div>
                            {copyStatus === 'link-copied' && <p className="link-status success">{t('ui.link_copied')}</p>}
                            {copyStatus === 'link-error' && <p className="link-status error">{t('ui.copy_failed')}</p>}
                        </div>
                        <div className="modal-footer">
                            <p className="share-tip">{t('ui.share_social')}</p>
                            <div className="social-share">
                                <a
                                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(`${t('ui.check_prompt')}"${prompt.title}" ${t('ui.from_prompt_library')}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-share-button twitter"
                                    title={t('ui.share_twitter')}
                                    style={{ width: '36px', height: '36px' }}
                                >
                                    <i className="fa-brands fa-twitter"></i>
                                </a>
                                <a
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-share-button linkedin"
                                    title={t('ui.share_linkedin')}
                                    style={{ width: '36px', height: '36px' }}
                                >
                                    <i className="fa-brands fa-linkedin-in"></i>
                                </a>
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-share-button facebook"
                                    title={t('ui.share_facebook')}
                                    style={{ width: '36px', height: '36px' }}
                                >
                                    <i className="fa-brands fa-facebook-f"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
} 