const startUp = require('./Source/System/botStartUp.js');
const express = require('express');

const app = express();
app.listen(process.env.PORT || 4000)

startUp.startUp();