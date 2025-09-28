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

const PaymentChart = ({ paymentSummary }: { paymentSummary: Record<string, number> }) => {
  const data = {
    labels: Object.keys(paymentSummary),
    datasets: [
      {
        label: "Payments (€)",
        data: Object.values(paymentSummary),
        backgroundColor: "#2D61D2",
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

export default PaymentChart;
