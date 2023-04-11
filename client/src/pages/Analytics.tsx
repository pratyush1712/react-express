import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import {
  Button,
  Container,
  Grid,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import background from "../assets/background.jpg";

import TopArtists from "../components/TopArtists";
import YearPieChart from "../components/YearPieChart";
import Features from "../components/Features";

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
  button: {
    fontSize: "20px",
    color: "#fff",
    fontWeight: "bold",
    textShadow: "2px 2px 4px #000000",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
      boxShadow: "0 0 0 0.2rem rgba(200,200,200,.8)",
    },
  },
}));

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
  }>({ artists: {}, years: {}, features: {} });
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setPredicting(true);
    const regex = /playlist\/(\w+)/;
    const playlistId = url?.match(regex)?.[1];
    fetch(`${MODEL_ENDPOINT}/model/predict-mood/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playlist_id: playlistId }),
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
          setData({
            artists: data.top_artists,
            years: data.decade_features,
            features: data.average_features,
          });
          setLoading(false);
        });
    })();
  }, []);

  const buttonStyle = {
    fontSize: "20px",
    color: "#fff",
    fontWeight: "bold",
    textShadow: "2px 2px 4px #000000",
    textDecoration: "none",
    maxWidth: "600px",
    postion: "absolute",
    marginLeft: "40px",
    top: "70%",
    boxShadow: "0 0 0 0.2rem rgba(220,220,220)",
    "&:hover": {
      textDecoration: "none",
    },
  };

  if (loading) return <div>Loading...</div>;
  return (
    <Container className={classes.root}>
      <Typography variant="h2" className={classes.title} gutterBottom>
        Some Analysis
      </Typography>
      <TextField
        id="Standard"
        label="Type your favorite playlist url"
        variant="standard"
        onChange={e => setUrl(e.target.value)}
        sx={{ ml: 10, minWidth: "70%", mb: 3 }}
      />
      <Button type="submit" sx={buttonStyle} onClick={handleSubmit}>
        {predicting ? <CircularProgress /> : <Typography>Analyze</Typography>}
      </Button>
      {happinessScore !== null && (
        <Typography variant="h4" sx={{ ml: 10, minWidth: "70%", mb: 3 }}>
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
