import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const GrievanceStatusChart = ({ counts }) => {
  return (
    <Pie
      data={{
        labels: ["Pending", "In Progress", "Resolved"],
        datasets: [
          {
            data: counts,
            backgroundColor: ["#facc15", "#38bdf8", "#22c55e"]
          }
        ]
      }}
    />
  );
};

export default GrievanceStatusChart;
