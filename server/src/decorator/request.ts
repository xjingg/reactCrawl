import { CrawlerControl, LoginControl } from "../controller";

export enum Methods {
  get = "get",
  post = "post"
}

{
  /* create a factory decorator */
}
function getRequestDecorator(type: Methods) {
  return function(path: string) {
    return function(target: CrawlerControl | LoginControl, key: string) {
      Reflect.defineMetadata("path", path, target, key);
      Reflect.defineMetadata("method", type, target, key);
    };
  };
}

export const get = getRequestDecorator(Methods.get);
export const post = getRequestDecorator(Methods.post);
