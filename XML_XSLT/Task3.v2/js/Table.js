export default class Table {
  constructor(container, onSort, onSelect) {
    this.container = $(container);
    this.onSort = onSort;
    this.onSelect = onSelect;

    this.$table = null;
    this.$thead = null;
    this.$tbody = null;
  }

  setTable(tableElement) {

    this.container.empty().append(tableElement);

    this.$table = this.container.find("table");
    this.$thead = this.$table.find("thead");
    this.$tbody = this.$table.find("tbody");

    this.connectHeaderEvents();
  }

  renderRows(rowElements, sortColumn, direction) {

    this.$tbody.empty();
    rowElements.forEach((row) => this.$tbody.append(row));

    this.updateHeaderState(sortColumn, direction);
    this.connectRowEvents();
  }

  updateHeaderState(sortColumn, direction) {
    this.$thead.find("th").each((_, th) => {
      const $th = $(th);
      const column = $th.data("column");
      const isActive = column === sortColumn;
      const isDesc = isActive && direction === "desc";

      $th.toggleClass("active", isActive);
      $th.toggleClass("desc", isDesc);
    });
  }

  connectHeaderEvents() {
    this.$thead.off("click", "th");
    this.$thead.on("click", "th", (e) => {
      const column = $(e.currentTarget).data("column");
      this.onSort(column);
    });
  }

  connectRowEvents() {
    this.$tbody.off("click", "tr");
    this.$tbody.on("click", "tr", (e) => {
      const $row = $(e.currentTarget);
      this.onSelect($row);
    });
  }
}
