import { Router } from "express";
import { MemberServices } from "./services";

export const MemberRoutes = Router()
MemberRoutes.post("/member", MemberServices.add)
MemberRoutes.get("/member/:family?", MemberServices.list)
MemberRoutes.get("/member/:id", MemberServices.details)
MemberRoutes.put("/member/:id", MemberServices.edit)
MemberRoutes.delete("/member/:id", MemberServices.remove)
MemberRoutes.get("/member/print/:id", MemberServices.print)

