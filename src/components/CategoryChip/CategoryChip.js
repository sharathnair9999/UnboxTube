import React from "react";
import { useVideos } from "../../contexts";
import "./CategoryChip.css";

const CategoryChip = ({ category }) => {
  const { videosState, videosDispatch } = useVideos();

  const {
    filters: { filterByCategory },
  } = videosState;

  const selectCategory = (cat) => {
    console.log("category", cat);
    videosDispatch({ type: "FILTER_BY_CATEGORY", payload: cat });
  };

  return (
    <button
      onClick={() => selectCategory(category)}
      className={`chip ${filterByCategory === category && "active"}`}
    >
      {category}
    </button>
  );
};

export default CategoryChip;