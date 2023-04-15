import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { FaSpotify } from "react-icons/fa";
import background from "../assets/background.jpg";
import {
  Button,
  Container,
  Link,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { ThemeOptions, createTheme } from "@mui/material/styles";
import { CLIENT_ID, REDIRECT_URI, generateRandomString } from "../utils/auth";
import Cookies from "js-cookie";
import { NavLink } from "react-router-dom";

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
  subTitle: {
    color: "#fff",
    fontWeight: "bold",
    textShadow: "2px 2px 4px #000000",
    top: "50%",
    left: "27%",
    textTransform: "uppercase",
  },
}));

export default function Home() {
  const classes = useStyles(darkTheme);
  const [token, setToken] = useState<string | null>(null);
  const [tracks, setTracks] = useState<any[]>([]);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const authorize = async () => {
    // Redirect to Spotify authorization page
    const state = generateRandomString(16);
    const AUTH_URL =
      "https://accounts.spotify.com/authorize" +
      `?client_id=${encodeURIComponent(CLIENT_ID!)}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI!)}` +
      `&scope=${encodeURIComponent("user-top-read")}` +
      `&state=${encodeURIComponent(state)}`;
    console.log("Redirecting to Spotify authorization page");
    window.location.href = AUTH_URL;
  };

  const signOut = () => {
    Cookies.remove("access_token");
    setLoggedIn(false);
    setToken(null);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    if (code) {
      fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code, state: state }),
      })
        .then(res => res.json())
        .then(data => {
          setLoggedIn(true);
          window.history.pushState({}, "", "/");
          Cookies.set("access_token", data.access_token, {
            expires: data.expires_in,
          });
          Cookies.set("refresh_token", data.refresh_token, {
            expires: 60 * 60 * 24 * 30,
          });
        });
    }
  }, []);

  useEffect(() => {
    const access_token = Cookies.get("access_token");
    if (access_token) {
      setToken(access_token);
    }
  }, [loggedIn]);

  const fetchTracks = () => {
    fetch("/api/user/top-tracks")
      .then(res => res.json())
      .then(data => {
        if (data.items) setTracks(data.items);
        window.localStorage.setItem("tracks", JSON.stringify(data.items));
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    if (token) fetchTracks();
    else setTracks([]);
  }, [token]);

  useEffect(() => {
    fetchTracks();
  }, []);

  const buttonStyle = {
    fontSize: "20px",
    color: "#fff",
    fontWeight: "bold",
    textShadow: "2px 2px 4px #000000",
    textDecoration: "none",
    maxWidth: "600px",
    postion: "absolute",
    top: "70%",
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
          <Container>
            <Button
              variant="text"
              component={NavLink}
              to="/analytics"
              sx={{
                left: "24%",
                ...buttonStyle,
                display: token ? "block" : "none",
              }}
            >
              Click here to see some analysis of your top tracks shown below
            </Button>
            <List
              sx={{
                overflowY: "scroll",
                maxHeight: "45vh",
                textUnderlinePosition: "under",
                width: "45vw",
                position: "absolute",
                mt: "3.5%",
                left: "26%",
                "&::-webkit-scrollbar": {
                  width: "0.4em",
                  "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,200,.4)",
                },
                "&::-webkit-scrollbar-track": {
                  "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,.4)",
                },
              }}
            >
              {tracks.map((track, index) => (
                <ListItem
                  component={Link}
                  href={track.external_urls.spotify}
                  target="_blank"
                  key={index}
                  sx={{
                    display: "flex",
                    borderBottom: "1px solid #fff",
                    "&:hover": {
                      textDecoration: "none",
                      boxShadow: "0 0 0 0.2rem rgba(200,200,200,.8)",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      marginRight: 2,
                      color: "#fff",
                      textShadow: "2px 2px 4px #000000",
                      overflowX: "hidden",
                    }}
                  >
                    {track.album?.name} by {track?.artists[0]?.name}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Container>
        ) : (
          <Button onClick={authorize} variant="text" sx={buttonStyle}>
            <FaSpotify />
            <Typography variant="h5" sx={{ marginLeft: 1 }}>
              <i>Sign In With Spotify</i>
            </Typography>
          </Button>
        )}
      </Container>
    </Container>
  );
}
