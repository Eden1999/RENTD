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
import Axios from "axios";

const AddAsset = ({asset}) => {
    const [assetTypes, setAssetTypes] = useState([{ id: 1, name: "" }]);
    const [assetType, setAssetType] = useState({id: 1, name: "" });
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
        <div className="mb-6">
            capacity:
            <OutlinedInput
                variant="outlined"
                sx={{ color: "white" }}
                className="block shadow-sm-light bg-zinc-700 border
                            border-zinc-600 rounded-lg mb-6"
                required
                fullWidth
                name="capacity"
                placeholder="capacity"
                type="capacity"
                id="capacity"
                autoComplete="capacity"
                value={capacity}
                onChange={(event) => {
                    setCapacity(event.target.value)
                }}
            />
            cost:
            <OutlinedInput
                variant="outlined"
                sx={{ color: "white" }}
                className="block shadow-sm-light bg-zinc-700 border
                            border-zinc-600 rounded-lg mb-6"
                required
                fullWidth
                name="cost per hour"
                placeholder="how much do you take per hour?"
                type="cost per hour"
                id="cost per hour"
                autoComplete="cost per hour"
                value={cost_per_hour}
                onChange={(event) => {
                    setCost(event.target.value);
                }}
            />
            <label htmlFor="environment" className="block mb-2 text-sm font-medium text-zinc-400">
            Environment:
            </label>
            <Autocomplete
            id="asset"
            options={assetTypes}
            getOptionLabel={(option) => option.name}
            className="w-64 block shadow-sm-light bg-zinc-700 border
                                border-zinc-600 rounded-lg"
            renderInput={(params) => <TextField variant="outlined" {...params} />}
            value={assetType}
            onChange={(event, value) => {
                setAssetType(value);
            }}
            />
        </div>
    )
}

export default AddAsset;