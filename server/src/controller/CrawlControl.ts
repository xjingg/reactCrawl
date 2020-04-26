import fs from 'fs';
import path from 'path';
import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { controller, use, get } from '../decorator';
import { getResponseData } from '../utils/util';
import Crawler from '../utils/crawler';
import Analyzer from '../utils/analyzer';

interface BodyRequest extends Request {
  body: { [key: string]: string | undefined };
}

interface CaseItem {
  title: string;
  count: number;
}

interface DataStructure {
  [key: string]: CaseItem[];
}

//both 'getData' and 'showData' need Login check first
const checkLogin = (req: Request, res: Response, next: NextFunction): void => {
  const isLogin = !!(req.session ? req.session.login : false);
  if (isLogin) {
    next();
  } else {
    res.json(getResponseData(null, 'please login'));
  }
};

@controller('/api')
export class CrawlerControl {
  @get('/getData')
  @use(checkLogin)
  getData(req: BodyRequest, res: Response): void {
    // console.log("getData")
    const url = "https://www.cdc.gov/coronavirus/2019-ncov/cases-updates/cases-in-us.html"
    const analyzer = Analyzer.getInstance();
    new Crawler(url, analyzer);
    res.json(getResponseData<boolean>(true));
  }

  //'showData', the endpoint to pass data to frontend
  @get('/showData')
  @use(checkLogin)
  showData(req: BodyRequest, res: Response): void {
    try {
      console.log("getData")

      const position = path.resolve(__dirname, '../../data/case.json');
      const result = fs.readFileSync(position, 'utf8');
      res.json(getResponseData<DataStructure>(JSON.parse(result)));
    } catch (e) {
      res.json(getResponseData<boolean>(false, 'data not exist'));
    }
  }
}
