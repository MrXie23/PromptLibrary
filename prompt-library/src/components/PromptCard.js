import React from "react";
import { Link } from "gatsby";
import "../styles/components/promptCard.module.css";

const PromptCard = ({
  title,
  description,
  category,
  popularity,
  slug,
  isNew = false,
  isFeatured = false,
  date,
}) => {
  return (
    <div className={`prompt-card ${isFeatured ? "featured" : ""}`}>
      {isNew && <div className="prompt-label new">新增</div>}
      {isFeatured && <div className="prompt-label">热门</div>}
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="prompt-meta">
        <span className="category">{category}</span>
        {popularity && (
          <span className="popularity">
            <i className="fa-solid fa-star"></i> {popularity}
          </span>
        )}
        {date && <span className="date">{date}</span>}
      </div>
      <Link to={slug} className="view-button">查看详情</Link>
    </div>
  );
};

export default PromptCard;