import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "store/AppContext";
import WorkspaceForm from "./WorkspaceForm";
import RecommendationCarousel from "./RecommendationCarousel";

function HomepageView() {
    const [recommendations, setrecommendations] = useState([]);
    const [{ user }] = useContext(AppContext);
  
    useEffect(async () => {
        try {
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}workspaces/recommendations/${user.id}`);
        setrecommendations(res.data);
        } catch (err) {
        console.log(`Failed to fetch recommendations ${err.message}`);
        }
    }, []);

    return (
        <div className="flex flex-row flex-1 mx-20 my-10 2xl:my-20">
            <div className="w-1/3 self-center">
                <span className="text-2xl 2xl:text-3xl">
                    <p className="text-primary text-6xl 2xl:text-8xl font-medium">Welcome,</p>
                    <p className="text-secondary">Start your RENTD experience now!</p>
                </span>
                <div className="mt-6 2xl:mt-12">
                    <WorkspaceForm />
                </div>
            </div>
            <div className="flex-1 flex-col flex ml-36">
                {recommendations.length && <span className="text-secondary text-3xl font-medium italic">Recommended Workspaces - Just For You!</span>}
                <div className="mt-4 flex-grow">
                    <RecommendationCarousel recommendations={recommendations} />
                </div>
            </div>
        </div>
    );
}

export default HomepageView;