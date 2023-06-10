import express, {Request, Response, Router} from "express";
import {Buffer} from "buffer";
import request from "request";
import {spotify} from "../config";

const STATE_KEY = "spotify_auth_state";

const router: Router = express.Router();

router.post("/login", (req: Request, res: Response) => {
  const code: string = req.body.code;
  const state: string = req.body.state;
  if (!state) res.status(400).json("state missing");
  else {
    const authOptions: request.OptionsWithUrl = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code,
        redirect_uri: spotify.REDIRECT_URI,
        grant_type: "authorization_code"
      },
      headers: {
        Authorization: `Basic ${Buffer.from(`${spotify.CLIENT_ID}:${spotify.CLIENT_SECRET}`).toString("base64")}`
      },
      json: true
    };
    request.post(authOptions, function (error: any, response: any, body: any) {
      if (!error && response.statusCode === 200) {
        const access_token: string = body.access_token;
        const refresh_token: string = body.refresh_token;
        const expires_in: number = body.expires_in;
        res.send({
          access_token: access_token,
          refresh_token: refresh_token,
          expires_in: expires_in
        });
      }
    });
  }
});

router.get("/refresh_token", (req: Request, res: Response) => {
  const refreshToken: string = req.query.refresh_token as string;
  const authOptions: request.OptionsWithUrl = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization: `Basic ${Buffer.from(`${spotify.CLIENT_ID}:${spotify.CLIENT_SECRET}`).toString("base64")}`
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refreshToken
    },
    json: true
  };
  request.post(authOptions, (error: any, response: any, body: any) => {
    if (!error && response.statusCode === 200) {
      const accessToken: string = body.access_token;
      const refresh_token: string = body.refresh_token;
      res.send({access_token: accessToken, refresh_token: refresh_token});
    }
  });
});

export default router;
