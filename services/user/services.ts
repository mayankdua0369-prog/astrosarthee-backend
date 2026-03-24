import { Request, Response, NextFunction } from "express";
import { UserDatabase } from "../../database/models/user";
import { generateToken } from "../../helpers/token";

export namespace UserServices {
  export const seed = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const findUserAdmin = await UserDatabase.model.findOne({
        username: "admin",
      });

      if (!findUserAdmin) {
        const adminUser = new UserDatabase.model();
        await adminUser.save();
        return res.status(201).send();
      }

      res.status(200).send();
    } catch (error) {
      next(error);
    }
  };
  export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { username, email, userName, password } = req.body;
      const loginIdRaw = username || email || userName;
      const loginId =
        typeof loginIdRaw === "string" ? loginIdRaw.trim() : loginIdRaw;
      const passwordValue =
        typeof password === "string" ? password.trim() : password;

      if (!loginId || !passwordValue) {
        return res.status(400).json({
          meta: {
            status: false,
            message: "Username/email and password are required.",
          },
        });
      }

      const findUser = await UserDatabase.model.findOne({ username: loginId });

      if (!findUser || findUser.password !== passwordValue) {
        return res.status(401).json({
          meta: {
            status: false,
            message: "Invalid username or password.",
          },
        });
        }
        
      const token = await generateToken({ id: findUser._id });

      res.status(200).json({
        meta: {
          status: true,
          message: "Login successful.",
        },
        data: {
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
