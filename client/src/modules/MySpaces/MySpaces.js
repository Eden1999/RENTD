import React, { useState, useCallback } from "react";
import { Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import { Link } from "react-router-dom";

import WorkspacesList from "./WorkspacesList";
const MySpaces = () => {
  return (
    <Container className="h-full">
      <div className="flex h-full">
        <div className="flex flex-1 flex-col mr-10">
          <div className="flex justify-between mt-8 text-3xl text-zinc-200">
            <span>My workspaces</span>
            <Link to={"/manage/newWorkspace"}>
              <button className="btn btn-circle">
                <Add />
              </button>
            </Link>
          </div>
          <div className="flex mt-10">
            <WorkspacesList isEditable={true} />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default MySpaces;
