import { Router } from "express";
import { LeadsServices } from "./services";

export const LeadsRoutes = Router()
LeadsRoutes.post("/leads", LeadsServices.add)
LeadsRoutes.get("/leads", LeadsServices.list)
LeadsRoutes.put("/leads/:id", LeadsServices.edit)
LeadsRoutes.delete("/leads/:id", LeadsServices.remove)