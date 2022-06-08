import { Add } from "@mui/icons-material";
import React from "react";
import AddAsset from "./AddAsset";

const AddAssets = ({ workspace, handleChangeAsset, handleDeleteAsset, onAddAssetClick }) => {
  return (
    <div className="flex flex-row text-center flex-wrap">
      {workspace.assets &&
        workspace.assets.map((curAsset, index) => {
          console.log(curAsset)
          return (
            <AddAsset
              key={curAsset.id}
              asset={curAsset}
              handleChange={handleChangeAsset}
              index={index}
              handleDelete={handleDeleteAsset}
            />
          );
        })}
      <div className="flex items-center">
        <button className="btn btn-circle" onClick={onAddAssetClick}>
          <Add />
        </button>
      </div>
    </div>
  );
};

export default AddAssets;
