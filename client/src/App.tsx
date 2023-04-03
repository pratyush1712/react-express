import React from "react";
import { makeStyles } from "@mui/styles";
import { FaSpotify } from "react-icons/fa";
import background from "./assets/background.jpg";
import { Button, Container, Link, Typography } from "@mui/material";
import { ThemeOptions, ThemeProvider, createTheme } from "@mui/material/styles";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const REDIRECT_URI = "http://localhost:8000/";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const BASE_URL = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
} as ThemeOptions);

const useStyles = makeStyles(theme => ({
  root: {
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    padding: "40px",
    minHeight: "100vh",
    minWidth: "100vw",
    display: "flex",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    textShadow: "2px 2px 4px #000000",
    position: "absolute",
    top: "16%",
    left: "8%",
  },
  caption: {
    color: "#fff",
    fontWeight: "bold",
    textShadow: "2px 2px 4px #000000",
    position: "absolute",
    left: "56%",
  },
  login: {
    position: "absolute",
    top: "40%",
    left: "30%",
    transform: "translate(-50%, -50%)",
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

export default function App() {
  const classes = useStyles(darkTheme);
  const [clicks, setClicks] = React.useState<number>(0);
  const [token, setToken] = React.useState<string | null>(null);
  const onClick = () => {
    fetch("/api/random")
      .then(response => response.json())
      .then(data => setClicks(data));
  };

  React.useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
    if (!token && hash) {
      token = hash.substring(1).split("&")[0].split("=")[1];
      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }
    setToken(token);
  }, []);

  const signOut = () => {
    window.localStorage.removeItem("token");
    setToken(null);
  };

  const buttonStyle = {
    fontSize: "20px",
    color: "#fff",
    fontWeight: "bold",
    textShadow: "2px 2px 4px #000000",
    textDecoration: "none",
    boxShadow: "0 0 0 0.2rem rgba(220,220,220)",
    "&:hover": {
      textDecoration: "none",
    },
  };

  return (
    <Container className={classes.root}>
      <Typography variant="h2" className={classes.title} gutterBottom>
        Harmonious Sounds
        <Typography className={classes.caption} gutterBottom>
          ...exploring the world of music
        </Typography>
      </Typography>
      <Container className={classes.login}>
        {token ? (
          <Button onClick={signOut} sx={buttonStyle}>
            Sign Out
          </Button>
        ) : (
          <Button
            component={Link}
            href={BASE_URL}
            variant="text"
            sx={buttonStyle}
          >
            <Typography variant="h5" sx={{ marginRight: 2 }}>
              <i>Sign In With Spotify</i>
            </Typography>
            <FaSpotify />
          </Button>
        )}
      </Container>
    </Container>
  );
}
