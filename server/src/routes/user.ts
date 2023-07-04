import express from "express";
import request from "request";

const router = express.Router();

/**
 * @route GET api/user
 * @desc Get user's data
 * @access Public
 */
router.get("/top-tracks", (req, res) => {
  const token = req.cookies["access_token"];
  if (!token) res.status(400).json("token missing");
  else {
    const authOptions = {
      url: "https://api.spotify.com/v1/me/top/tracks?limit=50&offset=0",
      headers: { Authorization: `Bearer ${token}` },
      json: true
    };
    request.get(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) res.send(body);
      else {
        // fetch new token and try again
        request.post("/auth/refresh_token", function (error, response, body) {
          if (!error && response.statusCode === 200) {
            const access_token = body.access_token;
            const authOptions = {
              url: "https://api.spotify.com/v1/me/top/tracks",
              headers: { Authorization: `Bearer ${access_token}` },
              json: true
            };
            request.get(authOptions, function (error, response, body) {
              if (!error && response.statusCode === 200) res.send(body);
            });
          }
        });
      }
    });
  }
});

/**
 * @route POST api/user
 * @desc Create a user
 * @access Public
 */
router.post("/", (req, res) => {
  const user = req.body.user;
  res.send(user);
});

/**
 * @route POST api/user
 * @desc Update user's data
 * @access Public
 */
router.post("/tracks", (req, res) => {
  const tracks = req.body.tracks;
  res.send(tracks);
});

export default router;
