import express from "express";

const router = express.Router();

/**
 * @route GET api/random
 * @desc Get a random number
 * @access Public
 */
router.get("/", (req, res) => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const random = arr[Math.floor(Math.random() * arr.length)];
  res.send(random.toString());
});

export default router;
