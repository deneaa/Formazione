export default class Table {
  constructor(container, onSort, onSelect) {
    this.container = container;
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

    const headersHTML = headers
      .map((h) => {
        const isActive = h.key === sortColumn;
        const isDesc = isActive && direction === "desc";
        return `<th data-column="${h.key}" class="${isActive ? "active" : ""} ${isDesc ? "desc" : ""}">
        ${h.label} 
        <span class="icon-arrow">↑</span>
    </th>`;
      })
      .join("");

    const rows = data
      .map(
        (row) => `
        <tr data-id="${row.id}">
            <td>${row.id}</td>
            <td>${row.firstName}</td>
            <td>${row.lastName}</td>
            <td>${row.email}</td>
            <td>${row.phone}</td>
        </tr>`,
      )
      .join("");

    this.container.innerHTML = `
      <table class="table">
        <thead>
            <tr>${headersHTML}</tr>
        </thead>
            <tbody>
                ${rows}
            </tbody>
      </table>`;

    this.connectEvents();
  }

  connectEvents() {
    this.container.querySelectorAll("th").forEach((th) => {
      th.onclick = () => this.onSort(th.dataset.column);
    });

    this.container.querySelectorAll("tbody tr").forEach((tr) => {
      tr.onclick = () => this.onSelect(Number(tr.dataset.id));
    });
  }
}
