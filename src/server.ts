import cors from 'cors';
import express from 'express';
import bunyan from 'bunyan';
import bunyanMiddleware from 'bunyan-middleware';
import { sequelize } from './sequelize';

import { IndexRouter } from './controllers/v0/index.router';

import bodyParser from 'body-parser';
import { config } from './config/config';
import { V0_USER_MODELS } from './controllers/v0/model.index';


(async () => {
  await sequelize.addModels(V0_USER_MODELS);
  await sequelize.sync();

  const app = express();
  const logger = bunyan.createLogger({ name: 'My App' });

  const port = process.env.PORT || 8080;

  app.use(bunyanMiddleware(
    {
      headerName: 'X-Request-Id'
      , propertyName: 'reqId'
      , logName: 'req_id'
      , obscureHeaders: []
      , logger: logger
      , additionalRequestFinishData: function (req, res) {
        return { example: true }
      }
    }
  ));

  app.use(bodyParser.json());

  app.use(cors({
    allowedHeaders: [
      'Origin', 'X-Requested-With',
      'Content-Type', 'Accept',
      'X-Access-Token', 'Authorization',
    ],
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: config.url,
  }));

  app.use('/api/v0/', IndexRouter);

  // Root URI call
  app.get('/', async (req, res) => {
    res.send('/api/v0/');
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running ${config.url}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
