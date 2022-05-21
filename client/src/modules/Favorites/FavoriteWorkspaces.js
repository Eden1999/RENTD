import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import useToken from "helpers/useToken";

const FavoriteWorkspaces = () => {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const { token } = useToken();

  useEffect(async () => {
    try {
      const res = await Axios.get(`${process.env.REACT_APP_SERVER_URL}workspaces/userFavoriteWorkspaces`, {
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
      <div className="flex text-3xl text-zinc-200">Here are the places that you've marked as your favorite!</div>
      {workspaces.map((workspace) => (
        <div key={workspace.id}
             className={`flex flex-row flex-1 bg-zinc-500 hover:bg-zinc-500/90 rounded-lg p-3 mt-5 w-1/3`}
             onClick={(e) => onItemClick(workspace)}>
          <div className={'flex w-11/12'}>
            <img className={"h-28 w-48 bg-zinc-400 rounded-md"} src={workspace.photo} alt="Man looking at item at a store"/>
            <span className={"flex flex-col text-left flex-1 ml-8 hover:cursor-default"}>
                <span className={"text-xl text-zinc-100"}>{workspace.name}</span>
                <span className={"text-md text-zinc-300 mt-1.5"}>
                {workspace.address}, {workspace.city}
                </span>
                <span className={"mt-auto text-sm text-zinc-300"}>
                Opens: {workspace.opening_hour} - {workspace.closing_hour}
                </span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FavoriteWorkspaces;
