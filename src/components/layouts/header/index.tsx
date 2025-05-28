import "./style.scss";
import nashtechLogo from "../../../assets/images/nashtech-logo.png";
import DropDown from "./components/dropdown";
import authApi from "../../../api/authApi";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChangePasswordProps } from "../../../types";
import ChangePasswordModal from "../../../pages/auth/change-password";

interface HeaderProps {
    isLogin?: boolean,
    title: string
    subTitle?: string;
}

const Header = ({ isLogin = true, title, subTitle }: HeaderProps) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [changePasswordData, setChangePasswordData] = useState<ChangePasswordProps>({newPassword: '', oldPassword: ''});
    const [changePasswordModal, setChangePasswordModal] = useState<boolean>(false);

    const handleLogout = async () => {
        const response = await authApi.logoutAction();
        response && dispatch(logout());
        navigate('/login');        
    };

    const handleChangePassword = async () => {
        const response = await authApi.changePasswordAction(changePasswordData);
        console.log(response);
    }

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
                        {isLogin && <DropDown onChangePassword={() => setChangePasswordModal(true)} username="test" onLogout={handleLogout}/>}
                    </div>
                </div>
            </header>
            {
                changePasswordModal &&
                <ChangePasswordModal onClose={() => setChangePasswordModal(false)}/>
            }
        </>
    )
};

export default Header;