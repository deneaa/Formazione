export default class UserDetails {
  constructor(container) {
    this.container = $(container);
  }

  render(row) {
    if (!row) {
      this.container.empty();
      this.container.addClass("hidden");
      return;
    }
    this.container.removeClass("hidden");

    this.container.html(`
            <h3>Selected User</h3>

            <p><b>ID:</b> ${row.id}</p>
            <p><b>Name:</b> ${row.firstName}</p>
            <p><b>Surname:</b> ${row.lastName}</p>
            <p><b>Email:</b> ${row.email}</p>
            <p><b>Phone:</b> ${row.phone}</p>

            <hr>

            <p>
                <b>Description:</b>
                ${row.description ?? "Unknown"}
            </p>

            <p>
                <b>Address:</b>
                ${row.address?.streetAddress ?? "Unknown"}
            </p>

            <p>
                <b>City:</b>
                ${row.address?.city ?? "Unknown"}
            </p>

            <p>
                <b>State:</b>
                ${row.address?.state ?? "Unknown"}
            </p>

            <p>
                <b>Zip:</b>
                ${row.address?.zip ?? "Unknown"}
            </p>
        `);
  }
}
