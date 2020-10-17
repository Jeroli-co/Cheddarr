class UserModel {
  constructor(username, email, avatar, friends, confirmed, admin) {
    this.username = username;
    this.email = email;
    this.avatar = avatar;
    this.friends = friends;
    this.confirmed = confirmed;
    this.admin = admin;
  }
}

export { UserModel };
