import App from './app';
import { JWT_ACCESS, JWT_REFRESH, PORT } from './config';
import express from 'express';
import 'dotenv/config';


const main = () => {
  const app = new App();
  app.start();
};
console.log('Connecting to: ' + PORT)
main();

const app = express();
app.listen(PORT, () => {
  console.log('Server is running on port : ', PORT, 'token access : ', JWT_ACCESS, 'token refresh : ', JWT_REFRESH);
});
