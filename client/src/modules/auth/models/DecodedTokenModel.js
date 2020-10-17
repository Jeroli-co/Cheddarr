class DecodedTokenModel {
  constructor(id, username, avatar, admin, exp) {
    this.id = id;
    this.username = username;
    this.avatar = avatar;
    this.admin = admin;
    this.exp = exp;
  }
}

export { DecodedTokenModel };
