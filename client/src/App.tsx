import React from "react";
import { makeStyles } from "@mui/styles";
import { FaSpotify } from "react-icons/fa";
import background from "./assets/background.jpg";
import {
  Button,
  Container,
  Link,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { ThemeOptions, ThemeProvider, createTheme } from "@mui/material/styles";

const CLIENT_ID =
  process.env.REACT_APP_CLIENT_ID || "3e57a43a806346728814e707b070dd29";
const REDIRECT_URI = process.env.REACT_APP_PUBLIC_URL;
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = ["user-read-currently-playing", "user-top-read"];
const BASE_URL = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES.join(
  "+",
)}`;

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
    position: "absolute",
    left: "27%",
    textTransform: "uppercase",
    textDecoration: "underline #fff 7px",
  },
}));

export default function App() {
  const classes = useStyles(darkTheme);
  const [token, setToken] = React.useState<string | null>(null);
  const [tracks, setTracks] = React.useState<any[]>([]);

  React.useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
    if (!token && hash) {
      token = hash.substring(1).split("&")[0].split("=")[1];
      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }
    (async () => {
      fetch("https://api.spotify.com/v1/me/top/tracks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(async data => {
          await fetch("/api/user/tracks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tracks: data.items }),
          })
            .then(response => response.json())
            .then(data => setTracks(data));
        });
    })();
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
    marginBottom: "10px",
    textShadow: "2px 2px 4px #000000",
    textDecoration: "none",
    boxShadow: "0 0 0 0.2rem rgba(220,220,220)",
    "&:hover": {
      textDecoration: "none",
    },
  };
  console.log(tracks);

  return (
    <Container className={classes.root}>
      {token && (
        <Button onClick={signOut} variant="text" sx={buttonStyle}>
          Sign out
        </Button>
      )}
      <Typography variant="h2" className={classes.title} gutterBottom>
        Harmonious Sounds
        <Typography className={classes.caption} gutterBottom>
          ...exploring the world of music
        </Typography>
      </Typography>
      <Container className={classes.login}>
        {token ? (
          <Container>
            <Typography variant="h5" className={classes.subTitle}>
              Your top tracks
            </Typography>
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
