import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface TotalOrdersChartProps {
  totalOrders: Record<string, number>;
}

const OrdersChart = ({ totalOrders }: TotalOrdersChartProps) => {
  if (!totalOrders || Object.keys(totalOrders).length === 0) {
    return <div>No orders in this period</div>;
  }

  const data = {
    labels: Object.keys(totalOrders),
    datasets: [
      {
        label: "Total Orders",
        data: Object.values(totalOrders),
        backgroundColor: "#2D61D3",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return <Bar data={data} options={options} />;
};
export default OrdersChart;
