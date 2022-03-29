import {TextField, Autocomplete, InputAdornment, OutlinedInput} from "@mui/material";
import {LocationOn} from "@mui/icons-material";
import {useEffect, useState} from "react";
import Axios from "axios";
import {Link} from "react-router-dom";

function WorkspaceForm() {
    const [spaceTypes, setSpaceTypes] = useState([{id:1,name:''}]);
    const [city, setCity] = useState('');
    const [capacity, setCapacity] = useState();
    const [spaceType, setSpaceType] = useState({});

    // Get space types from the server to the environment selector
    useEffect(async () => {
        try {
            const query = {};
            const res = await Axios.get("http://localhost:8000/spacetypes", query);
            setSpaceTypes(res.data);
            setSpaceType(res.data[0]);
        } catch (err) {
            console.log(`Failed to fetch spaceTypes ${err.message}`);
        }
    }, []);

    return (
        <form autoComplete='off'>
            <div className="mb-6">
                <label htmlFor="location"
                       className="block mb-2 text-sm font-medium text-zinc-400">
                    Search for workspace at:
                </label>
                <OutlinedInput
                    id="location"
                    fullWidth
                    sx={{color:'white'}}
                    className="block shadow-sm-light bg-zinc-700 border
                               border-zinc-600 rounded-lg"
                    startAdornment={
                    <InputAdornment position="start" sx={{color:'white'}}>
                        <LocationOn />
                    </InputAdornment>
                   }
                   placeholder="Tel Aviv"
                   onChange={(event) => setCity(event.target.value)}/>
            </div>
            <div className="mb-6">
                <label htmlFor="environment"
                       className="block mb-2 text-sm font-medium text-zinc-400">
                    Environment:
                </label>
                <Autocomplete
                    id="environment"
                    options={spaceTypes}
                    getOptionLabel={option => option.name}
                    className="block shadow-sm-light bg-zinc-700 border
                               border-zinc-600 rounded-lg"
                    renderInput={(params =>
                            <TextField
                                variant="outlined"
                                {...params} />
                    )}
                    onChange={(event, value) => setSpaceType(value)}
                />
            </div>
            <div className="mb-6">
                <label htmlFor="capacity"
                       className="block mb-2 text-sm font-medium text-zinc-400">
                    Number of people:
                </label>
                <OutlinedInput
                    id="capacity"
                    fullWidth
                    sx={{color:'white'}}
                    className="block shadow-sm-light bg-zinc-700 border
                               border-zinc-600 rounded-lg"
                    placeholder="1"
                    onChange={(event) => setCapacity(event.target.value)} />
            </div>
            <Link to={'/search'} state={{city, capacity, space_type_id:spaceType.id}}>
                <button type="submit"
                        className="text-white 2xl:text-lg text-sm bg-blue-600 hover:bg-blue-700 focus:ring-4
                          focus:outline-none focus:ring-blue-800 font-medium rounded-lg
                          px-5 py-2.5 text-center">
                    Search
                </button>
            </Link>
        </form>
    );
}

export default WorkspaceForm;