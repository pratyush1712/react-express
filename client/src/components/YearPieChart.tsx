import React, { useEffect, useState } from "react";
import { Container, Box } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function YearPieChart({
  years,
}: {
  years: Record<string, string[]>;
}) {
  const [series, setSeries] = useState<number[]>([]);
  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      type: "donut",
      fontFamily: "Helvetica, Arial, sans-serif",
      foreColor: "#333",
    },
    title: {
      text: "Favorite Era",
      align: "center",
      floating: false,
      style: {
        fontSize: "20px",
        fontWeight: 600,
        color: "#fff",
      },
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      floating: false,
      fontSize: "14px",
      fontWeight: 600,
      offsetX: 0,
      offsetY: 0,
      labels: {
        colors: "#333",
      },
      markers: {
        strokeWidth: 0,
        strokeColor: "#fff",
        // shades of gray
        fillColors: ["#000", "#333", "#666", "#777", "#222", "#fff"],
        radius: 12,
      },
      formatter: function (seriesName: string, opts: any) {
        return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
      onItemClick: {
        toggleDataSeries: true,
      },
    },
  });

  useEffect(() => {
    const yearArray = Object.entries(years);
    setSeries(yearArray.map(([, count]) => count.length));
    setOptions({
      ...options,
      labels: yearArray.map(([year]) => year),
    });
  }, [years]);
  console.log(series);
  return (
    <Container sx={{ width: "100%" }}>
      <Box sx={{ maxWidth: "100%", ml: -7 }}>
        <ReactApexChart
          options={options}
          series={series}
          type="pie"
          height={450}
        />
      </Box>
    </Container>
  );
}
