import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
  Router,
} from 'express';
import cors from 'cors';
import { PORT } from './config';
import { authRouter } from './auth/auth.router'
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
    this.app.use('/auth', authRouter);
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}