import "reflect-metadata";
import { Request, Response } from "express";
import { controller, get, post } from "../decorator";
import { getResponseData } from "../utils/util";
// import router from "../router";

//when using express and the type can't be defined by .d.ts file, eg: the type of password passed in
interface BodyRequest extends Request {
  body: { [key: string]: string | undefined };
}

//create all the routers
@controller("/api")
export class LoginControl {
  static isLogin(req: BodyRequest): boolean {
    return !!(req.session ? req.session.login : false);
  }

  @get("/isLogin")
  isLogin(req: BodyRequest, res: Response): void {
    const isLogin = LoginControl.isLogin(req);
    const result = getResponseData<boolean>(isLogin);
    res.json(result);
  }

  @post("/login")
  login(req: BodyRequest, res: Response): void {
    console.log("login");
    const { password } = req.body;
    const isLogin = LoginControl.isLogin(req);
    if (isLogin) {
      res.json(getResponseData<boolean>(true));
    } else {
      if (password === "test" && req.session) {
        req.session.login = true;
        res.json(getResponseData<boolean>(true));
      } else {
        res.json(getResponseData<boolean>(false, "login fail"));
      }
    }
  }

  @get("/logout")
  logout(req: BodyRequest, res: Response): void {
    if (req.session) {
      req.session.login = undefined;
    }
    res.json(getResponseData<boolean>(true));
  }
}
