import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
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
      origin: (origin, callback) => {
        const allowedOrigins = new Set([
          "http://localhost:3000",
          "http://localhost:3001",
          "https://astrosarthee.online",
          "https://www.astrosarthee.online",
          "https://3000-firebase-astro-1753453032561.cluster-ubrd2huk7jh6otbgyei4h62ope.cloudworkstations.dev",
        ]);

        if (!origin || allowedOrigins.has(origin)) {
          return callback(null, true);
        }

        try {
          const parsed = new URL(origin);
          const isLocalHost =
            parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";

          if (isLocalHost) {
            return callback(null, true);
          }
        } catch (error) {
          return callback(new Error("Invalid origin"), false);
        }

        return callback(new Error("Not allowed by CORS"), false);
      },
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
app.use('/api', [UserRoutes, FamilyRoutes, MemberRoutes, OrderRoutes, LeadsRoutes])



app.use(errorHandler)

const port = Number(process.env.PORT || 8000)
const host = process.env.HOST || '0.0.0.0'

app.listen(port, host, () => {
    console.log(
        `💻Server listening on http://${host}:${port} 🚀`
    )
})
