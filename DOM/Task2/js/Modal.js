export default class Modal {
  constructor(container, onSave) {
    this.container = container;
    this.onSave = onSave;

    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) this.close();
    });
  }

  render(initialData = {}) {
    this.container.innerHTML = `
      <div class="modal-content">
        <h2>${initialData.id ? "Edit row" : "New row"}</h2>
        <form class="form">
          <input class="input-firstName small" type="text" required minlength="3" maxlength="150" placeholder="First name" value="${initialData.firstName ?? ""}" />
          <input class="input-lastName small" type="text" required minlength="3" maxlength="150" placeholder="Last name" value="${initialData.lastName ?? ""}" />
          <input class="input-email small" type="email" required minlength="3" maxlength="150" placeholder="Email" value="${initialData.email ?? ""}" />
          <input class="input-phone small" type="text" required minlength="3" maxlength="150" placeholder="Phone" value="${initialData.phone ?? ""}" />

          <button type="button" class="toggle-extra">Additional Information</button>

          <div class="extra-section hidden">
            <input class="input-street small" type="text" placeholder="Street address" value="${initialData.address?.streetAddress ?? ""}" />
            <input class="input-city small" type="text" placeholder="City" value="${initialData.address?.city ?? ""}" />
            <input class="input-state small" type="text" placeholder="State" value="${initialData.address?.state ?? ""}" />
            <input class="input-zip small" type="text" placeholder="Zip code" value="${initialData.address?.zip ?? ""}" />
            <input class="input-description small" type="text" placeholder="Description" value="${initialData.description ?? ""}" />
          </div>

          <p class="error"></p>

          <div class="modal-actions">
            <button type="submit" class="saveModalButton">Save</button>
            <button type="button" class="closeModalButton">Close</button>
          </div>
        </form>
      </div>
    `;

    this.container.classList.remove("hidden");
    this.connectEvents();
  }

  close() {
    this.container.classList.add("hidden");
    this.container.innerHTML = "";
  }

  connectEvents() {
    const form = this.container.querySelector(".form");
    const errorEl = this.container.querySelector(".error");

    this.container
      .querySelector(".closeModalButton")
      .addEventListener("click", () => this.close());

    this.container
      .querySelector(".toggle-extra")
      .addEventListener("click", () =>
        this.container
          .querySelector(".extra-section")
          .classList.toggle("hidden"),
      );

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      errorEl.textContent = "";

      const firstName = this.container
        .querySelector(".input-firstName")
        .value.trim();
      const lastName = this.container
        .querySelector(".input-lastName")
        .value.trim();
      const email = this.container.querySelector(".input-email").value.trim();
      const phone = this.container.querySelector(".input-phone").value.trim();

      if (!firstName || !lastName || !email || !phone) {
        errorEl.textContent = "Please fill in all required fields.";
        return;
      }

      const userData = {
        firstName,
        lastName,
        email,
        phone,
        address: {
          streetAddress: this.container
            .querySelector(".input-street")
            .value.trim(),
          city: this.container.querySelector(".input-city").value.trim(),
          state: this.container.querySelector(".input-state").value.trim(),
          zip: this.container.querySelector(".input-zip").value.trim(),
        },
        description: this.container
          .querySelector(".input-description")
          .value.trim(),
      };

      this.onSave(userData);
      this.close();
    });
  }
}
