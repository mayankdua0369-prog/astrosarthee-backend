import express from 'express'
import morgan from 'morgan'
import { connectToDatabase } from './database/connection'
import cors from 'cors'
import { Decoded } from './helpers/decode';
import { errorHandler } from './helpers/error-handler';
import { FamilyRoutes } from './services/family/routes';
import { MemberRoutes } from './services/member/routes';
import { UserRoutes } from './services/user/routes';
import { OrderRoutes } from './services/order/routes';
import { LeadsRoutes } from './services/leads/routes';

(async () => {
  await connectToDatabase();
})();

const app = express()

app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://astrosarthee.online",
        "https://www.astrosarthee.online",
        "https://3000-firebase-astro-1753453032561.cluster-ubrd2huk7jh6otbgyei4h62ope.cloudworkstations.dev"
      ],
    })
  );
  


app.use([
    express.json(),
    express.urlencoded({
        extended: false,
    }),
])
app.use(morgan('dev'))


app.use(Decoded)
app.use([UserRoutes, FamilyRoutes, MemberRoutes, OrderRoutes, LeadsRoutes])



app.use(errorHandler)

app.listen(4000, () => {
    console.log(
        '💻4000 server working🚀'
    )
})
