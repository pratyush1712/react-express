import express from "express";

const router = express.Router();

/**
 * @route GET api/user
 * @desc Get user's data
 * @access Public
 */
router.get("/", (req, res) => {
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
