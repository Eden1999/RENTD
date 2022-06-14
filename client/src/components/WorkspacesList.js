import WorkspacesListItem from "./WorkspacesListItem";

const WorkspacesList = ({ workspaces, workspaceCardBody, orders, setMapMarkers, hoveredMarkerId, setHoveredWorkspaceId }) => {

    return (
        <div className={`flex grid ${setMapMarkers ? "grid-cols-2" : "grid-cols-4 gap-4"}`}>
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
        </div>
    );
};

export default WorkspacesList;
