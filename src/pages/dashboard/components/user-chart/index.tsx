import * as Highcharts from 'highcharts';
import HighchartsReact from "highcharts-react-official";
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import userApi from '../../../../api/userApi';
import { User } from '../../../../types';

const UserChart = () => {
  const [userList, setUserList] = useState<User[]>();

  const fetchApi = async () => {
    await userApi.getUserList(1, { query: '', type: '' }, { page: 0, size: 999, sortBy: '', sortDir: '' })
      .then(res => setUserList(res.data.content))
      .catch(err => toast.error(err));
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const totalUsers = userList?.length || 0;
  const staffCount = userList?.filter(user => user.role === 'STAFF').length || 0;
  const adminCount = userList?.filter(user => user.role === 'ADMIN').length || 0;

  const options: Highcharts.Options = {
    chart: { height: '100%' },
    title: { text: 'User Statistics', align: 'left', style: { fontSize: '1.8rem' } },
    credits: { enabled: false },
    plotOptions: { pie: { innerSize: '50%', dataLabels: { enabled: false }, showInLegend: true } },
    series: [{
      type: 'pie',
      name: 'Total Users',
      innerSize: '50%',
      data: [
        { name: 'Staff', y: staffCount },
        { name: 'Admin', y: adminCount },
        { name: 'Total', y: totalUsers },
      ],
    }],
    colors: ['#2c3e50', '#e67e22', '#f1c40f'],
    legend: {
      enabled: true, layout: 'horizontal', align: 'center', verticalAlign: 'bottom',
      itemStyle: { fontSize: '1rem', display: 'inline-block', marginRight: '20px' },
      symbolWidth: 10, symbolHeight: 10, symbolRadius: 5,
      labelFormatter: function () {
        const point = this as Highcharts.Point;
        return `<span style="margin-right: 5px;">•</span> ${this.name} ${point.y || 0}`;
      },
    },
    tooltip: { style: { fontSize: '1.6rem' }, pointFormat: '{series.name}: <b>{point.y} {point.name}</b>' },
  };

  return (
    <div className="dashboard__card">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default UserChart;