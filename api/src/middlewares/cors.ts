import cors from 'cors';

const corsConfig={
    "origin": "localhost", //TODO: This will need to be updated in production 
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  }

export default cors(corsConfig)