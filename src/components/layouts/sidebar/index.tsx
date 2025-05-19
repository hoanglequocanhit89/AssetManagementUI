import nashtechLogo from "../../../assets/images/nashtech-logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.scss";

const navItems = [
    {
        title: 'Home',
        tag: 'home',
    },
    {
        title: 'Manage User',
        tag: 'manage-user',
    },
    {
        title: 'Manage Asset',
        tag: 'manage-asset',
    },
    {
        title: 'Manage Assignment',
        tag: 'manage-assignment',
    },
    {
        title: 'Request for Returning',
        tag: 'request-return',
    },
    {
        title: 'Report',
        tag: 'report',
    }
];

interface SidebarProps {
    setTitle: (x: string) => void
}


const Sidebar = (props: SidebarProps) => {

    const location = useLocation();
    const navigate = useNavigate();
    const { setTitle } = props;

    return (
        <aside className="sidebar">
            <div className="sidebar__inner">
                <div className="sidebar__img--wrapper">
                    <img src={nashtechLogo} alt="Nashtech." className="sidebar__img" />
                </div>
                <h1 className="sidebar__title">Online Asset Management</h1>
                <article className="sidebar-nav">
                    <ul className="sidebar-nav__list">
                        {
                            navItems?.map((item, idx) => (
                                <li key={idx}
                                    onClick={() => {
                                        setTitle(item.title);
                                        navigate(item.tag);
                                    }}
                                    className={`sidebar-nav__item ${location.pathname === `/${item.tag}` ? 'active' : ''}`}
                                >
                                    {item.title}
                                </li>
                            ))
                        }
                    </ul>
                </article>
            </div>
        </aside>
    )
};

export default Sidebar;