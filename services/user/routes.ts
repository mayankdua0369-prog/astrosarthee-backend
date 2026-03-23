import { Router } from "express";
import { UserServices } from "./services";

export const UserRoutes = Router()

UserRoutes.get("/user/seed", UserServices.seed)
UserRoutes.post("/user/login", UserServices.login)