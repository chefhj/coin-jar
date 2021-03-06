var express = require("express");
var plaid = require("plaid");

var app = express();

var plaidClient = new plaid.Client(process.env.PLAID_CLIENT_ID,
  process.env.PLAID_SECRET,
  plaid.environments.tartan);

app.post("/authenticate", function(req, res) {
  var public_token = req.body.public_token;

  // Exchange a public_token for a Plaid access_token
  plaidClient.exchangeToken(public_token, function(err,
                                                   exchangeTokenRes) {
    if (err != null) {
      // Handle error!
    } else {
      // This is your Plaid access token - store somewhere persistent
      // The access_token can be used to make Plaid API calls to
      // retrieve accounts and transactions
      var access_token = exchangeTokenRes.access_token;

      plaidClient.getAuthUser(access_token, function(err, authRes) {
        if (err != null) {
          // Handle error!
        } else {
          // An array of accounts for this user, containing account
          // names, balances, and account and routing numbers.
          var accounts = authRes.accounts;

          // Return account data
          res.json({accounts: accounts});
        }
      });
    }
  });
});
