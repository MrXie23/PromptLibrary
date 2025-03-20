"use client";

import { useState } from 'react';
import { PromptData } from '@/types';

interface PromptActionsProps {
    prompt: PromptData;
}

export default function PromptActions({ prompt }: PromptActionsProps) {
    const [copyStatus, setCopyStatus] = useState('');
    const [showShareModal, setShowShareModal] = useState(false);

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

    return (
        <section className="prompt-actions">
            <button className="copy-button" onClick={handleCopy}>
                <i className="fa-solid fa-copy"></i> 复制提示词
                {copyStatus === 'success' && <span className="copy-status success">复制成功!</span>}
                {copyStatus === 'error' && <span className="copy-status error">复制失败!</span>}
            </button>
            <button className="share-button" onClick={handleShare}>
                <i className="fa-solid fa-share-nodes"></i> 分享
            </button>

            {/* 分享模态框 */}
            {showShareModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>分享提示词</h3>
                            <button
                                className="close-button"
                                onClick={handleCloseModal}
                                style={{ width: '24px', height: '24px', minWidth: '24px', padding: 0 }}
                            >
                                <i className="fa-solid fa-xmark" style={{ fontSize: '12px' }}></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>复制以下链接并分享这个提示词：</p>
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
                                    title="复制链接"
                                    style={{ width: '36px', height: '36px', minWidth: '36px', padding: 0 }}
                                >
                                    <i className="fa-regular fa-copy" style={{ fontSize: '14px' }}></i>
                                </button>
                            </div>
                            {copyStatus === 'link-copied' && <p className="link-status success">链接已复制!</p>}
                            {copyStatus === 'link-error' && <p className="link-status error">复制失败!</p>}
                        </div>
                        <div className="modal-footer">
                            <p className="share-tip">您也可以使用下方社交媒体分享：</p>
                            <div className="social-share">
                                <a
                                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(`查看这个AI提示词："${prompt.title}" 来自PromptLibrary`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-share-button twitter"
                                    title="分享到Twitter"
                                    style={{ width: '36px', height: '36px' }}
                                >
                                    <i className="fa-brands fa-twitter"></i>
                                </a>
                                <a
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-share-button linkedin"
                                    title="分享到LinkedIn"
                                    style={{ width: '36px', height: '36px' }}
                                >
                                    <i className="fa-brands fa-linkedin-in"></i>
                                </a>
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-share-button facebook"
                                    title="分享到Facebook"
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