import jwt from "jsonwebtoken";

export const generateToken = async(payload: any): Promise<string> => {
  const token = jwt.sign(payload, process.env.JWT_KEY as string, {
      expiresIn: "5d",
      algorithm: "HS256",
  });
  return token;
};