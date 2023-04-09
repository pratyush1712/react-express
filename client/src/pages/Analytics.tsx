import React from "react";
import { makeStyles } from "@mui/styles";
import { Container, Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import background from "../assets/background.jpg";
import TopArtists from "../components/TopArtists";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const useStyles = makeStyles(theme => ({
  root: {
    backgroundImage: `url(${background})`,
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

  return (
    <Container className={classes.root}>
      <Typography variant="h2" className={classes.title} gutterBottom>
        Some Analysis
      </Typography>
      <TopArtists />
    </Container>
  );
};

export default Analytics;
