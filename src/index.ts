import express, { json, Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import OrderRoute from './Routes/OrderRoute'
import UserRoute from './Routes/UserRoute'
import PaymentRoute from './Routes/PaymentRoute'
import { schema } from './Schema';

const main = async () => {
  dotenv.config();


  const app = express();
  const PORT = process.env.PORT || 3001;
  const corsOptions = { credentials: true, origin: process.env.URL || '*' };


  app.use(cors(corsOptions));
  app.use(json());
  app.use(cookieParser());
  app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
  }))

  // app.use('/', express.static(join(__dirname, 'public')))
  app.use('/api/order', OrderRoute);
  app.use('/api/users', UserRoute);
  app.use('/api/payment', PaymentRoute);


  app.get('/', (req: Request, res: Response) => {
    res.status(200).json("Hello")
  })

  app.listen(PORT, () => {
    console.log(`Server is listening on port:${PORT}`);
  })
}

main().catch((err) => {
  console.log(err)
})
