import * as Express from "express";
import Routes from "./routes/index";

export class Server {

  public run() {
    const app = Express();
    
    app.use(Routes);

    app.listen(3000, () => {
      console.log("Listening on port 3000...");
    })
    .on("error", err => {
      console.log(`Fail to start...${err}`);
      process.exit(1);
    });
  }
}