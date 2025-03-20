import Link from 'next/link';
import { PromptData } from '@/types';

interface PromptCardProps {
  prompt: PromptData;
  featured?: boolean;
  isNew?: boolean;
}

export default function PromptCard({ prompt, featured = false, isNew = false }: PromptCardProps) {
  return (
    <div className={`prompt-card ${featured ? 'featured' : ''}`}>
      {featured && <div className="prompt-label">热门</div>}
      {isNew && <div className="prompt-label new">新增</div>}
      <h3>{prompt.title}</h3>
      <p>{prompt.description}</p>
      <div className="prompt-meta">
        <span className="category">{prompt.category}</span>
        {prompt.rating && (
          <span className="popularity">
            <i className="fa-solid fa-star"></i> {prompt.rating}
          </span>
        )}
        {prompt.createdAt && (
          <span className="date">{prompt.createdAt}</span>
        )}
      </div>
      <Link href={`/prompts/${prompt.slug}`} className="view-button" prefetch={true}>
        查看详情
      </Link>
    </div>
  );
}