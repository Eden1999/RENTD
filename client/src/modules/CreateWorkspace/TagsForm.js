import { Accessible, SmokingRooms, Wifi } from "@mui/icons-material";
import React from "react";

const TagsForm = ({
  workspace,
  handleChangeIsWifi,
  handleChangeDisabledAccess,
  HandleChangeSmokeFriendly,
}) => {
  return (
    <div>
      <div className="flex flex-row justify-center mt-20">
        <div
          className={`label cursor-pointer flex flex-column justify-center w-40 h-40 border-indigo-400
                     ${workspace.wifi ? "border-2" : "border"} rounded-lg`}
          onClick={handleChangeIsWifi}
        >
          <Wifi />
          <span className="label-text font-medium text-primary">wifi</span>
        </div>
        <div
          className={`label cursor-pointer flex flex-column justify-center w-40 h-40 border-indigo-400
                     ${
                       workspace.disabled_access ? "border-2" : "border"
                     } ml-10 rounded-lg`}
          onClick={handleChangeDisabledAccess}
        >
          <Accessible />
          <span className="label-text font-medium text-primary">
            disabled access
          </span>
        </div>
        <div
          className={`label cursor-pointer flex flex-column justify-center w-40 h-40 border-indigo-400
                     ${
                       workspace.smoke_friendly ? "border-2" : "border"
                     } ml-10 rounded-lg`}
          onClick={HandleChangeSmokeFriendly}
        >
          <SmokingRooms />
          <span className="label-text font-medium text-primary">
            smoke friendly
          </span>
        </div>
      </div>
    </div>
  );
};

export default TagsForm;
