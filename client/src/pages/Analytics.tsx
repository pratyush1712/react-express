import React, {useEffect, useState} from "react";
import {Button, Container, Grid, Typography, TextField, CircularProgress} from "@mui/material";
import {createTheme} from "@mui/material/styles";

import TopArtists from "../components/TopArtists";
import YearPieChart from "../components/YearPieChart";
import Features from "../components/Features";
import useStyles from "../styles/Analytics";

const MODEL_ENDPOINT = process.env.NODE_ENV === "production" ? "" : "http://localhost:8002";

const darkTheme = createTheme({
  palette: {
    mode: "dark"
  }
});

const Analytics = () => {
  const classes = useStyles(darkTheme);
  const tracks = JSON.parse(window.localStorage.getItem("tracks")!);
  const [url, setUrl] = useState<string>("");
  const [happinessScore, setHappinessScore] = useState(null);
  const [predicting, setPredicting] = useState<boolean>(false);
  const [data, setData] = useState<{
    artists: Record<string, number>;
    years: Record<string, string[]>;
    features: Record<string, number>;
  }>({artists: {}, years: {}, features: {}});
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setPredicting(true);
    const regex = /playlist\/(\w+)/;
    const playlistId = url?.match(regex)?.[1];
    fetch(`${MODEL_ENDPOINT}/model/predict-mood/`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({playlist_id: playlistId})
    })
      .then(res => res.json())
      .then(data => {
        setPredicting(false);
        setHappinessScore(data.mood);
      });
  };

  useEffect(() => {
    setLoading(true);
    if (tracks.length === 0) return;
    fetch(`${MODEL_ENDPOINT}/model/analyse-tracks`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({tracks: tracks})
    })
      .then(res => res.json())
      .then(data => {
        setData({artists: data.top_artists, years: data.decade_features, features: data.average_features});
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <Container className={classes.root}>
      <Typography variant="h2" className={classes.title} gutterBottom>
        Some Analysis
      </Typography>
      <TextField id="Standard" label="Type your favorite playlist url" variant="standard" onChange={e => setUrl(e.target.value)} sx={{ml: 10, minWidth: "70%", mb: 3}} />
      <Button type="submit" className={classes.button} onClick={handleSubmit}>
        {predicting ? <CircularProgress /> : <Typography>Analyze</Typography>}
      </Button>
      {happinessScore !== null && (
        <Typography variant="h4" sx={{ml: 10, minWidth: "70%", mb: 3}}>
          Happiness Score: {happinessScore}/100
        </Typography>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Features features={data.features} />
        </Grid>
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
