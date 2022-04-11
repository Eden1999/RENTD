import {LocationOn} from "@mui/icons-material";
import {useEffect, useState} from "react";
import Axios from "axios";
import {Link} from "react-router-dom";
import NumberInput from "../../helpers/sharedComponents/NumberInput";

function WorkspaceForm() {
    const [spaceTypes, setSpaceTypes] = useState([]);
    const [city, setCity] = useState('');
    const [capacity, setCapacity] = useState();
    const [spaceType, setSpaceType] = useState({});

    const [handleChange] = useState(() => {
        return () => {
            setSpaceType(spaceType);
        };
    });

    // Get space types from the server to the environment selector
    useEffect(async () => {
        try {
            const query = {};
            const res = await Axios.get("http://localhost:8000/spacetypes", query);
            setSpaceTypes(res.data);
            setSpaceType(res.data[0]);
            console.log(spaceTypes);
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
                <div className="relative">
                    <LocationOn className="absolute top-1/2 transform -translate-y-1/2 left-4 text-white" />
                    <input id="location"
                           type="text"
                           placeholder="Tel Aviv"
                           required
                           className="input input-bordered input-lg w-full bg-zinc-700 pl-11 text-white"
                           onChange={(event) => setCity(event.target.value)}/>
                </div>
            </div>
            <div className="mb-6">
                <label htmlFor="environment"
                       className="block mb-2 text-sm font-medium text-zinc-400">
                    Environment:
                </label>
                <select className="select select-bordered select-lg font-normal w-full bg-zinc-700 text-white"
                        onChange={(event) => setSpaceType(spaceTypes[event.target.value])}>
                    {spaceTypes.map((item, index) =>
                        <option value={index} key={item.id}>{item.name}</option>
                    )}
                </select>
            </div>
            <div className="flex justify-between items-end mb-6">
                <div className="w-1/2">
                    <label htmlFor="capacity"
                           className="block mb-2 text-sm font-medium text-zinc-400">
                        Number of people:
                    </label>
                    <NumberInput id="capacity" />
                </div>
                <div>
                    <Link to={'/search'} state={{city, capacity, space_type_id:spaceType.id}}>
                        <button className="btn btn-lg bg-blue-600 hover:bg-blue-500 hover:cursor-pointer">
                            Search
                        </button>
                    </Link>
                </div>
            </div>
        </form>
    );
}

export default WorkspaceForm;