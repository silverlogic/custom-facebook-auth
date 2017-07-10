'use strict';
var Promise = require('bluebird');

module.exports = function(FBUser) {
  /**
  * Allows users to log in with an OAuth 2 token received from Facebook.
  * @param {string} oauth-token An OAuth 2 token received from Facebook when
                                logging in. This is retrieved from the
                                registered callback url.
  * @param {Function(Error, object)} callback
  */
  FBUser.loginWithFacebook = function(oauthToken, callback) {
    // These values shouldn't be hardcoeded. Should use something like
    // environment variables. But for a demo, this is ok
    var appId = 120799575199257;
    var appSecret = '0e134fa32554261883ba3cb1434b4658';
    var redirectUrl = 'https://app.baseapp.tsl.io/';
    var Facebook = FBUser.app.datasources.Facebook;
    // Variable for storing facebook access token
    let accessToken;
    // Exchange OAuth token received for access token
    Facebook.accessToken(appId, appSecret, redirectUrl, oauthToken)
    .then(function(response) {
      // Retrieve access token from response
      accessToken = response['access_token'];
      // Get current user
      return Facebook.me(accessToken);
    })
    .then(function(response) {
      // Get Facebook ID from response
      var facebookId = response['id'];
      // Retrieve user info
      return Facebook.user(facebookId, accessToken);
    })
    .then(function(response) {
      // In here, we would check if the user already exists or not
      // and return an access token. For now, just return the info
      // recieved from Facebook for this demo.
      var fullName = response['first_name'] + ' ' + response['last_name'];
      var email = response['email'];
      var pictureDictionary = response['picture'];
      var pictureData = pictureDictionary['data'];
      var facebookPicUrl = pictureData['url'];
      callback(null, {'fullName': fullName,
        'email': email,
        'facebookPicUrl': facebookPicUrl});
    })
    .catch(function(error) {
      callback(error, null);
    });
  };
};
