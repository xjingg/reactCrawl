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
    //this.getVirusInfo(html);
    const caseInfo = this.getVirusInfo(html);
    const fileContent = this.generateJsonContent(caseInfo, filePath);
    return JSON.stringify(fileContent);
  }

  private getText($: CheerioStatic, className: string) {
    return parseInt(
      $(className)
        .text()
        .replace(",", "")
    );
  }

  private getLargerVirusInfo(html: string, html2: string) {
    const $ = cheerio.load(html);
    const $2 = cheerio.load(html2);

    const totalCases1 = this.getText($, "#covid-19-cases-total");
    const totalCases2 = this.getText($2, "#covid-19-cases-total");
    const totalCases = totalCases1 > totalCases2 ? totalCases1 : totalCases2;

    const totalDeath1 = this.getText($, "#covid-19-deaths-total");
    const totalDeath2 = this.getText($2, "#covid-19-deaths-total");
    const totalDeath = totalDeath1 > totalDeath2 ? totalDeath1 : totalDeath2;
    // const totalCases = parseInt(
    //   $("#covid-19-cases-total")
    //     .text()
    //     .replace(",", "")
    // );
    // const totalDeath = parseInt(
    //   $("#covid-19-deaths-total")
    //     .text()
    //     .replace(",", "")
    // );
    const infos: Case[] = [];
    infos.push({ title: "cases", count: totalCases });
    infos.push({ title: "death", count: totalDeath });

    console.log(totalCases);
    return {
      time: new Date().getTime(),
      data: infos
    };
  }

  public analyzeMultiple(html1: string, html2: string, filePath: string) {
    const caseInfo = this.getLargerVirusInfo(html1, html2);
    const fileContent = this.generateJsonContent(caseInfo, filePath);
    return JSON.stringify(fileContent);
  }

  private constructor() {}
}
