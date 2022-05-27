import React from "react";
import WorkspaceHero from "./WorkspaceHero";

const RecommendationCarousel = ({recommendations}) => {

  return (
    <div className="carousel h-full w-full">
      {recommendations.map((workspace, index) => {
        return (
          <div id={index} key={workspace.id} className="carousel-item relative w-full">
            <WorkspaceHero workspace={workspace} />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a href={'#' + (index + recommendations.length - 1) % recommendations.length} className="btn btn-secondary text-white btn-circle">❮</a>
              <a href={'#' + (index + 1) % recommendations.length} className="btn btn-secondary text-white btn-circle">❯</a>
            </div>
          </div>
          );
      })}
    </div>
  );
}

export default RecommendationCarousel;