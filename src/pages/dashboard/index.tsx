import ContentWrapper from "../../components/ui/content-wrapper"
import BarChart from "./components/bar-chart";
import AssetChart from "./components/asset-chart";
import "./style.scss";
import UserChart from "./components/user-chart";
import AssignmentChart from "./components/assignment-chart";

const Dashboard = () => {
    return (
        <>
            <ContentWrapper title={"Dashboard"} >
                <div className="dashboard">
                    <div className="dashboard__inner">
                        <div className="dashboard__top row row-cols-3 row-cols-xl-1">
                            <div className="col">
                                <div className="chart-wrapper">
                                    <AssetChart />
                                </div>
                            </div>
                            <div className="col">
                                <div className="chart-wrapper">
                                    <UserChart />
                                </div>
                            </div>
                            <div className="col">
                                <div className="chart-wrapper">
                                    <AssignmentChart />
                                </div>
                            </div>
                        </div>
                        <div className="dashboard__bottom">
                            <div className="chart-wrapper">
                                <BarChart />
                            </div>
                        </div>
                    </div>
                </div>
            </ContentWrapper>
        </>
    )
};

export default Dashboard; 