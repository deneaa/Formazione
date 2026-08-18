export default class Table {
  constructor(container, onSort, onSelect) {
    this.container = $(container);
    this.onSort = onSort;
    this.onSelect = onSelect;
  }

  render(data, sortColumn, direction) {
    const headers = [
      { key: "id", label: "ID" },
      { key: "firstName", label: "First Name" },
      { key: "lastName", label: "Last Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
    ];

    const $table = $("<table>").addClass("table");
    const $thead = $("<thead>");
    const $theadRow = $("<tr>");

    headers.forEach((h) => {
      const isActive = h.key === sortColumn;
      const isDesc = isActive && direction === "desc";

      const $th = $("<th>")
        .attr("data-column", h.key)
        .addClass(isActive ? "active" : "")
        .addClass(isDesc ? "desc" : "")
        .html(`${h.label} <span class="icon-arrow">↑</span>`);

      $theadRow.append($th);
    });

    $thead.append($theadRow);

    const $tbody = $("<tbody>");

    data.forEach((row) => {
      const $tr = $("<tr>").attr("data-id", row.id);

      $("<td>").text(row.id).appendTo($tr);
      $("<td>").text(row.firstName).appendTo($tr);
      $("<td>").text(row.lastName).appendTo($tr);
      $("<td>").text(row.email).appendTo($tr);
      $("<td>").text(row.phone).appendTo($tr);

      $tbody.append($tr);
    });

    $table.append($thead, $tbody);

    this.container.empty().append($table);

    this.connectEvents();
  }

  connectEvents() {
    this.container.off("click", "tbody tr");
    this.container.off("click", "th");

    this.container.on("click", "th", (e) => {
      const column = $(e.currentTarget).data("column");
      this.onSort(column);
    });

    this.container.on("click", "tbody tr", (e) => {
      const id = $(e.currentTarget).data("id");
      this.onSelect(id);
    });
  }
}
