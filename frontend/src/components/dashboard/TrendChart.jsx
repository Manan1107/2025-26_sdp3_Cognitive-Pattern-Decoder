// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement
// } from "chart.js";

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

// export default function TrendChart() {
//   const data = {
//     labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
//     datasets: [
//       {
//         label: "Typing Speed",
//         data: [40, 50, 55, 60, 58],
//         borderColor: "#2563eb",
//       },
//     ],
//   };

//   return (
//     <div className="bg-cardBg p-4 rounded-xl">
//       <Line data={data} />
//     </div>
//   );
// }
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function LineChart({ dataPoints }) {
  const data = {
    labels: dataPoints.map((_, i) => i + 1),
    datasets: [
      {
        label: "Typing Speed",
        data: dataPoints,
        borderColor: "#3b82f6"
      }
    ]
  };

  return <Line data={data} />;
}