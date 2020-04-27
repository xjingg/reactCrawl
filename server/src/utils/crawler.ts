{
  /* define the strategy of crawl */
}
import fs from "fs";
import path from "path";
import superagent from "superagent";
{
  /* use superagent to translate typescript to javascript */
}

export interface Analyzer {
  analyze: (html: string, filePath: string) => string;
  analyzeMultiple: (html: string, html2: string, filePath: string) => string;
}

class Crawler {
  protected filePath = path.resolve(__dirname, "../../data/case.json");

  protected async getOriginalHtml(source: string) {
    const result = await superagent.get(source);
    return result.text;
  }

  protected writeFile(content: string) {
    fs.writeFileSync(this.filePath, content);
  }

  async initSpiderProcess() {
    const html = await this.getOriginalHtml(this.url);
    const fileContent = this.analyzer.analyze(html, this.filePath);
    this.writeFile(fileContent);
  }

  constructor(protected url: string, protected analyzer: Analyzer) {
    // this.initSpiderProcess();
  }
}

export class multiCrawler extends Crawler {
  constructor(url1: string, protected url2: string, analyzer: Analyzer) {
    super(url1, analyzer);
  }

  async initSpiderProcess() {
    const promise1 = this.getOriginalHtml(this.url);
    const promise2 = this.getOriginalHtml(this.url2);
    const html = await promise1;
    const html2 = await promise2;

    const fileContent = this.analyzer.analyzeMultiple(
      html,
      html2,
      this.filePath
    );

    //write
    this.writeFile(fileContent);
  }
}

export default Crawler;
