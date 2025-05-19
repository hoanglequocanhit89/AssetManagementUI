import "./style.scss";
import nashtechLogo from "../../../assets/images/nashtech-logo.png";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const navItems = [
    {
        title: 'Home',
        tag: 'home'
    },
    {
        title: 'Manage User',
        tag: 'manage-user'
    },
    {
        title: 'Manage Asset',
        tag: 'manage-asset'
    },
    {
        title: 'Manage Assignment',
        tag: 'manage-assignment'
    },
    {
        title: 'Request for Returning',
        tag: 'request-return'
    },
    {
        title: 'Report',
        tag: 'report'
    }
];

interface SidebarProps {
    setTitle: (x: string) => void
}


const Sidebar = (props: SidebarProps) => {

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if(!searchParams.get('tag')) {
            setSearchParams({'tag': 'home'});
        };
    }, []);


    const handleChangeTag = (tag: string, title: string) => {
        setSearchParams({'tag': tag});
        props.setTitle(title);
    };

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
                                    onClick={() => handleChangeTag(item.tag, item.title)} 
                                    className={`sidebar-nav__item ${searchParams.get('tag') === item.tag ? 'active' : ''}`}
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