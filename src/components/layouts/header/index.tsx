import "./style.scss";
import nashtechLogo from "../../../assets/images/nashtech-logo.png";
import DropDown from "../../ui/dropdown";

interface HeaderProps {
    isLogin?: boolean,
    title?: string
}

const Header = ({ isLogin = true, title = 'Home' }: HeaderProps) => {
    return (
        <header className="header">
            <div className="container">
                <div className="header__inner d-flex justify-between items-center px-20">
                    {!isLogin ? (
                        <div className="d-flex align-center">
                            <img src={nashtechLogo} alt="Nashtech" className="header__logo" />
                            <h1 className="header__heading">Online Asset Management</h1>
                        </div>
                    ) : (<h1 className="text-white font-bold px-8">{title}</h1>)}
                    {isLogin && <DropDown username="test" />}
                </div>
            </div>
        </header>
    )
};

export default Header;