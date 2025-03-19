import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DemographicsChart = ({ data }) => {
  const regions = [...new Set(data.map((student) => student.Region))];
  const regionCounts = regions.map((region) => data.filter((student) => student.Region === region).length);

  const chartData = {
    labels: regions,
    datasets: [
      {
        label: 'Students by Region',
        data: regionCounts,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 0, 212, 0.6)',
          'rgba(72, 255, 0, 0.6)',
          'rgba(255, 99, 242, 0.6)',
          'rgba(29, 32, 29, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default DemographicsChart;