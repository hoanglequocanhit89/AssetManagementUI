import { createBrowserRouter, RouterProvider } from "react-router";
import DefaultLayout from "../components/layouts/DefaultLayout";
import PageNotFound from "../pages/404";
import Login from "../pages/auth/login";
import Home from "../pages/home";
import ManageAsset from "../pages/manage-asset";
import ManageAssignment from "../pages/manage-assignment";
import ManageUser from "../pages/manage-user";
import Report from "../pages/report";
import RequestForReturn from "../pages/request-return";
import StaffDashboard from "../pages/staff";
import Protected from "./protected";
import CreateUpdateUser from "../pages/manage-user/create-update-user";
import CreateUpdateAsset from "../pages/manage-asset/create-update-asset";
import HeaderOnlyLayout from "../components/layouts/HeaderOnlyLayout";
import CreateUpdateAssignment from "../pages/manage-assignment/create-update-assignment";
import Dashboard from "../pages/dashboard";

const router = createBrowserRouter([
  {
    element: <HeaderOnlyLayout />,
    path: "/",
    errorElement: <Login />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    element: <DefaultLayout />,
    path: "/",
    errorElement: <Login />,
    children: [
      {
        element: <Protected />,
        children: [
          {
            path: "home",
            element: <Home />,
          },
        ],
      },
      {
        element: <Protected requiredRole="ADMIN" />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "manage-user",
            element: <ManageUser />,
          },
          {
            path: "manage-user/create",
            element: <CreateUpdateUser />,
          },
          {
            path: "manage-user/edit/:id",
            element: <CreateUpdateUser />,
          },
          {
            path: "manage-asset",
            element: <ManageAsset />,
          },
          {
            path: "manage-asset/create",
            element: <CreateUpdateAsset />,
          },
          {
            path: "manage-asset/edit/:id",
            element: <CreateUpdateAsset />,
          },
          {
            path: "manage-assignment",
            element: <ManageAssignment />,
          },
          {
            path: "manage-assignment/create",
            element: <CreateUpdateAssignment />,
          },
          {
            path: "manage-assignment/edit/:id",
            element: <CreateUpdateAssignment />,
          },
          {
            path: "request-return",
            element: <RequestForReturn />,
          },
          {
            path: "report",
            element: <Report />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

const Index = () => {
  return <RouterProvider router={router} />;
};

export default Index;
