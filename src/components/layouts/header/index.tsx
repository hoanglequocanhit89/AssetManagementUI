import "./style.scss";
import nashtechLogo from "../../../assets/images/nashtech-logo.png";
import DropDown from "./components/dropdown";
import authApi from "../../../api/authApi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ChangePasswordProps } from "../../../types";
import ChangePasswordModal from "../../../pages/auth/change-password";
import { RootState } from "../../../store";
import { toast } from "react-toastify";
import FormModal from "../../ui/form-modal";
import Button from "../../ui/button";
import { Link } from "react-router-dom";
import { navItems } from "../sidebar";


interface HeaderProps {
    isLogin?: boolean,
    title: string
    subTitle?: string;
    setSubTitle?: (x: string) => void;
}

const Header = ({ isLogin = true, title, subTitle, setSubTitle }: HeaderProps) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [changePasswordModal, setChangePasswordModal] = useState<boolean>(false);
    const [confirmModal, setConfirmModal] = useState<boolean>(false);
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const auth = useSelector((state: RootState) => state.auth);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handlePopState = () => {
            if (changePasswordModal) {
                setChangePasswordModal(false);
            }
            if (confirmModal) {
                setConfirmModal(false);
            }
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [changePasswordModal, confirmModal]);

    const handleLogout = async () => {
        await authApi.logoutAction()
            .then(response => {
                dispatch(logout());
                navigate('/login');
            })
            .catch(err => {
                toast.error(err.response?.data?.message);
            });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMenu]);

    return (
        <>
            <header className="header">
                <div className="container">
                    <div className="header__inner d-flex justify-between items-center">
                        {!isLogin ? (
                            <div className="d-flex align-center">
                                <img src={nashtechLogo} alt="Nashtech" className="header__logo" />
                                <h1 className="header__heading">Online Asset Management</h1>
                            </div>
                        ) : (<h1 className="text-white font-bold text-[2rem]">
                            {title}
                            {subTitle && <> &gt; {subTitle}</>}
                        </h1>)}
                        {isLogin &&
                            <DropDown
                                onChangePassword={() => setChangePasswordModal(true)}
                                onLogout={() => setConfirmModal(true)}
                                username={auth.username || ''}
                            />}

                        {isLogin && (
                            <div className="d-lg-block d-none ">
                                <button
                                    className="text-white"
                                    onClick={() => {
                                        console.log(showMenu);
                                        setShowMenu(!showMenu);
                                    }}
                                >
                                    <i className="fa-solid fa-bars"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            {
                changePasswordModal &&
                <ChangePasswordModal onClose={() => setChangePasswordModal(false)} />
            }
            {
                confirmModal &&
                <FormModal title="Are you sure ?" closeModal={() => setConfirmModal(false)} >
                    <div className="form--text">Do you want to logout ?</div>
                    <div className="form--action">
                        <Button color="primary" text="Log out" onClick={handleLogout} />
                        <Button color="outline" text="Cancel" onClick={() => setConfirmModal(false)} />
                    </div>
                </FormModal>
            }

            {/* Overlay + Animated Menu */}
            <div className={`d-lg-block d-none fixed inset-0 z-[30] ${showMenu ? '' : 'pointer-events-none'}`}>
                {/* Overlay background */}
                <div
                    onClick={() => setShowMenu(false)}
                    className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${showMenu ? 'opacity-100' : 'opacity-0'
                        }`}
                ></div>

                {/* Side menu */}
                <div
                    ref={menuRef}
                    className={`absolute top-0 bottom-0 right-0 w-[30%] bg-white shadow-xl shadow-blue-gray-900/5 px-4 py-6 flex flex-col transform transition-transform duration-300 ${showMenu ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-10 border-b pb-4">
                        <div className="text-gray-700 font-bold">Hi, {auth.username}</div>
                        <button
                            onClick={() => setShowMenu(false)}
                            className="text-gray-500 hover:text-red-500 text-xl font-bold"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    {/* Menu items */}
                    <ul className="flex flex-col gap-3">
                        {navItems.map((tab) => (
                            <li key={tab.tag}>
                                <Link
                                    to={tab.tag}
                                    onClick={() => setShowMenu(false)}
                                    className="block py-2 rounded-md text-gray-800 hover:bg-gray-100 hover:text-blue-600 transition-all"
                                >
                                    {tab.title}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Bottom actions */}
                    <div className="flex flex-col gap-2 border-t pt-4 mt-auto">
                        <button
                            onClick={() => {
                                setShowMenu(false);
                                setChangePasswordModal(true);
                            }}
                            className="text-left hover:underline"
                        >
                            Change Password
                        </button>
                        <button
                            onClick={() => {
                                setShowMenu(false);
                                setConfirmModal(true);
                            }}
                            className="text-red-500 text-left hover:underline"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>



        </>
    )
};

export default Header;