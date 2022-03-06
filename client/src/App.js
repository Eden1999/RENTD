import './App.css';
import { AxiosInstance } from './helpers/axios';
import ShellView from "./modules/shell/components/ShellView";

// const healthCheck = async () => {
//   let res = await AxiosInstance.get(process.env.REACT_APP_SERVER_URL + `health`);
//   alert(res.data)
// }

function App() {
  return (
    <div className="App">
      <ShellView />
    </div>
  );
}

export default App;
