import User from "./User.js";

export default class XmlService {
  constructor() {}

  async fetchAndMapUsers(url) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to load data, status: ${response.status}`);
    }

    const xml = await response.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "application/xml");

    const users = [];

    $(xmlDoc.documentElement)
      .find("results")
      .not("info results")
      .each(function () {
        users.push(
          new User(
            $(this).find("login > uuid").text(),
            $(this).find("name > first").text(),
            $(this).find("name > last").text(),
            $(this).find("email").text(),
            $(this).find("phone").text(),
            {
              streetAddress:
                $(this).find("location > street > name").text() || "",
              city: $(this).find("location > city").text() || "",
              state: $(this).find("location > state").text() || "",
              zip: $(this).find("location > postcode").text() || "",
            },
            $(this).find("name > title").text() || "",
          ),
        );
      });

    return users;
  }

  async getData(quantity) {
    return this.fetchAndMapUsers(
      `https://randomuser.me/api/?results=${quantity}&format=xml`,
    );
  }

  async getSmallData() {
    return this.getData(32);
  }

  async getBigData() {
    return this.getData(1000);
  }
}
