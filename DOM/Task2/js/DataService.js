import User from "./User.js";

export default class DataService {
  async fetchAndMap(url) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to load data, status: ${response.status}`);
    }

    const json = await response.json();

    return json.data.map(
      (p) =>
        new User(
          p.id,
          p.firstname,
          p.lastname,
          p.email,
          p.phone,
          {
            streetAddress: p.address?.streetName ?? "",
            city: p.address?.city ?? "",
            state: p.address?.country ?? "",
            zip: p.address?.zipcode ?? "",
          },
          p.description ?? "",
        ),
    );
  }

  async getData(quantity) {
    return this.fetchAndMap(
      `https://fakerapi.it/api/v1/persons?_quantity=${quantity}`,
    );
  }

  async getSmallData() {
    return this.getData(32);
  }

  async getBigData() {
    return this.getData(1000);
  }
}
