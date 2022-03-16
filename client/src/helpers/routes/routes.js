import Login from "../../components/UserManagment/Login";
import Register from "../../components/UserManagment/Register";
import NewWorkspace from "../../components/WorkspaceManagment/NewWorkspace";
import { userTypes } from "../consts";


const routes = [
  {
    path: "/login",
    Component: <Login/>,
    allowed: userTypes.notSigned
  },
  {
    path: "/guestHome",
    Component: <div>guestHome</div>,
    allowed: userTypes.guest
  },
  {
    path: "/hostHome",
    Component: <div>hostHome</div>,
    allowed: userTypes.host
  },
  {
    path: "/manage/newWorkspace",
    Component: <NewWorkspace/>,
    allowed: userTypes.host
  }
];

export default routes;
