import dotenv from 'dotenv'
dotenv.config({ path: process.env.ENV_FILE || '.env.local' })
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
const allowedOrigins = new Set(
  (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(origin)) {
          return callback(null, true);
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
