// use react-apex charts to display top artists in form of bar graph
import React, {useEffect, useState} from "react";
import {Container, Box} from "@mui/material";
import ReactApexChart from "react-apexcharts";
import {ApexOptions} from "apexcharts";

interface FeaturesData {
  name: string;
  count: number;
}

export default function Features({features}: {features: Record<string, number>}) {
  const [series, setSeries] = useState<[{data: number[]}]>([{data: []}]);
  const [options, setOptions] = useState<ApexOptions>({
    chart: {type: "bar", fontFamily: "Helvetica, Arial, sans-serif", foreColor: "#333"},
    plotOptions: {
      bar: {horizontal: true, barHeight: "50%", colors: {ranges: [{from: 0, to: 100, color: `rgba(220, 220, 220, 0.5)`}]}}
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {fontSize: "12px", colors: ["#333"]}
    },
    xaxis: {
      categories: [],
      labels: {
        show: true,
        rotate: -45,
        rotateAlways: true,
        trim: true,
        minHeight: undefined,
        maxHeight: 180,
        style: {fontSize: "10px", fontWeight: 600, colors: ["#333"]}
      }
    },
    yaxis: {
      title: {
        text: "Feature",
        style: {fontSize: "16px", fontWeight: 900, color: "#333"}
      },
      labels: {
        show: true,
        style: {fontSize: "13px", fontWeight: 700, colors: ["#333"]}
      }
    },
    title: {
      text: "Features of your top tracks",
      align: "center",
      floating: false,
      style: {fontSize: "20px", fontWeight: 600, color: "#fff"}
    }
  });

  useEffect(() => {
    const artistArray: FeaturesData[] = Object.entries(features).map(([name, count]) => ({name, count}));
    setSeries([{data: artistArray.map(artist => artist.count)}]);
    setOptions({
      ...options,
      xaxis: {categories: artistArray.map(artist => artist.name)}
    });
  }, [features]);

  return (
    <Container sx={{maxWidth: "100%"}}>
      <Box sx={{maxWidth: "100%", ml: -7}}>
        <ReactApexChart options={options} series={series} type="bar" height={450} />
      </Box>
    </Container>
  );
}
