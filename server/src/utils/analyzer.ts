{
  /* 
use cheerio to crawl website.
analyze the crawled data and store data to file.
only crawl 'case number' and 'death number' from the website, store the timestamp and data.
*/
}

import fs from "fs";
import cheerio from "cheerio";
import { Analyzer } from "./crawler";

interface Case {
  title: string;
  count: number;
}

interface CaseResult {
  time: number;
  data: Case[];
}

{
  /* data structure for storing the new crawled data */
}
interface Content {
  [propName: number]: Case[];
}

export default class CaseAnalyzer implements Analyzer {
  private static instance: CaseAnalyzer;

  static getInstance() {
    if (!CaseAnalyzer.instance) {
      CaseAnalyzer.instance = new CaseAnalyzer();
    }
    return CaseAnalyzer.instance;
  }

  private getVirusInfo(html: string) {
    const $ = cheerio.load(html);
    const totalCases = parseInt(
      $("#covid-19-cases-total")
        .text()
        .replace(",", "")
    );
    const totalDeath = parseInt(
      $("#covid-19-deaths-total")
        .text()
        .replace(",", "")
    );
    const infos: Case[] = [];
    infos.push({ title: "cases", count: totalCases });
    infos.push({ title: "death", count: totalDeath });

    console.log(totalCases);
    return {
      time: new Date().getTime(),
      data: infos
    };
  }
  //store the crawled data to 'case.json' file
  //1.the json file doesn't exist, the default will be an empty object
  //2.if the json file already exists, append the new data to the preivous data
  private generateJsonContent(caseInfo: CaseResult, filePath: string) {
    let fileContent: Content = {};
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    fileContent[caseInfo.time] = caseInfo.data;
    return fileContent;
  }

  public analyze(html: string, filePath: string) {
    this.getVirusInfo(html);
    const caseInfo = this.getVirusInfo(html);
    const fileContent = this.generateJsonContent(caseInfo, filePath);
    return JSON.stringify(fileContent);
  }

  private constructor() {}
}
