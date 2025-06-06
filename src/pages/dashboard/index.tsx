import ContentWrapper from "../../components/ui/content-wrapper"
import BarChart from "./bar-chart";
import "./style.scss";

const Dashboard = () => {
    return (
        <>
            <ContentWrapper title={"Dashboard"} >
                <div className="dashboard">
                    <div className="dashboard__inner">
                        <div className="dashboard__top">
                            <div className="row row-cols-2">
                                <div className="col">1</div>
                                <div className="col">2</div>
                            </div>
                        </div>
                        <div className="dashboard__bottom">
                            <BarChart />
                        </div>
                    </div>
                </div>
            </ContentWrapper>
        </>
    )
};

export default Dashboard;