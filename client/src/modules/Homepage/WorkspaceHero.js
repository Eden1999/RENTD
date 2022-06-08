import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const WorkspaceHero = ({workspace}) => {
    const navigate = useNavigate();

    const onItemClick = useCallback((workspace) => {
        navigate(`/workspaces/${workspace.id}`, { state: { workspace } });
    }, []);

    return (
        <div className="hero"
             style={{backgroundImage: `url(` + workspace.photos?.[0] + `)`}}>
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-center text-neutral-content">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold text-white">{workspace.name}</h1>
                    <h2 className="mb-5 font-semibold text-white">{workspace.spaceType.name}, {workspace.city} </h2>
                    <p className="mb-5 text-white">{workspace.description}</p>
                    <button className="btn btn-primary" onClick={() => onItemClick(workspace)}>Reserve Now</button>
                </div>
            </div>
        </div>
    );
}

export default WorkspaceHero;