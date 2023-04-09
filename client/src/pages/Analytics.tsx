import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Container, Grid, Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import background from "../assets/background.jpg";

import TopArtists from "../components/TopArtists";
import YearPieChart from "../components/YearPieChart";

const MODEL_ENDPOINT =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8002";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const useStyles = makeStyles(theme => ({
  root: {
    backgroundImage: `url(${background})`,
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
    marginLeft: "20px",
    paddingLeft: "100px",
  },
  listItem: {
    color: "#fff",
    fontWeight: "bold",
    textShadow: "2px 2px 4px #000000",
    marginBottom: "10px",
  },
}));

const Analytics = () => {
  const classes = useStyles(darkTheme);
  const tracks = JSON.parse(window.localStorage.getItem("tracks")!);
  const [data, setData] = useState<{
    artists: Record<string, number>;
    years: Record<string, string[]>;
  }>({ artists: {}, years: {} });
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setLoading(true);
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
          setData({ artists: data.top_artists, years: data.decade_features });
          setLoading(false);
        });
    })();
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <Container className={classes.root}>
      <Typography variant="h2" className={classes.title} gutterBottom>
        Some Analysis
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <TopArtists artists={data.artists} />
        </Grid>
        <Grid item xs={12} md={5}>
          <YearPieChart years={data.years} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Analytics;
