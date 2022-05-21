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
  import "./CreateWorkspace.scss";
  import Axios from "axios";

const AddAsset = ({asset, handleChange, index, handleDelete}) => {
    const [assetTypes, setAssetTypes] = useState([{ id: 1, name: "" }]);
    const [assetType, setAssetType] = useState({
        id: 1,
        name: 'Room'
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
          setAssetType(assetTypes.find(x => x.id.toString() === asset.asset_id))
      }, [assetTypes])

    return (
        <div className="mb-6 child inline-block-child">
            <div>
            <IconButton aria-label="new workspace">
              <DeleteIcon htmlColor="#EB586F" onClick={() => {handleDelete(index)}}/>
            </IconButton>
            </div>
            <div className="mb-6">
                <label className="label block mb-2 text-sm font-medium text-zinc-400">
                    capacity:
                </label>
                <input className="input 2xl:select-lg font-normal w-full bg-zinc-700 text-white"
                       placeholder={'capacity'}
                       value={capacity}
                       onChange={(event) => {
                           setCapacity(event.target.value)
                           asset.capacity = event.target.value
                           handleChange(asset, index)
                       }}
                />
            </div>
            <div className="mb-6">
                <label className="label block mb-2 text-sm font-medium text-zinc-400">
                    cost per hour:
                </label>
                <input className="input 2xl:select-lg font-normal w-full bg-zinc-700 text-white"
                       placeholder={'cost'}
                       value={cost_per_hour}
                       onChange={(event) => {
                           setCost(event.target.value);
                           asset.cost_per_hour = event.target.value
                           handleChange(asset, index)
                       }}
                />
            </div>
            <div className="mb-6">
                <label htmlFor="environment" className="block mb-2 text-sm font-medium text-zinc-400">
                    Environment:
                </label>
                <select
                    className="select select-bordered 2xl:select-lg font-normal w-full bg-zinc-700 text-white"
                    onChange={(event, value) => {
                        setAssetType(value);
                        asset.asset_id = value.id
                        asset.text = value.name
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
        </div>
    )
}

export default AddAsset;