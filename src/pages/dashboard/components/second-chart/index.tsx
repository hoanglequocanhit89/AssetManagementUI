import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';

const SecondChart = () => {
    const options = {
        chart: { type: 'areaspline' },
        title: { text: 'Smooth Area Sales' },
        xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr'] },
        series: [{ name: 'Sales', data: [10, 20, 15, 25] }],
        colors: ['#FF6384']
      };
    
      return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default SecondChart;