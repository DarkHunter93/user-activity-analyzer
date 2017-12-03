## Requirements

- node and npm

## Usage

1. Clone the repo: `git clone https://github.com/KedzierskiDawid/user-activity-analyzer.git`
2. Install dependencies: `npm install`
5. Start the server: `node server.js`

## Documentation

For documentation, visit: http://user-activity-analyzer.herokuapp.com/docs.html

## Todo list

* update docs
* maximal count characters for user login (username)
* check if email address is valid (regex)
* check if birthday is valid (regex)
* save blacklist to the database
* update blacklist in the database
* check if _firm_ property is working correctly
* paging for GET /users
* paging for GET /users/:userId/histories
* paging for GET /users/:userId/histories/top
* paging for GET /histories
* paging for GET /histories/top
* paging for GET /histories/previous
* extended authorization
* return count of users on path GET /users
* return websiteContent only if user send special parameter in query
* implement getPrevious method for individual website (not only for global scope)
* implement more options for matchBy and matchUrl parameters in getPrevious method
* implement limit and offset parameters for path GET /users
* handling histories record after delete user
* handling _type_ property in history model
* count _timeSpent_ property