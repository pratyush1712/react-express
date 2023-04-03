import express from 'express';
import path from 'path';
import cors from 'cors';
import 'express-async-errors';

import './database/connection';
const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

