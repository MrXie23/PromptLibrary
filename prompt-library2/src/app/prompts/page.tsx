import { Metadata } from 'next';
import { getAllPrompts } from '@/lib/prompts';
import PromptCard from '@/components/PromptCard';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '所有提示词 - Prompt Library',
  description: '浏览我们完整的AI提示词集合，找到适合您需求的完美提示词',
};

export default function PromptsPage() {
  const allPrompts = getAllPrompts();
  
  return (
    <main>
      <section className="page-header">
        <h1>所有提示词</h1>
        <p>浏览我们完整的AI提示词集合，找到适合您需求的完美提示词</p>
      </section>
      
      <section className="prompts-list">
        <div className="prompt-grid">
          {allPrompts.map(prompt => (
            <PromptCard 
              key={prompt.slug} 
              prompt={prompt} 
              featured={prompt.featured} 
              isNew={prompt.isNew}
            />
          ))}
        </div>
      </section>
    </main>
  );
}