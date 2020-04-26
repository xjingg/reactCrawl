import "reflect-metadata";
import { RequestHandler } from "express";
import { CrawlerControl, LoginControl } from "../controller";

{
  /* create a 'use' decorator */
}
export function use(middleware: RequestHandler) {
  return function(target: CrawlerControl | LoginControl, key: string) {
    const originMiddlewares =
      Reflect.getMetadata("middlewares", target, key) || [];
    originMiddlewares.push(middleware);
    Reflect.defineMetadata("middlewares", originMiddlewares, target, key);
  };
}
