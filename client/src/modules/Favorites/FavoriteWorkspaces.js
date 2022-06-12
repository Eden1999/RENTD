import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import useToken from "helpers/useToken";
import WorkspacesList from "../../components/WorkspacesList";
import {workspaceListType} from "../../helpers/consts";

const FavoriteWorkspaces = () => {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const { token } = useToken();

  useEffect(async () => {
    try {
      const res = await Axios.get(`${process.env.REACT_APP_SERVER_URL}/workspaces/userFavoriteWorkspaces`, {
          headers : {
              token
          }
      });
      setWorkspaces(res.data);
    } catch (err) {
      console.log(`Failed to fetch orders ${err.message}`);
    }
  }, []);

  const onItemClick = (workspace) => {
    navigate(`/workspaces/${workspace.id}`, { state: { workspace } });
  }

  return (
    <div className={'m-16'}>
      <div className="flex text-primary text-5xl font-medium mb-6">Here are the places that you've marked as your favorite!</div>
      <WorkspacesList
          workspaces={workspaces}
          workspaceCardBody={workspaceListType.general}
      />
    </div>
  );
};

export default FavoriteWorkspaces;
