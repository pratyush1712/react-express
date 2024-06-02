import React, {useState, useEffect, useCallback} from "react";
import {FaSpotify} from "react-icons/fa";
import {Button, Container, Link, List, ListItem, Typography} from "@mui/material";
import useStyles from "../styles/Home";
import {ThemeOptions, createTheme} from "@mui/material/styles";
import {CLIENT_ID, REDIRECT_URI, generateRandomString} from "../utils/auth";
import Cookies from "js-cookie";
import {NavLink} from "react-router-dom";

const darkTheme = createTheme({
  palette: {
    mode: "dark"
  }
} as ThemeOptions);

function AuthorizeButton({onClick, style}: {onClick: () => void; style: any}) {
  return (
    <Button onClick={onClick} variant="text" sx={style}>
      <FaSpotify />
      <Typography variant="h5" sx={{marginLeft: 1}}>
        <i>Sign In With Spotify</i>
      </Typography>
    </Button>
  );
}

function TrackList({tracks, style}: {tracks: any[]; style: any}) {
  return (
    <Container>
      <List sx={style}>
        {tracks.map((track, index) => (
          <ListItem
            component={Link}
            href={track.external_urls.spotify}
            target="_blank"
            key={index}
            sx={{
              display: "flex",
              borderBottom: "1px solid #fff",
              "&:hover": {textDecoration: "none", boxShadow: "0 0 0 0.2rem rgba(200,200,200,.8)"}
            }}
          >
            <Typography
              variant="h6"
              sx={{
                marginRight: 2,
                color: "#fff",
                textShadow: "2px 2px 4px #000000",
                overflowX: "hidden"
              }}
            >
              {track.album?.name} by {track?.artists[0]?.name}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default function Home() {
  const classes = useStyles(darkTheme);
  const [token, setToken] = useState<string | null>(null);
  const [tracks, setTracks] = useState<any[]>([]);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const authorize = useCallback(async () => {
    const state = generateRandomString(16);
    const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${encodeURIComponent(
      CLIENT_ID!
    )}&response_type=code&redirect_uri=${encodeURIComponent(
      REDIRECT_URI!
    )}&scope=${encodeURIComponent("user-top-read")}&state=${encodeURIComponent(state)}`;
    window.location.href = AUTH_URL;
  }, []);

  const signOut = useCallback(() => {
    Cookies.remove("access_token");
    setLoggedIn(false);
    setToken(null);
  }, []);

  const fetchTracks = useCallback(() => {
    fetch("/api/user/top-tracks")
      .then(res => res.json())
      .then(data => {
        if (data.items) {
          setTracks(data.items);
          window.localStorage.setItem("tracks", JSON.stringify(data.items));
        }
      })
      .catch(err => console.log(err));
  }, [token]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    if (code) {
      fetch("/api/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({code: code, state: state})
      })
        .then(res => res.json())
        .then(data => {
          setLoggedIn(true);
          window.history.pushState({}, "", "/");
          Cookies.set("access_token", data.access_token, {expires: data.expires_in});
          Cookies.set("refresh_token", data.refresh_token, {expires: 60 * 60 * 24 * 30});
        });
    }
  }, []);

  useEffect(() => {
    const access_token = Cookies.get("access_token");
    if (access_token) {
      setToken(access_token);
      fetchTracks();
    } else {
      setTracks([]);
    }
  }, [loggedIn, fetchTracks]);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

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
    "&:hover": {textDecoration: "none"}
  };
  const trackListStyle = {
    overflowY: "scroll",
    maxHeight: "45vh",
    textUnderlinePosition: "under",
    width: "45vw",
    position: "absolute",
    mt: "3.5%",
    left: "26%",
    "&::-webkit-scrollbar": {
      width: "0.4em",
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,200,.4)"
    },
    "&::-webkit-scrollbar-track": {"-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,.4)"}
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
          <Button
            variant="text"
            component={NavLink}
            to="/analytics"
            sx={{...buttonStyle, left: "24%", display: token ? "block" : "none"}}
          >
            Click here to see some analysis of your top tracks shown below
          </Button>
        ) : (
          <AuthorizeButton onClick={authorize} style={buttonStyle} />
        )}
        <TrackList tracks={tracks} style={trackListStyle} />
      </Container>
    </Container>
  );
}
