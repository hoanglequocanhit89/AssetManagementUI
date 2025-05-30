import "./style.scss";
import nashtechLogo from "../../../assets/images/nashtech-logo.png";
import DropDown from "./components/dropdown";
import authApi from "../../../api/authApi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChangePasswordProps } from "../../../types";
import ChangePasswordModal from "../../../pages/auth/change-password";
import { RootState } from "../../../store";
import { toast } from "react-toastify";
import FormModal from "../../ui/form-modal";
import Button from "../../ui/button";

interface HeaderProps {
    isLogin?: boolean,
    title: string
    subTitle?: string;
}

const Header = ({ isLogin = true, title, subTitle }: HeaderProps) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [changePasswordModal, setChangePasswordModal] = useState<boolean>(false);
    const [confirmModal, setConfirmModal] = useState<boolean>(false);
    const auth = useSelector((state: RootState) => state.auth);

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
                    </div>
                </div>
            </header>
            {
                changePasswordModal &&
                <ChangePasswordModal onClose={() => setChangePasswordModal(false)}/>
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
        </>
    )
};

export default Header;