import React, {useContext, useEffect, useState} from "react";
import WorkspacesListItem from "../WorkspaceManagment/WorkspacesListItem";
import Axios from "axios";
import {AppContext} from "../../store/AppContext";

const WorkspacesList = () => {
    const [workspaces, setWorkspaces] = useState([]);
    const [{user}] = useContext(AppContext);

    useEffect(async () => {
        try {
            const query = {};
            const res = await Axios.get(`http://localhost:8000/workspaces/hosts/${user.id}`);
            setWorkspaces(res.data);
        } catch (err) {
            console.log(`Failed to fetch workspaces ${err.message}`);
        }
    }, []);

    return (
        <div className={'text-white flex flex-col flex-1'}>
            {
                workspaces.map((workspace) => (
                    <WorkspacesListItem workspace={workspace}/>
                    )
                )
            }
        </div>
    );
}

export default WorkspacesList;