class UserModel {
  constructor(username, email, avatar, confirmed, admin) {
    this.username = username;
    this.email = email;
    this.avatar = avatar;
    this.confirmed = confirmed;
    this.admin = admin;
  }
}

export { UserModel };
