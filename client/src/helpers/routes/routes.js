import Login from "../../modules/UserManagment/Login";
import Profile from "../../modules/UserManagment/Profile";
import Register from "../../modules/UserManagment/Register";
import CreateWorkspace from "../../modules/CreateWorkspace/CreateWorkspace";
import SearchResultsView from "../../modules/SearchResults/SearchResultsView";
import WorkspacePage from "../../modules/WorkspacePage/WorkspacePage";
import HomepageView from '../../modules/Homepage/HomepageView'
import OrdersHistory from "modules/History/OrdersHistory";
import { userTypes } from "../consts";
import MySpaces from "../../modules/MySpaces/MySpaces";
import ResetPassword from "../../modules/UserManagment/ResetPassword";

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
    Component: <CreateWorkspace />,
    allowed: [userTypes.host],
  },
  {
    path: "/manage/editWorkspace",
    Component: <CreateWorkspace />,
    allowed: [userTypes.host],
  },
  {
    path: "/search",
    Component: <SearchResultsView />,
    allowed: [userTypes.notSigned, userTypes.guest],
  },
  {
    path: "/workspaces/:id",
    Component: <WorkspacePage />,
    allowed: [userTypes.guest, userTypes.host],
  },
  {
    path: "/history",
    Component: <OrdersHistory />,
    allowed: [userTypes.guest],
  },
];

export default routes;
