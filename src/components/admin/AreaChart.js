import React from "react";
import ReactApexChart from "react-apexcharts";

const AreaChart = () => {
  const series = [
    {
      name: "Total Members",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "Members In House",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
  ];
  const options = {
    chart: {
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "date",
      categories: [
        "2018-09-19T00:00:00.000Z",
        "2018-09-19T01:30:00.000Z",
        "2018-09-19T02:30:00.000Z",
        "2018-09-19T03:30:00.000Z",
        "2018-09-19T04:30:00.000Z",
        "2018-09-19T05:30:00.000Z",
        "2018-09-19T06:30:00.000Z",
      ],
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  };
  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
};

export default AreaChart;
