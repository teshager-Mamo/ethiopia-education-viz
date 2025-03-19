import React, { forwardRef, useImperativeHandle } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PerformanceChart = forwardRef(({ data }, ref) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Student Performance',
        data: data.values,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const isGpaScale = data.maxValue <= 4; // If max value is 4 or less, assume GPA
  const maxY = isGpaScale ? 4 : Math.ceil(data.maxValue * 1.1); // 4 for GPA, 10% above max otherwise

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Student Performance by Region' },
    },
    scales: {
      y: {
        suggestedMin: isGpaScale ? 0 : undefined, // Suggest minimum 0 for GPA
        suggestedMax: isGpaScale ? 4 : undefined, // Suggest maximum 4 for GPA
        ticks: {
          ...(isGpaScale
            ? {
                values: [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0], // Explicit GPA ticks
                callback: function(value) {
                  return value.toFixed(1); // Show as 0.0, 0.5, 1.0, etc.
                },
                autoSkip: false, // Force all ticks to show
              }
            : {
                stepSize: 5, // Default step for larger ranges
              }),
          autoSkip: false, // Ensure no skipping of ticks
        },
      },
    },
  };

  const chartRef = React.useRef(null);

  useImperativeHandle(ref, () => ({
    chartInstance: chartRef.current,
  }));

  return <Bar ref={chartRef} data={chartData} options={options} />;
});

export default PerformanceChart;