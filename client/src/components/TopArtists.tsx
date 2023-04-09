// use react-apex charts to display top artists in form of bar graph
import React, { useEffect, useState } from "react";
import { Container, Box, ListItem, Typography } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { makeStyles } from "@mui/styles";
import { createTheme } from "@mui/material/styles";

const MODEL_ENDPOINT =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8002";

interface ArtistData {
  name: string;
  count: number;
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const useStyles = makeStyles(theme => ({
  root: {
    backgroundSize: "cover",
    padding: "40px",
    minHeight: "100vh",
    minWidth: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    textShadow: "2px 2px 4px #000000",
    marginBottom: "40px",
  },
  listItem: {
    color: "#fff",
    fontWeight: "bold",
    textShadow: "2px 2px 4px #000000",
    marginBottom: "10px",
  },
  subTitle: {
    color: "#fff",
    textShadow: "2px 2px 4px #000000",
    textTransform: "uppercase",
  },
}));

export default function TopArtists() {
  const [artists, setArtists] = useState<Record<string, number>>({});
  const [tracks, setTracks] = useState<string[]>([]);
  const classes = useStyles(darkTheme);

  useEffect(() => {
    setTracks(JSON.parse(window.localStorage.getItem("tracks")!));
  }, []);

  useEffect(() => {
    if (tracks.length === 0) return;
    (async () => {
      fetch(`${MODEL_ENDPOINT}/model/analyse-tracks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tracks: tracks }),
      })
        .then(res => res.json())
        .then(data => {
          setArtists(data.top_artists);
        });
    })();
  }, [tracks]);

  const [series, setSeries] = useState<[{ data: number[] }]>([{ data: [] }]);
  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      type: "bar",
      height: 350,
      fontFamily: "Helvetica, Arial, sans-serif",
      foreColor: "#333",
    },
    plotOptions: {
      bar: {
        horizontal: true,
        colors: {
          ranges: [
            {
              from: 0,
              to: 100,
              color: `rgba(0, 0, 0, 0.5)`,
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#333"],
      },
    },
    xaxis: {
      categories: [],
      labels: {
        show: true,
        rotate: -45,
        rotateAlways: false,
        trim: true,
        minHeight: undefined,
        maxHeight: 120,
        style: {
          fontSize: "10px",
          fontWeight: 600,
          colors: ["#333"],
        },
      },
    },
    yaxis: {
      title: {
        text: "Artist",
        style: {
          fontSize: "12px",
          fontWeight: 600,
          color: "#333",
        },
      },
      labels: {
        show: true,
        style: {
          fontSize: "10px",
          fontWeight: 600,
          colors: ["#333"],
        },
      },
    },
    title: {
      text: "Top Artists",
      align: "center",
      floating: false,
      style: {
        fontSize: "20px",
        fontWeight: 600,
        color: "#333",
      },
    },
  });

  useEffect(() => {
    const artistArray: ArtistData[] = Object.entries(artists).map(
      ([name, count]) => ({ name, count }),
    );
    setSeries([{ data: artistArray.map(artist => artist.count) }]);
    setOptions({
      ...options,
      xaxis: {
        categories: artistArray.map(artist => artist.name),
      },
    });
  }, [artists]);
  console.log(series);

  return (
    <Container sx={{ maxWidth: "100px", width: "100%" }}>
      <Box sx={{ my: 10, maxWidth: "65%" }}>
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
        />
      </Box>
    </Container>
  );
}
