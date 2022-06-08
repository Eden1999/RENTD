import React, { useState, useCallback, useContext, useEffect } from "react";
import {
    Container,
    CssBaseline,
    Box,
    TextField,
    Button,
    Autocomplete,
    OutlinedInput,
    IconButton,
  } from "@mui/material";
  import DeleteIcon from '@mui/icons-material/Delete';
  import Axios from "axios";
import {Add} from "@mui/icons-material";

const AddAsset = ({ asset, handleChange, index, handleDelete }) => {
  const [assetTypes, setAssetTypes] = useState([{ id: 1, name: "" }]);
  const [assetType, setAssetType] = useState({
    id: 1,
    name: "Room",
  });
  const [capacity, setCapacity] = useState(asset.capacity ? asset.capacity : 0);
  const [cost_per_hour, setCost] = useState(asset.cost_per_hour ? asset.cost_per_hour : 0);

  useEffect(async () => {
    try {
      const query = {};
      const res = await Axios.get("http://localhost:8000/assetTypes", query);
      setAssetTypes(res.data);
    } catch (err) {
      console.log(`Failed to fetch spaceTypes ${err.message}`);
    }
  }, []);

  useEffect(() => {
    setAssetType(assetTypes.find((x) => x.id.toString() === asset.asset_id));
  }, [assetTypes]);

    return (
        <div className="self-center m-8 border border-black rounded-lg w-60">
            <div className="mb-6 pr-10 pl-10 pt-5">
                <label className="block mb-2 text-lg font-medium text-primary">
                    capacity:
                </label>
                <input className="input input-bordered 2xl:select-lg font-normal w-full text-secondary"
                       value={capacity}
                       onChange={(event) => {
                           setCapacity(event.target.value)
                           asset.capacity = event.target.value
                           handleChange(asset, index)
                       }}
                />
            </div>
            <div className="mb-6 pr-10 pl-10">
                <label className="block mb-2 text-lg font-medium text-primary">
                    cost per hour:
                </label>
                <input className="input input-bordered 2xl:select-lg font-normal w-full text-secondary"
                       value={cost_per_hour}
                       onChange={(event) => {
                           setCost(event.target.value);
                           asset.cost_per_hour = event.target.value
                           handleChange(asset, index)
                       }}
                />
            </div>
            <div className="mb-6 pr-10 pl-10">
                <label htmlFor="environment" className="block mb-2 text-lg font-medium text-primary">
                    Environment:
                </label>
                <select
                    className="select select-bordered 2xl:select-lg font-normal w-full text-secondary"
                    onChange={(event, value) => {
                        let index = event.target.value
                        let newAssetType = assetTypes[index]
                        setAssetType(newAssetType);
                        asset.asset_id = newAssetType.id
                        asset.text = newAssetType.name
                        handleChange(asset, index)
                    }}
                >
                    {assetTypes.map((item, index) => (
                        <option value={index} key={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-6 pr-10 pl-10">
                <button className="btn btn-circle" onClick={() => {handleDelete(index)}}>
                    <DeleteIcon />
                </button>
            </div>
        </div>
    )
}

export default AddAsset;
