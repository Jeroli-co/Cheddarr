class EncodedTokenModel {
  constructor(token_type, access_token) {
    this.token_type = token_type;
    this.access_token = access_token;
  }

  toString() {
    return this.token_type + " " + this.access_token;
  }
}

export { EncodedTokenModel };
