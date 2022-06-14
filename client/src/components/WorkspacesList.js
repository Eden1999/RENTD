import WorkspacesListItem from "./WorkspacesListItem";
import { css } from "@emotion/react";
import { CSSProperties } from "react";
import {BeatLoader} from "react-spinners";

const override = {
    textAlign: "center"
};

const WorkspacesList = ({ workspaces, workspaceCardBody, orders, setMapMarkers, hoveredMarkerId, setHoveredWorkspaceId, loading }) => {

    return (
        !loading ? <div className={`flex grid gap-4 sweet-loading ${setMapMarkers ? "grid-cols-2" : "grid-cols-4"}`}>
            {workspaces &&
            workspaces.map((workspace) => (
                <WorkspacesListItem
                    key={workspace.id}
                    workspace={workspace}
                    workspaceCardBody={workspaceCardBody}
                    hoveredOnMap={workspace.id == hoveredMarkerId}
                    setHoveredWorkspaceId={setHoveredWorkspaceId}
                />
            ))}
            {orders &&
            orders.map((order) => (
                <WorkspacesListItem
                    key={order.id}
                    order={order}
                    workspaceCardBody={workspaceCardBody}
                />
            ))}
        </div> : <div className="text-center mt-24 w-full"><BeatLoader color="#818cf8" css={override} size={25} /></div>
    );
};

export default WorkspacesList;
