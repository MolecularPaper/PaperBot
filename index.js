import { startUp } from './Source/System/botStartUp.mjs';
import express from 'express'

const app = express();
app.listen(process.env.PORT || 5000)

startUp();