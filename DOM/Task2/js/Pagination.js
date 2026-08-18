export default class Pagination {
  constructor(container, onPageChange) {
    this.container = container;
    this.onPageChange = onPageChange;
    this.currentPage = 1;
    this.totalPages = 0;
    this.pageSize = 2;
  }

  setData(totalItems, pageSize = this.pageSize) {
    this.pageSize = pageSize;
    this.totalPages = Math.ceil(totalItems / pageSize);

    if (this.totalPages === 0) {
      this.currentPage = 0;
    } else {
      this.currentPage = 1;
    }

    this.render();
  }

  goToPage(page) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.render();
    this.onPageChange(this.currentPage);
  }

  getPageSlice(data) {
    const start = (this.currentPage - 1) * this.pageSize;
    return data.slice(start, start + this.pageSize);
  }

  render() {
    this.container.innerHTML = "";

    const hasPrev = this.currentPage > 1;
    const hasNext = this.currentPage < this.totalPages;

    const prevBtn = this.createButton(
      "←",
      () => this.goToPage(this.currentPage - 1),
      !hasPrev,
    );

    const nextBtn = this.createButton(
      "→",
      () => this.goToPage(this.currentPage + 1),
      !hasNext,
    );

    const info = document.createElement("span");
    info.textContent = `Page ${this.currentPage} of ${this.totalPages}`;

    this.container.append(prevBtn, info, nextBtn);
  }

  createButton(label, onClick, disabled) {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.disabled = disabled;
    btn.addEventListener("click", onClick);
    return btn;
  }
}

