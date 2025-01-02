import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ openCount, submitCount }) {
  const data = {
    labels: ["Opened", "Completed"],
    datasets: [
      {
        label: "Form Interaction",
        data: [openCount, submitCount],
        backgroundColor: ["#909090", "#3B82F6"],
        hoverBackgroundColor: ["#909090", "#3B82F6"],
      },
    ],
  };

  return <Pie data={data} />;
}

export default PieChart;
