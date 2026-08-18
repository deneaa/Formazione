export default class UserDetails {
  constructor(container) {
    this.container = $(container);
  }

  render($row) {
    if (!$row) {
      this.container.empty();
      this.container.addClass("hidden");
      return;
    }

    const data = $row.data();

    this.container.removeClass("hidden");

    this.container.html(`
            <h3>Selected User</h3>

            <p><b>ID:</b> ${data.id}</p>
            <p><b>Name:</b> ${data.firstname}</p>
            <p><b>Surname:</b> ${data.lastname}</p>
            <p><b>Email:</b> ${data.email}</p>
            <p><b>Phone:</b> ${data.phone}</p>

            <hr>

            <p>
                <b>Title:</b>
                ${data.title || "Unknown"}
            </p>

            <p>
                <b>Address:</b>
                ${data.street || "Unknown"}
            </p>

            <p>
                <b>City:</b>
                ${data.city || "Unknown"}
            </p>

            <p>
                <b>State:</b>
                ${data.state || "Unknown"}
            </p>

            <p>
                <b>Zip:</b>
                ${data.zip || "Unknown"}
            </p>
        `);
  }
}
