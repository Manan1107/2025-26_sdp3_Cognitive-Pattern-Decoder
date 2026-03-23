import {
  Radar
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function RadarChartComponent({ session }) {

  const data = {
    labels: [
      "Typing Speed",
      "Backspaces",
      "Pause Time",
      "File Switch",
      "Cursor Move"
    ],
    datasets: [
      {
        label: "Cognitive Profile",
        data: [
          session.typingSpeed,
          session.backspaceCount,
          session.avgPauseTime,
          session.fileSwitchCount,
          session.cursorMoveCount
        ],
        backgroundColor: "rgba(59,130,246,0.3)",
        borderColor: "#3b82f6"
      }
    ]
  };

  return <Radar data={data} />;
}