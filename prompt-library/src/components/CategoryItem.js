import React from "react";
import { Link } from "gatsby";
import "../styles/components/categoryItem.module.css";

const CategoryItem = ({ name, count, icon }) => {
  return (
    <Link to={`/categories/${name}`} className="category-item">
      <div className="category-icon">
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div className="category-info">
        <h3>{name}</h3>
        <p>{count}个提示词</p>
      </div>
    </Link>
  );
};

export default CategoryItem;