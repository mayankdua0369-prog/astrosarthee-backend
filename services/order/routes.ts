import { Router } from "express";
import { OrderServices } from "./services";

export const OrderRoutes = Router()
OrderRoutes.get("/order/list/:id?", OrderServices.list)
OrderRoutes.get("/order/:id", OrderServices.details)
OrderRoutes.post("/order", OrderServices.add)
OrderRoutes.delete("/order/:id", OrderServices.remove)
OrderRoutes.put("/order/:id", OrderServices.edit)

