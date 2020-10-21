class PlexSignInConfirmationModel {
  constructor(decodedToken, redirectURI) {
    this.decodedToken = decodedToken;
    this.redirectURI = redirectURI;
  }
}

export { PlexSignInConfirmationModel };
