import * as Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { useEffect, useRef, useState } from 'react';
import { Report } from '../../../../types';
import reportApi from '../../../../api/reportApi';
import { SpinnerLoadingSmall } from '../../../../components/ui/loading-small/SpinnerLoading';

const seriesList = [
    { name: 'Assigned', key: 'assigned' },
    { name: 'Available', key: 'available' },
    { name: 'Not available', key: 'notAvailable' },
    { name: 'Waiting for recycling', key: 'waiting' },
    { name: 'Recycled', key: 'recycled' },
];

const BarChart = (props: HighchartsReact.Props) => {
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
    const [chartData, setChartData] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const options: Highcharts.Options = {
        chart: {
            type: 'column',
            style: { fontSize: '2rem' },
            scrollablePlotArea: {
                // minWidth: 700,
                // scrollPositionX: 0
            }
        },
        responsive: {
            rules: [{
                condition: {
                    maxHeight: 400,
                },
                chartOptions: {
                    chart: {
                        height: 300
                    }
                }
            }]
        },
        xAxis: {
            categories: chartData.map((item) => item.category)
        },
        yAxis: {
            min: 0,
            title: { text: 'Total' }
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        title: {
            text: 'Asset Statistics',
            align: 'left',
            style: { fontSize: '1.8rem' }
        },
        credits: { enabled: false },
        series: seriesList.map(series => ({
            name: series.name,
            type: 'column',
            data: chartData.map(item => item[series.key as keyof Report] as number)
        }))
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await reportApi.getReportList()
                setChartData(response.data)
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            {isLoading ?
                <div className="flex justify-center items-center min-h-[300px]">
                    <SpinnerLoadingSmall />
                </div>
                :
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                    ref={chartComponentRef}
                    {...props}
                />
            }
        </>
    )
}

export default BarChart