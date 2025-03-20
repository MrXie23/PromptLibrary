"use client";

import { useState } from 'react';

export default function Subscribe() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    // 模拟API调用
    try {
      // 实际项目中，这里应该是一个真实的API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('订阅成功！感谢您的关注。');
      setEmail('');
    } catch (error) {
      setMessage('订阅失败，请稍后再试。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="subscribe">
      <div className="subscribe-content">
        <h2>获取最新提示词更新</h2>
        <p>订阅我们的通讯，第一时间获取新增提示词和使用技巧</p>
        <form className="subscribe-form" onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="您的邮箱地址" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '订阅中...' : '订阅'}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </section>
  );
}