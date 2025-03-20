import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '关于 - Prompt Library',
  description: '了解Prompt Library项目的起源、目标和愿景',
};

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="page-header">
        <h1>关于Prompt Library</h1>
        <p>探索AI提示的艺术</p>
      </section>

      <section className="content-section">
        <h2>我们的使命</h2>
        <p>
          Prompt Library旨在创建一个全面的AI提示词资源库，帮助用户充分利用人工智能的潜力。
          我们相信，精心设计的提示词是释放AI工具真正价值的关键。
        </p>
        
        <h2>项目起源</h2>
        <p>
          随着AI技术的迅速发展，越来越多的人开始使用各种AI工具来提高工作效率和创造力。
          然而，许多用户面临的挑战是如何有效地与这些工具沟通，以获得最佳结果。
        </p>
        <p>
          Prompt Library应运而生，旨在解决这一问题，通过提供经过精心策划的提示词库，
          帮助用户无论是在内容创作、编程开发、创意设计还是其他领域，都能够更有效地使用AI工具。
        </p>
        
        <h2>我们的团队</h2>
        <p>
          Prompt Library由一群热爱AI技术的开发者、设计师和内容创作者组成。
          我们致力于研究和优化与AI工具的交互方式，并将最佳实践分享给社区。
        </p>
        
        <h2>开源贡献</h2>
        <p>
          Prompt Library是一个开源项目，我们欢迎社区成员的贡献。
          无论是提交新的提示词、改进现有提示词，还是帮助完善网站功能，您的参与都将使这个项目变得更好。
        </p>
        <div className="cta-buttons">
          <Link href="/contribute" className="view-button">
            如何贡献
          </Link>
          <a 
            href="https://github.com/your-username/prompt-library" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="view-button secondary"
          >
            GitHub仓库
          </a>
        </div>
      </section>
    </main>
  );
}