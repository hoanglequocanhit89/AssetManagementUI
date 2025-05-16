import { Outlet } from "react-router-dom";
import Header from "./header";
import Sidebar from "./sidebar";

const DefaultLayout = () => {
    return (
        <>
            <Header />
            <div className="container">
                <div className="content-wrapper">
                    <div className="row row-cols-2">
                        <div className="col col-3">
                            <Sidebar />
                        </div>
                        <div className="col">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default DefaultLayout;