import Login from "../../components/UserManagment/Login";
import Profile from "../../components/UserManagment/Profile";
import Register from "../../components/UserManagment/Register";
import NewWorkspace from "../../components/WorkspaceManagment/NewWorkspace";
import WorkspacesView from "../../components/WorkspaceManagment/WorkspacesView";
import WorkspaceDetails from "../../components/WorkspaceManagment/WorkspaceDetails";
import HomepageView from '../../components/Homepage/HomepageView'
import { userTypes } from "../consts";
import MySpaces from "../../components/Host/MySpaces";

const routes = [
  {
    path: "/login",
    Component: <Login />,
    allowed: [userTypes.notSigned],
  },
  {
    path: "/guestHome",
    Component: <HomepageView />,
    allowed: [userTypes.guest, userTypes.notSigned],
  },
  {
    path: "/profile",
    Component: <Profile />,
    allowed: [userTypes.guest, userTypes.host],
  },
  {
    path: "/hostHome",
    Component: <div>hostHome</div>,
    allowed: [userTypes.host],
  },
  {
    path: "/my-spaces",
    Component: <MySpaces />,
    allowed: [userTypes.host],
  },
  {
    path: "/manage/newWorkspace",
    Component: <NewWorkspace />,
    allowed: [userTypes.host],
  },
  {
    path: "/search",
    Component: <WorkspacesView />,
    allowed: [userTypes.notSigned, userTypes.guest],
  },
  {
    path: "/workspaces/:id",
    Component: <WorkspaceDetails />,
    allowed: [userTypes.notSigned],
  },
];

export default routes;
