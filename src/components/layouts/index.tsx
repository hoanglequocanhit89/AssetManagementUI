import { Outlet } from "react-router-dom";
import Header from "./header";
import Sidebar from "./sidebar";
import { useState } from "react";

const DefaultLayout = () => {
    const [title, setTitle] = useState("Home");
    return (
        <>
            <Header title={title} />
            <div className="container">
                <div className="content-wrapper">
                    <div className="row row-cols-2">
                        <div className="col col-3">
                            <Sidebar setTitle={setTitle}/>
                        </div>
                        <div className="col col-9">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default DefaultLayout;