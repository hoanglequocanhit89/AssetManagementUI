import ContentWrapper from "../../components/ui/content-wrapper"
import BarChart from "./bar-chart";
import AssetChart from "./components/asset-chart";
import SecondChart from "./components/second-chart";
import "./style.scss";

const Dashboard = () => {
    return (
        <>
            <ContentWrapper title={"Dashboard"} >
                <div className="dashboard">
                    <div className="dashboard__inner">
                        <div className="dashboard__top row row-cols-2">
                            <div className="col">
                            </div>
                            <div className="col">
                                <AssetChart />
                                {/* <SecondChart /> */}
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