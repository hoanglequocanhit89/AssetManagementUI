import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import reportApi from '../../../../api/reportApi';
import { Report } from '../../../../types';

const AssetChart = () => {

  const [assetList, setAssetList] = useState<Report[]>();

  const fetchApi = async () => {
    reportApi.getReportList()
      .then(res => setAssetList(res.data))
      .catch(err => toast.error(err))
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const options: Highcharts.Options = {
    chart: {
      height: '100%',
      style: { fontSize: '2rem' },
    },
    title: {
      text: 'Assets Statistics by Category',
      align: 'left',
      style: { fontSize: '1.8rem' },
    },
    credits: { enabled: false },
    series: [{
      type: 'pie',
      name: 'Total',
      innerSize: '80%',
      dataLabels: {
        enabled: false
      },
      showInLegend: true,
      data: assetList
        ? assetList.map(category => ({
          name: category.category,
          y: category.total || 0
        }))
        : [],
    }],
    legend: {
      enabled: true,
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: {
        fontSize: '1.4rem',
        display: 'inline-block',
        marginRight: '20px',
      },
      symbolWidth: 10,
      symbolHeight: 10,
      symbolRadius: 5, // Circular markers
      labelFormatter: function () {
        const point = this as Highcharts.Point;
        return `<span style="margin-right: 5px;">•</span> ${this.name} ${point.y}`;
      },
    },
    tooltip: {
      style: {
        fontSize: '1.6rem',
      },
      pointFormat: '{series.name}: <b>{point.y}</b>', // Match tooltip format from image
    },
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      containerProps={{ style: { height: '100%', width: '100%' } }}
    />
  )
};

export default AssetChart;