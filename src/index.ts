import * as dotenv from 'dotenv';
import { Response } from 'express';
import http from 'http';

import dbConnect from './config/mongo';
import createApp from './app';

async function main() {
  dotenv.config();

  await dbConnect();

  const { app, server } = createApp();

  const port: number | string = process.env.PORT || 8000;

  server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

main();