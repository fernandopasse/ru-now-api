## Usage
1. Create a `config.js` file containing:
```
module.exports = {
  mongodb: '<user>:<password>@<database-url>:<port>/<database>',
  clientID: 'Facebook clientID',
  clientSecret: 'Faceboook clientSecret',
  facebookCallback: 'A callback url for Facebook to redirect to',
  facebookSuccess: 'Redirect url in case of successful Facebook login',
  facebookFail: 'Redirect url in case of failed Facebook login',
  logout: 'Redirect after user signsout',
  sessionSecret: 'Secret for session storage'
}
```

2. `npm i`
3. `npm start`
