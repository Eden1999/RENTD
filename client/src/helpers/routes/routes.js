import Login from "../../components/UserManagment/Login";
import Profile from "../../components/UserManagment/Profile";
import Register from "../../components/UserManagment/Register";
import WorkspaceHandler from "../../components/WorkspaceManagment/WorkspaceHandler";
import WorkspacesView from "../../components/WorkspaceManagment/WorkspacesView";
import WorkspaceDetails from "../../components/WorkspaceManagment/WorkspaceDetails";
import HomepageView from '../../components/Homepage/HomepageView'
import OrdersHistory from "components/History/OrdersHistory";
import { userTypes } from "../consts";
import MySpaces from "../../components/Host/MySpaces";
import ResetPassword from "../../components/UserManagment/ResetPassword";

const routes = [
  {
    path: "/login",
    Component: <Login />,
    allowed: [userTypes.notSigned],
  },
  {
    path: "/register",
    Component: <Register />,
    allowed: [userTypes.notSigned],
  },
  {
    path: "/reset-password",
    Component: <ResetPassword />,
    allowed: [userTypes.notSigned, userTypes.guest, userTypes.host],
  },
  {
    path: "/homepage",
    Component: <HomepageView />,
    allowed: [userTypes.guest, userTypes.notSigned],
  },
  {
    path: "/profile",
    Component: <Profile />,
    allowed: [userTypes.guest, userTypes.host],
  },
  {
    path: "/my-spaces",
    Component: <MySpaces />,
    allowed: [userTypes.host],
  },
  {
    path: "/manage/newWorkspace",
    Component: <WorkspaceHandler />,
    allowed: [userTypes.host],
  },
  {
    path: "/manage/editWorkspace",
    Component: <WorkspaceHandler />,
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
    allowed: [userTypes.guest, userTypes.host],
  },
  {
    path: "/history",
    Component: <OrdersHistory />,
    allowed: [userTypes.guest],
  },
];

export default routes;
