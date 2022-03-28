import React from "react";
import WorkspacesList from "./WorkspacesList";
import WorkspacesToolbar from "./WorkspacesToolbar";

const WorkspacesSearchData = () => {
    return (
        <div className={'flex-1 flex flex-col'}>
            <div className={'h-20 mt-8'}>
                <WorkspacesToolbar />
            </div>
            <div className={'flex-1'}>
                <WorkspacesList />
            </div>
        </div>
    )
}

export default WorkspacesSearchData;