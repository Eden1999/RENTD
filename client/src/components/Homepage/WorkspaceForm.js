import {TextField, Autocomplete, InputAdornment, OutlinedInput} from "@mui/material";
import {LocationOn} from "@mui/icons-material";

function WorkspaceForm() {
    const options = ['Coffee Shop', 'Restaurant', 'Office', 'Bar'];

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
                   placeholder="Tel Aviv" />
            </div>
            <div className="mb-6">
                <label htmlFor="environment"
                       className="block mb-2 text-sm font-medium text-zinc-400">
                    Environment:
                </label>
                <Autocomplete
                    renderInput={(params =>
                        <TextField
                            variant="outlined"
                            {...params} />
                    )}
                    options={options}
                    className="block shadow-sm-light bg-zinc-700 border
                               border-zinc-600 rounded-lg"
                    id="location" />
            </div>
            <div className="mb-6">
                <label htmlFor="numOfPpl"
                       className="block mb-2 text-sm font-medium text-zinc-400">
                    Number of people:
                </label>
                <OutlinedInput
                    id="numOfPpl"
                    fullWidth
                    sx={{color:'white'}}
                    className="block shadow-sm-light bg-zinc-700 border
                               border-zinc-600 rounded-lg"
                    placeholder="1" />
            </div>
            <button type="submit"
                    className="text-white 2xl:text-lg text-sm bg-blue-600 hover:bg-blue-700 focus:ring-4
                      focus:outline-none focus:ring-blue-800 font-medium rounded-lg
                      px-5 py-2.5 text-center">
                Search
            </button>
        </form>
    );
}

export default WorkspaceForm;