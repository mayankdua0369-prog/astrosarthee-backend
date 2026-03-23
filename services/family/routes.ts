import { Router } from "express";
import { FamilyServices } from "./services";

export const FamilyRoutes = Router()
FamilyRoutes.post("/family", FamilyServices.add)
FamilyRoutes.get("/family", FamilyServices.list)
FamilyRoutes.put("/family/:id", FamilyServices.edit)
FamilyRoutes.delete("/family/:id", FamilyServices.remove)

