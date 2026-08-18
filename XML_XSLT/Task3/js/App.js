import UserDetails from "./UserDetails.js";
import Table from "./Table.js";
import XmlService from "./XmlService.js";
import Modal from "./Modal.js";
import Pagination from "./Pagination.js";
import User from "./User.js";

const ui = {
  pagination: document.querySelector(".pagination-container"),
  modal: document.querySelector(".modal-container"),
  table: document.querySelector(".table-container"),
  details: document.querySelector(".informations-container"),

  btnAdd: document.querySelector(".addNewRowButton"),
  btnLoad: document.querySelector(".updateDataButton"),
  btnSearch: document.querySelector(".findDataButton"),

  select: document.querySelector("#data"),
  search: document.querySelector(".findDataInput"),

  status: document.querySelector(".status-message"),
};

const controls = [ui.btnAdd, ui.btnLoad, ui.btnSearch, ui.select, ui.search];

class App {
  constructor() {
    this.apiData = [];
    this.manualData = [];

    this.activeDataset = "";

    this.sort = {
      column: null,
      direction: "asc",
    };

    this.loading = false;

    this.api = new XmlService();

    this.pagination = new Pagination(ui.pagination, () => this.render());

    this.modal = new Modal(ui.modal, (data) => this.addUser(data));

    this.table = new Table(
      ui.table,
      (col) => this.sortBy(col),
      (id) => this.selectUser(id),
    );

    this.details = new UserDetails(ui.details);

    this.bindEvents();
    this.table.render([]);
  }

  bindEvents() {
    ui.btnAdd.addEventListener("click", () => this.modal.render());
    ui.btnLoad.addEventListener("click", () => this.changeDataset());
    ui.btnSearch.addEventListener("click", () => this.search());

    ui.search.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.search();
    });
  }

  getRawData() {
    return [...this.apiData, ...this.manualData];
  }

  applyFilter(data) {
    const q = ui.search.value.trim().toLowerCase();
    if (!q) return data;

    return data.filter((u) => u.matches(q));
  }

  applySort(data) {
    if (!this.sort.column) return data;

    const { column, direction } = this.sort;

    return [...data].sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];

      const result =
        typeof aVal === "number"
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal));

      return direction === "asc" ? result : -result;
    });
  }

  getProcessedData() {
    const raw = this.getRawData();
    const filtered = this.applyFilter(raw);
    return this.applySort(filtered);
  }

  render() {
    const data = this.getProcessedData();
    const page = this.pagination.getPageSlice(data);

    this.table.render(page, this.sort.column, this.sort.direction);
  }

  setLoading(state, message = "Loading...") {
    this.loading = state;

    controls.forEach((el) => (el.disabled = state));

    ui.table.classList.toggle("is-loading", state);

    if (state) {
      ui.status.textContent = message;
      ui.status.className = "status-message status-loading";
    } else {
      ui.status.className = "status-message hidden";
    }
  }

  showError(msg) {
    ui.status.textContent = msg;
    ui.status.className = "status-message status-error";
  }

  async changeDataset() {
    const type = ui.select.value;

    if (type === this.activeDataset) return;
    this.activeDataset = type;

    this.loadData(type);
  }

  async loadData(type) {
    this.setLoading(true);

    try {
      const data =
        type === "smallData"
          ? await this.api.getSmallData()
          : await this.api.getBigData();

      this.apiData = data;

      ui.search.value = "";
      this.sort = { column: null, direction: "asc" };

      this.pagination.setData(this.getProcessedData().length);
      this.render();

      this.setLoading(false);
    } catch (err) {
      this.setLoading(false);
      this.showError(err.message);
    }
  }

  addUser(data) {
    const id = this.apiData.length
      ? Math.max(...this.apiData.map((u) => u.id)) + 1
      : 1;

    const user = new User(id, ...Object.values(data));

    this.manualData.unshift(user);

    this.pagination.setData(this.getProcessedData().length);
    this.render();
  }

  sortBy(column) {
    if (this.sort.column === column) {
      this.sort.direction = this.sort.direction === "asc" ? "desc" : "asc";
    } else {
      this.sort.column = column;
      this.sort.direction = "asc";
    }

    this.pagination.goToPage(1);
    this.render();
  }

  selectUser(id) {
    const user = this.getRawData().find((u) => u.id === id);
    this.details.render(user);
  }

  search() {
    this.pagination.goToPage(1);
    this.pagination.setData(this.getProcessedData().length);
    this.render();
  }
}

new App();
