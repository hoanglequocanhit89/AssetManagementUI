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
  }

  useEffect(() => {
    fetchApi();
  }, [])

  const options: Highcharts.Options = {
      title: {
        text: '',
        style: { fontSize: '1.6rem' }
      },
      credits: { enabled: false },
      series: [{
          type: 'pie',
          innerSize: '20%',
          name: 'Total',
          data: assetList
          ? assetList.map(category => ({
              name: category.category,
              y: category.total
            }))
          : [],
          dataLabels: {
              enabled: true,
              style: {
                  fontSize: '1.2rem',
              },
              filter: {
                property: 'y',
                operator: '>',
                value: 0
              }
          }
        }],
      tooltip: {
        style: {
          fontSize: '1.6rem'
        }
      }
  };

  return (
      <HighchartsReact
          highcharts={Highcharts}
          options={options}
      />
  )
};

export default AssetChart;