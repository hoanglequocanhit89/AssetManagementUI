import * as Highcharts from 'highcharts';
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import assignmentApi from '../../../../api/assignmentApi';
import { Assignment } from '../../../../types/assignment';

const AssignmentChart = () => {

  const [assignmentList, setAssignmentList] = useState<Assignment[]>();

  const fetchApi = async () => {
    await assignmentApi.getAssignmentList({ page: 0, size: 999 })
      .then(res => setAssignmentList(res.data.content))
      .catch(err => toast.error(err));
  }

  console.log(assignmentList);
  

  useEffect(() => {
    fetchApi();
  } , []);

  const waitingCount = assignmentList?.filter(assignment => assignment.status === 'WAITING').length || 0;
  const acceptedCount = assignmentList?.filter(assignment => assignment.status === 'ACCEPTED').length || 0;
  const declinedCount = assignmentList?.filter(assignment => assignment.status === 'DECLINED').length || 0;

  const options: Highcharts.Options = {
    chart: { height: '100%' },
    title: { text: 'Assignment Statistics', align: 'left', style: { fontSize: '1.8rem' } },
    credits: { enabled: false },
    plotOptions: { pie: { innerSize: '50%', dataLabels: { enabled: false }, showInLegend: true } },
    series: [{
      type: 'pie',
      name: 'Total Assignments',
      innerSize: '50%',
      data: [
        { name: 'Waiting for Acceptance', y: waitingCount },
        { name: 'Accepted', y: acceptedCount },
        { name: 'Declined', y: declinedCount },
      ],
    }],
    colors: ['#2c3e50', '#f1c40f', '#e67e22'], // Blue, Yellow, Orange
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
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  );
};

export default AssignmentChart;