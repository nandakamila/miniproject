import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
} from 'express';
import cors from 'cors';
import { PORT } from './config';
import { authRouter } from './auth/auth.router';
import { userRouter } from './users/users.router';
import { transactionRouter } from './transactions/transaction.router';
import { reviewRouter } from './reviews/review.router';
import { favoriteRouter } from './favorites/favorite.router';
import { eventRouter } from './events/routers/event.routers';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).send('Not found !');
      } else {
        next();
      }
    });

    // error
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes('/api/')) {
          console.error('Error : ', err.stack);
          res.status(500).send('Error !');
        } else {
          next();
        }
      },
    );
  }

  private routes(): void {
    this.app.use('/auth', authRouter);
    this.app.use('/user', userRouter);
    this.app.use('/transaction', transactionRouter);
    this.app.use('/review', reviewRouter);
    this.app.use('/favorite', favoriteRouter);
    this.app.use('/event', eventRouter);
  }

  public start(): void {
    const net = require('net');

    const server = net.createServer();

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is already in use. Retrying in 1 second...`);
        setTimeout(() => {
          server.close();
          server.listen(PORT);
        }, 1000);
      } else {
        console.error(err);
      }
    });

    server.on('listening', () => {
      console.log(`Server is listening on port ${PORT}`);
    });

    server.listen(PORT);
  }
}
