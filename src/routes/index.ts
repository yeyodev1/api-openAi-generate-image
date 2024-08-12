import express, { Application } from 'express';
import { Server } from 'socket.io';

import openAiRoutes from './openAi';
import freepikRoutes from './freepik';

function routerApi(app: Application, io: Server) {
  const router = express.Router();

  app.use('/api', router);

  router.use(openAiRoutes)
  router.use(freepikRoutes)
}

export default routerApi;