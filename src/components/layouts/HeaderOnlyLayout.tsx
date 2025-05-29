import { Outlet } from "react-router-dom";
import Header from "./header";

const HeaderOnlyLayout = () => {
    return (
        <>
           <Header isLogin={false} title="Online Asset Management"/> 
           <div className="container">
                <Outlet />
           </div>
        </>
    )
};

export default HeaderOnlyLayout;