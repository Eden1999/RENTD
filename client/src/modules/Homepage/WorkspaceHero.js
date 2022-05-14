import React from "react";

function WorkspaceHero({workspace}) {
    return (
        <div className="hero"
             style={{backgroundImage: `url(` + workspace.photo + `)`}}>
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-center text-neutral-content">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold">{workspace.name}</h1>
                    <h2 className="mb-5 font-semibold">{workspace.spaceType}, {workspace.city} </h2>
                    <p className="mb-5">{workspace.description}</p>
                    <button className="btn btn-secondary">Reserve Now</button>
                </div>
            </div>
        </div>
    );
}

export default WorkspaceHero;