import UserDetails from "./UserDetails.js";
import Table from "./Table.js";
import DataService from "./DataService.js";
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

  selectData: document.querySelector("#data"),
  searchInput: document.querySelector(".findDataInput"),

  status: document.querySelector(".status-message"),
};

const controls = [
  ui.btnAdd,
  ui.btnLoad,
  ui.btnSearch,
  ui.selectData,
  ui.searchInput,
];

class App {
  constructor() {
    this.users = [];
    this.activeDataset = "";

    this.sort = {
      column: null,
      direction: "asc",
    };

    this.loading = false;

    this.api = new DataService();

    this.pagination = new Pagination(ui.pagination, () => this.renderPage());

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

    ui.searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.search();
    });
  }

  getFilteredUsers() {
    const q = ui.searchInput.value.trim().toLowerCase();

    return this.users.filter((u) => u.matches(q));
  }

  applySort(users) {
    if (!this.sort.column) return users;

    const { column, direction } = this.sort;

    return [...users].sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];

      const result =
        typeof aVal === "number"
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal));

      return direction === "asc" ? result : -result;
    });
  }

  renderPage() {
    const filtered = this.getFilteredUsers();
    const sorted = this.applySort(filtered);
    const page = this.pagination.getPageSlice(sorted);

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
    const type = ui.selectData.value;

    if (type === this.activeDataset) return;
    this.activeDataset = type;

    this.loadData(type);
  }

  async loadData(type) {
    this.setLoading(true);

    try {
      const raw =
        type === "smallData"
          ? await this.api.getSmallData()
          : await this.api.getBigData();

      this.users = raw;

      ui.searchInput.value = "";
      this.sort = { column: null, direction: "asc" };

      this.pagination.setData(this.users.length);
      this.renderPage();

      this.setLoading(false);
    } catch (err) {
      this.setLoading(false);
      this.showError(err.message);
    }
  }

  addUser(data) {
    const id = this.users.length
      ? Math.max(...this.users.map((u) => u.id)) + 1
      : 1;

    const user = new User(id, ...Object.values(data));

    this.users.unshift(user);

    this.pagination.setData(this.getFilteredUsers().length);
    this.renderPage();
  }

  sortBy(column) {
    if (this.sort.column === column) {
      this.sort.direction = this.sort.direction === "asc" ? "desc" : "asc";
    } else {
      this.sort.column = column;
      this.sort.direction = "asc";
    }

    this.pagination.goToPage(1);
    this.renderPage();
  }

  selectUser(id) {
    const user = this.users.find((u) => u.id === id);
    this.details.render(user);
  }

  search() {
    this.pagination.setData(this.getFilteredUsers().length);
    this.renderPage();
  }
}

new App();
