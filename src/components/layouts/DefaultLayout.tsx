import { Outlet, useLocation } from "react-router-dom";
import Header from "./header";
import Sidebar from "./sidebar";
import { useEffect, useState } from "react";

const pathItems = [
  {
    title: "Create new user",
    path: "/manage-user/create",
  },
  {
    title: "Edit User",
    path: "/manage-user/edit/",
  },
  {
    title: "Create new asset",
    path: "manage-asset/create",
  },
  {
    title: "Edit asset",
    path: "manage-asset/edit/",
  },
  {
    title: "Create new assignment",
    path: "manage-assignment/create",
  },
  {
    title: "Edit assignment",
    path: "manage-assignment/edit",
  },
];

const DefaultLayout = () => {
  const [title, setTitle] = useState("Home");
  const [subTitle, setSubTitle] = useState("");

  const location = useLocation();

  useEffect(() => {
    const result = pathItems.find(item => location.pathname.includes(item.path))
    setSubTitle(result?.title ?? "")
  }, [location.pathname]);

  return (
    <>
      <Header title={title} subTitle={subTitle} />
      <div className="container full-screen">
        <div className="row py-[60px] h-full">
          <div className="col col-xl-3 col-xxl-3 col-3 d-lg-none d-md-none h-full">
            <Sidebar setTitle={setTitle} />
          </div>
          <div className="col col-md-12 col-lg-12 col-9 col-xl-9 col-xxl-9 h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
};

export default DefaultLayout;