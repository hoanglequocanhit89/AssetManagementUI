import "./style.scss";
import nashtechLogo from "../../../assets/images/nashtech-logo.png";

const Header = () => {
    return (
        <header className="header">
            <div className="container">
                <div className="header__inner d-flex align-center">
                    <img src={nashtechLogo} alt="Nashtech" className="header__logo" />
                    <h1 className="header__heading">Online Asset Management</h1>
                </div>
                {/* <div className="header__inner d-flex align-center justify-between">
                    <div className="header__title">Header</div>
                    <div className="header__title">Profile</div>
                </div> */}
            </div>
        </header>
    )
};

export default Header;