import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Typography, Paper, Grid } from '@mui/material';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Students = () => {
  const location = useLocation();
  const [studentData, setStudentData] = useState([]);
  const [page, setPage] = useState(0); // Pagination state (still needed for bar chart)

  useEffect(() => {
    if (location.state && location.state.studentData) {
      console.log('Student Data from Location:', location.state.studentData);
      setStudentData(Array.isArray(location.state.studentData) ? location.state.studentData : []);
    } else {
      console.warn('No student data found in location.state');
      setStudentData([]);
    }
  }, [location.state]);

  // Pagination handling (for bar chart)
  const rowsPerPage = 50;
  const totalPages = Math.ceil(studentData.length / rowsPerPage);

  const paginatedData = studentData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  // Line chart data preparation (GPA by Year - Overall, excluding N/A)
  const years = [...new Set(studentData.map((student) => student['Degree Awarded Date']))]
    .filter((year) => year && year !== 'N/A') // Filter out null/undefined and 'N/A'
    .sort();
  const overallLineChartData = {
    labels: years,
    datasets: [{
      label: 'Average GPA Over Time',
      data: years.map((year) => {
        const yearData = studentData.filter((student) => student['Degree Awarded Date'] === year);
        return yearData.length > 0
          ? yearData.reduce((sum, student) => sum + (Number(student.Score) || 0), 0) / yearData.length
          : 0;
      }),
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
    }],
  };

  const overallLineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Overall GPA Trends by Year' },
    },
    scales: {
      y: { suggestedMin: 0, suggestedMax: 4, title: { display: true, text: 'Average GPA' } },
      x: { title: { display: true, text: 'Year' } },
    },
  };

  // New Line chart data preparation (GPA by Region over Time, excluding N/A)
  const regions = [...new Set(studentData.map((student) => student.Region))]
    .filter((region) => region && region !== 'N/A') // Filter out null/undefined and 'N/A'
    .sort();
  const regionLineChartData = {
    labels: years,
    datasets: regions.map((region, index) => {
      const colors = [
        'rgba(255, 99, 132, 1)',  // Red
        'rgba(54, 162, 235, 1)',  // Blue
        'rgba(255, 206, 86, 1)',  // Yellow
        'rgba(75, 192, 192, 1)',  // Teal
        'rgba(153, 102, 255, 1)', // Purple
        'rgba(255, 159, 64, 1)',  // Orange
      ];
      return {
        label: region,
        data: years.map((year) => {
          const regionYearData = studentData.filter(
            (student) => student.Region === region && student['Degree Awarded Date'] === year
          );
          return regionYearData.length > 0
            ? regionYearData.reduce((sum, student) => sum + (Number(student.Score) || 0), 0) / regionYearData.length
            : null; // Use null for gaps
        }),
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length].replace('1)', '0.2)'),
        fill: false,
        borderWidth: 2,
        pointRadius: 3,
      };
    }),
  };

  const regionLineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'GPA Trends by Region Over Time' },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: { suggestedMin: 0, suggestedMax: 4, title: { display: true, text: 'Average GPA' } },
      x: { title: { display: true, text: 'Year' } },
    },
  };

  // Individual GPA bar chart data
  const individualChartData = {
    labels: paginatedData.map((student, index) => `${student.Region || 'Unknown'} - ${index + 1 + page * rowsPerPage}`),
    datasets: [
      {
        label: 'Student GPA',
        data: paginatedData.map((student) =>
          student.Score != null && !isNaN(student.Score) ? Number(student.Score) : 0
        ),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };

  const individualChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Individual Student GPAs (Current Page)' },
      tooltip: {
        callbacks: {
          label: function (context) {
            const student = paginatedData[context.dataIndex];
            return [
              `GPA: ${context.parsed.y.toFixed(2)}`,
              `Region: ${student.Region || 'Unknown'}`,
              `Age: ${student.Age || 'N/A'}`,
              `Sex: ${student.Sex || 'N/A'}`,
              `Department: ${student.Dept || 'N/A'}`,
              `Batch: ${student.Batch || 'N/A'}`,
              `High School Stream: ${student['High School Stream'] || 'N/A'}`,
              `12th Result: ${student['12th result'] || 'N/A'}`,
              `High School Completion Year: ${student['high school completion year'] || 'N/A'}`,
              `School Type: ${student.Stype || 'N/A'}`,
              `Nationality: ${student.Nationality || 'N/A'}`,
              `Degree Awarded Date: ${student['Degree Awarded Date'] || 'N/A'}`,
              `Status: ${student.status || 'N/A'}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        suggestedMin: 0,
        suggestedMax: 4,
        ticks: { values: [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0], callback: (value) => value.toFixed(1) },
      },
      x: { title: { display: true, text: 'Students (Region - Index)' } },
    },
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Student Details
      </Typography>
      {studentData.length > 0 ? (
        <Grid container spacing={3}>
          {/* Line Chart: Overall GPA by Year */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Overall GPA Trends by Year
            </Typography>
            <Line data={overallLineChartData} options={overallLineChartOptions} />
          </Grid>

          {/* New Line Chart: GPA by Region Over Time */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              GPA Trends by Region Over Time
            </Typography>
            <Line data={regionLineChartData} options={regionLineChartOptions} />
          </Grid>

          {/* Bar Chart */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Individual Student GPAs (Current Page)
            </Typography>
            <Bar data={individualChartData} options={individualChartOptions} />
          </Grid>
        </Grid>
      ) : (
        <Typography variant="body1">
          No student data available. Please upload a CSV file in the Dashboard and navigate here again.
        </Typography>
      )}
    </Paper>
  );
};

export default Students;