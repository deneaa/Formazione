import XmlService from "./XmlService.js";
import UserDetails from "./UserDetails.js";
import Table from "./Table.js";
import Modal from "./Modal.js";
import Pagination from "./Pagination.js";

const ui = {
  pagination: $(".pagination-container"),
  modal: $(".modal-container"),
  table: $(".table-container"),
  details: $(".informations-container"),

  btnAdd: $(".addNewRowButton"),
  btnLoad: $(".updateDataButton"),
  btnSearch: $(".findDataButton"),

  select: $("#data"),
  search: $(".findDataInput"),

  status: $(".status-message"),
};

const controls = [ui.btnAdd, ui.btnLoad, ui.btnSearch, ui.select, ui.search];

const COLUMN_MAP = {
  id: "id",
  firstName: "firstname",
  lastName: "lastname",
  email: "email",
  phone: "phone",
};

class App {
  constructor() {
    this.rows = [];
    this.activeDataset = "";

    this.sort = {
      column: null,
      direction: "asc",
    };

    this.api = new XmlService();

    this.pagination = new Pagination(ui.pagination, () => this.render());

    this.modal = new Modal(ui.modal, (data) => this.addRow(data));

    this.table = new Table(
      ui.table,
      (col) => this.sortBy(col),
      (row) => this.selectRow(row),
    );

    this.details = new UserDetails(ui.details);

    this.bindEvents();
  }

  bindEvents() {
    ui.btnAdd.on("click", () => this.modal.render());
    ui.btnLoad.on("click", () => this.changeDataset());
    ui.btnSearch.on("click", () => this.search());

    ui.search.on("keydown", (e) => {
      if (e.key === "Enter") this.search();
    });
  }

  getRawRows() {
    return this.rows;
  }

  filterRows(rows) {
    const q = ui.search.val().trim().toLowerCase();
    if (!q) return rows;

    return rows.filter(($row) => this.rowMatches($row, q));
  }

  rowMatches($row, query) {
    const data = $row.data();

    return Object.values(data).some((val) =>
      String(val).toLowerCase().includes(query),
    );
  }

  sortRows(rows) {
    if (!this.sort.column) return rows;

    const { column, direction } = this.sort;
    const key = COLUMN_MAP[column];

    return [...rows].sort(($a, $b) => {
      const aVal = $a.data(key);
      const bVal = $b.data(key);

      const result =
        typeof aVal === "number"
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal));

      return direction === "asc" ? result : -result;
    });
  }

  getProcessedRows() {
    const raw = this.getRawRows();
    const filtered = this.filterRows(raw);
    return this.sortRows(filtered);
  }

  render() {
    const data = this.getProcessedRows();
    const page = this.pagination.getPageSlice(data);

    this.table.renderRows(page, this.sort.column, this.sort.direction);
  }

  setLoading(state, msg = "Loading...") {
    controls.forEach((el) => el.prop("disabled", state));

    ui.table.toggleClass("is-loading", state);

    if (state) {
      ui.status
        .text(msg)
        .removeClass("hidden status-error")
        .addClass("status-loading");
    } else {
      ui.status
        .text("")
        .removeClass("status-loading status-error")
        .addClass("hidden");
    }
  }

  showError(msg) {
    ui.status
      .text(msg)
      .removeClass("hidden status-loading")
      .addClass("status-error");
  }

  async changeDataset() {
    const type = ui.select.val();

    if (type === this.activeDataset) return;
    this.activeDataset = type;

    this.loadData(type);
  }

  async loadData(type) {
    this.setLoading(true);

    try {
      const table =
        type === "smallData"
          ? await this.api.getSmallDataTable()
          : await this.api.getBigDataTable();

      this.rows = this.extractRows(table);

      ui.search.val("");

      this.sort = { column: null, direction: "asc" };

      this.pagination.setData(this.getProcessedRows().length);
      this.render();

      this.setLoading(false);
    } catch (err) {
      this.setLoading(false);
      this.showError(err.message);
    }
  }

  extractRows(table) {
    return table.$tbody
      .find("tr")
      .toArray()
      .map((tr) => $(tr));
  }

  addRow(data) {
    const id = this.rows.length
      ? Math.max(...this.rows.map((r) => Number(r.data("id")))) + 1
      : 1;

    const $row = $("<tr>")
      .attr("data-id", id)
      .attr("data-firstname", data.firstName)
      .attr("data-lastname", data.lastName)
      .attr("data-email", data.email)
      .attr("data-phone", data.phone)
      .attr("data-title", data.description ?? "")
      .attr("data-street", data.address?.streetAddress ?? "")
      .attr("data-city", data.address?.city ?? "")
      .attr("data-state", data.address?.state ?? "")
      .attr("data-zip", data.address?.zip ?? "");

    $("<td>").text(id).appendTo($row);
    $("<td>").text(data.firstName).appendTo($row);
    $("<td>").text(data.lastName).appendTo($row);
    $("<td>").text(data.email).appendTo($row);
    $("<td>").text(data.phone).appendTo($row);

    this.rows.unshift($row);

    this.pagination.setData(this.getProcessedRows().length);
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

  selectRow($row) {
    this.details.render($row);
  }

  search() {
    this.pagination.goToPage(1);
    this.pagination.setData(this.getProcessedRows().length);
    this.render();
  }
}

new App();
