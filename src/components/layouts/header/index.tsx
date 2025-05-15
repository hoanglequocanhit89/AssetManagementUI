import "./style.scss";

const Header = () => {
    return (
        <header className="header">
            <div className="container">
                <div className="header__inner d-flex align-center justify-between">
                    <div className="">Header</div>
                    <div className="">Profile</div>
                </div>
            </div>
        </header>
    )
};

export default Header;