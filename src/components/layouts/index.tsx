import { Outlet } from "react-router-dom";
import Header from "./header";
import Sidebar from "./sidebar";
import { useState } from "react";

const DefaultLayout = () => {
    const [title, setTitle] = useState("Home");
    return (
        <>
            <Header title={title} />
            <div className="container full-screen">
                <div className="row row-cols-2 py-[60px] h-full">
                    <div className="col col-3 h-full">
                        <Sidebar setTitle={setTitle}/>
                    </div>
                    <div className="col col-9 h-full">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
};

export default DefaultLayout;