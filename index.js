import { startUp } from './Source/System/botStartUp.mjs';
import express from 'express'

const app = express();
const port = process.env.PORT || 3000;

startUp();