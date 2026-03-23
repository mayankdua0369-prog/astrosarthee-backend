import { Request, Response, NextFunction } from "express";
import { exec } from "child_process";

export const DeployWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
    const event = req.body.commits[0];
    if (event ) {
      console.log("Push event received. Deploying...");
      exec("./deploy.sh", (err, stdout, stderr) => {
        if (err) {
          console.error(`Error: ${stderr}`);
          return res.status(500).send("Deployment failed");
        }
        console.log(`Output: ${stdout}`);
        res.send("Deployment successful");
      });
    } else {
      res.status(400).send("Invalid event or wrong payload");
    }
  } catch (error) {
    next(error);
  }
};
