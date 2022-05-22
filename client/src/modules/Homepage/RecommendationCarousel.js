import React from "react";
import WorkspaceHero from "./WorkspaceHero";

const RecommendationCarousel = () => {

  const recommendedWorkspaces = [
    {
      id:"1",
      name: "Gorilla",
      city: "Bat Yam",
      description: "Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.",
      spaceType: "Coffee",
      photo: "https://bigsee.eu/wp-content/uploads/2019/10/00_JAVH-hribar.jpg",
    },
    {
      id:"2",
      name: "Gourmet",
      city: "Tel Aviv",
      description: "Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.",
      spaceType: "Restaurant",
      photo: "https://media-cdn.tripadvisor.com/media/photo-s/1a/b8/46/6d/london-stock.jpg",
    },
    {
      id:"3",
      name: "Azrieli Office",
      city: "Holon",
      description: "Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.",
      spaceType: "Office",
      photo: "http://www.shabat-arch.com/wp-content/uploads/2018/07/%D7%A9%D7%9C%D7%99-%D7%A9%D7%91%D7%AA-%D7%A4%D7%A8%D7%95%D7%99%D7%A7%D7%98-%D7%9E%D7%92%D7%93%D7%9C-%D7%A2%D7%96%D7%A8%D7%99%D7%90%D7%9C%D7%99-3.jpg",
    },
  ];

  return (
    <div className="carousel h-full w-full">
      {recommendedWorkspaces.map((workspace, index) => {
        return (
          <div id={index} key={workspace.id} className="carousel-item relative w-full">
            <WorkspaceHero workspace={workspace} />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a href={'#' + (index + recommendedWorkspaces.length - 1) % recommendedWorkspaces.length} className="btn btn-secondary text-white btn-circle">❮</a>
              <a href={'#' + (index + 1) % recommendedWorkspaces.length} className="btn btn-secondary text-white btn-circle">❯</a>
            </div>
          </div>
          );
      })}
    </div>
  );
}

export default RecommendationCarousel;