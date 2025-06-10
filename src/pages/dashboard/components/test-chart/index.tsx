import * as Highcharts from 'highcharts';
import HighchartsReact from "highcharts-react-official";

const TestChart = () => {
    const options: Highcharts.Options = {
        chart: {
          height: '100%',
        },
        title: {
          text: 'User Statistics',
          style: { fontSize: '1.8rem' },
        },
        credits: { enabled: false },
        plotOptions: {
          pie: {
            innerSize: '50%', // Donut chart
            dataLabels: {
              enabled: false, // Disable data labels on slices
            },
            showInLegend: true, // Ensure data points are shown in legend
          },
        },
        series: [{
          type: 'pie',
          name: 'Total Users',
          innerSize: '50%',
          data: [
                { name: 'Active', y: 500 },
                { name: 'Inactive', y: 200 },
                { name: 'New', y: 100 },
              ], // Fallback data
        }],
        colors: ['#2c3e50', '#f1c40f', '#e67e22'], // Blue, Yellow, Orange
        legend: {
          enabled: true,
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom',
          itemStyle: {
            fontSize: '1rem',
            display: 'inline-block',
            marginRight: '20px',
          },
          symbolWidth: 10,
          symbolHeight: 10,
          symbolRadius: 5, // Circular markers
          labelFormatter: function () {
            const point = this as Highcharts.Point;
            return `<span style="margin-right: 5px;">•</span> ${this.name} ${point.y || 0}`;
          },
        },
        tooltip: {
          style: {
            fontSize: '1.6rem',
          },
          pointFormat: '{series.name}: <b>Total: {point.y} {point.name}</b>',
        },
      };
    
      return (
        <div style={{ height: '100%', width: '100%' }}>
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            containerProps={{ style: { height: '100%', width: '100%' } }}
          />
        </div>
      );
};

export default TestChart;