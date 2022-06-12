import React, {useState, useCallback, useContext, useEffect} from "react";
import { Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import { Link } from "react-router-dom";

import WorkspacesList from "../../components/WorkspacesList";
import {AppContext} from "../../store/AppContext";
import Axios from "axios";
import {workspaceListType} from "../../helpers/consts";
const MySpaces = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [mapMarkers, setMapMarkers] = useState();
  const [{ user }] = useContext(AppContext);

  useEffect(async () => {
    try {
      const res = await Axios.get(`${process.env.REACT_APP_SERVER_URL}/workspaces/hosts/${user.id}`);
      setWorkspaces(res.data);
      setMapMarkers(res.data);
    } catch (err) {
      console.log(`Failed to fetch workspaces ${err.message}`);
    }
  }, []);

  return (
    <Container className="h-full">
      <div className="flex h-full">
        <div className="flex flex-1 flex-col mr-10">
          <div className="flex justify-between mt-8 text-primary text-5xl font-medium">
            <span>My workspaces</span>
            <Link to={"/manage/newWorkspace"}>
              <button className="btn btn-circle">
                <Add />
              </button>
            </Link>
          </div>
          <div className="flex mt-10">
            <WorkspacesList
                workspaces={workspaces}
                workspaceCardBody={workspaceListType.general}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default MySpaces;
