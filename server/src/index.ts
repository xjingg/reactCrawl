import express from "express";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import "./controller/LoginControl";
import "./controller/CrawlControl";
import router from "./router";

{
  /* use cookieSession middleware to store login state, set effective time duration */
}

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cookieSession({
    name: "session",
    keys: ["key"],
    maxAge: 24 * 60 * 60 * 1000
  })
);

app.use(router);

app.listen(8000, () => {
  console.log("server is running");
});
