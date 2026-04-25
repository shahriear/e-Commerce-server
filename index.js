require('dotenv').config();
const express = require('express');
const dbConfig = require('./dbConfig/db');
const router = require('./router');
const cors = require('cors');
const app = express();
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cors());




dbConfig();
app.use(router);

// console.log(new Date('2025-08-05T06:38:22.313+00:00').toLocaleString());

app.listen(8000, () => console.log('Server is runningg'));

// mCpW3g2NgyaVRz1O;