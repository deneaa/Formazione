export default class User {
  constructor(
    id,
    firstName,
    lastName,
    email,
    phone,
    address = null,
    description = "",
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.description = description;
  }

  getFullData() {
    return { ...this };
  }

  matches(query) {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      String(this.id).includes(q) ||
      this.firstName.toLowerCase().includes(q) ||
      this.lastName.toLowerCase().includes(q) ||
      this.email.toLowerCase().includes(q) ||
      this.phone.toLowerCase().includes(q) ||
      (this.description && this.description.toLowerCase().includes(q)) ||
      (this.address &&
        Object.values(this.address).some((v) => v.toLowerCase().includes(q)))
    );
  }
}
