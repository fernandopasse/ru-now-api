## Usage
Make sure you have [NodeJS](http://nodejs.org) and [Nodemon](http://nodemon.io/) installed, with `npm i -g nodemon`.

To get started you'll need to create a `config.js` file containing:
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

1. `npm i` to install dependencies
1. `npm start` to start the dev server with Nodemon and Babel
1. `npm run build` when ready to move to production
