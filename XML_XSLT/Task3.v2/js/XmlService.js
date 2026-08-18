export default class XmlService {
  constructor() {
    this.xsltProcessor = null;
  }

  async loadXslt() {
    if (this.xsltProcessor) return this.xsltProcessor;

    const response = await fetch("./users.xsl");
    const xslText = await response.text();

    const parser = new DOMParser();
    const xslDoc = parser.parseFromString(xslText, "application/xml");

    const processor = new XSLTProcessor();
    processor.importStylesheet(xslDoc);

    this.xsltProcessor = processor;
    return processor;
  }

  async fetchAsHtmlTable(url) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to load data, status: ${response.status}`);
    }

    const xmlText = await response.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    const processor = await this.loadXslt();

    const fragment = processor.transformToFragment(xmlDoc, document);

    const table = fragment.querySelector("table");

    return table;
  }

  async getSmallDataTable() {
    return this.fetchAsHtmlTable(
      `https://randomuser.me/api/?results=32&format=xml`,
    );
  }

  async getBigDataTable() {
    return this.fetchAsHtmlTable(
      `https://randomuser.me/api/?results=1000&format=xml`,
    );
  }
}
