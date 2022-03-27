import React, {useEffect, useState} from "react";
import WorkspacesListItem from "./WorkspacesListItem";
import Axios from "axios";

const WorkspacesList = () => {
    const [workspaces, setWorkspaces] = useState([]);

    useEffect(async () => {
        try {
            const query = {};
            const res = await Axios.post("http://localhost:8000/workspaces/search", query);
            setWorkspaces(res.data);
        } catch (err) {
            console.log(`Failed to fetch workspaces ${err.message}`);
        }
    }, []);

    return (
      <div className={'text-white flex flex-col px-12'}>
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