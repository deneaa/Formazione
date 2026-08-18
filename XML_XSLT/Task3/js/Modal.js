export default class Modal {
  constructor(container, onSave) {
    this.container = $(container);
    this.onSave = onSave;

    // click pe overlay
    this.container.on("click", (e) => {
      if (e.target === this.container[0]) {
        this.close();
      }
    });
  }

  render(initialData = {}) {
    this.container.html(`
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
    `);

    this.container.removeClass("hidden");
    this.connectEvents();
  }

  close() {
    this.container.addClass("hidden");
    this.container.empty();
  }

  connectEvents() {
    const $form = this.container.find(".form");
    const $error = this.container.find(".error");

    this.container
      .find(".closeModalButton")
      .off("click")
      .on("click", () => this.close());

    this.container
      .find(".toggle-extra")
      .off("click")
      .on("click", () => {
        this.container.find(".extra-section").toggleClass("hidden");
      });

    $form.off("submit").on("submit", (e) => {
      e.preventDefault();
      $error.text("");

      const firstName = this.container.find(".input-firstName").val().trim();
      const lastName = this.container.find(".input-lastName").val().trim();
      const email = this.container.find(".input-email").val().trim();
      const phone = this.container.find(".input-phone").val().trim();

      if (!firstName || !lastName || !email || !phone) {
        $error.text("Please fill in all required fields.");
        return;
      }

      const userData = {
        firstName,
        lastName,
        email,
        phone,
        address: {
          streetAddress: this.container.find(".input-street").val().trim(),
          city: this.container.find(".input-city").val().trim(),
          state: this.container.find(".input-state").val().trim(),
          zip: this.container.find(".input-zip").val().trim(),
        },
        description: this.container.find(".input-description").val().trim(),
      };

      this.onSave(userData);
      this.close();
    });
  }
}
