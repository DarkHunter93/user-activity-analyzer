## Requirements

- node and npm

## Usage

1. Clone the repo: `git clone https://github.com/KedzierskiDawid/user-activity-analyzer.git`
2. Install dependencies: `npm install`
3. Add SECRET in `config.js`
4. Add MongoDB URI database to `config.js`
5. Start the server: `node server.js`

### Cheking if the server is working

Send a `GET` request to `http://localhost:8080/`. In response you will get a message `Hello! The API is at http://localhost:8080/api`.

### Cheking logs

`http://localhost:8080/server.log`

### Getting a Token

Send a `POST` request to `/api/login/` with JSON:

```json
  {
    "login": "Madonna",
    "password": "password"
  }
```

If everythink goes well you will get a JSON with token:

```json
{
  "success": true,
  "message": "Enjoy your token!",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsiYWRtaW4iOiJpbml0IiwicGFzc3dvcmQiOiJpbml0IiwibG9naW4iOiJpbml0IiwiX2lkIjoiaW5pdCJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6e30sImluaXQiOnsiYWRtaW4iOnRydWUsInBhc3N3b3JkIjp0cnVlLCJsb2dpbiI6dHJ1ZSwiX2lkIjp0cnVlfSwibW9kaWZ5Ijp7fSwicmVxdWlyZSI6e319LCJzdGF0ZU5hbWVzIjpbInJlcXVpcmUiLCJtb2RpZnkiLCJpbml0IiwiZGVmYXVsdCIsImlnbm9yZSJdfSwiZW1pdHRlciI6eyJkb21haW4iOm51bGwsIl9ldmVudHMiOnt9LCJfZXZlbnRzQ291bnQiOjAsIl9tYXhMaXN0ZW5lcnMiOjB9fSwiaXNOZXciOmZhbHNlLCJfZG9jIjp7ImFkbWluIjp0cnVlLCJwYXNzd29yZCI6IjEyMzQ1NiIsImxvZ2luIjoiRGF3aWQiLCJfaWQiOiI1OTAxYmE0MzczNGQxZDMyNTkwZDJmN2YifSwiaWF0IjoxNDkzNzI2NDg3LCJleHAiOjE0OTM3MzAwODd9.VaTFmX19iXuXLa-Xa76naatUKNRLMncNOS7rztYa-qg"
}
```

### Verifying a Token

You have two options:
* send a `GET` request with token as a URL parameter: `/api/check?token=YOUR_TOKEN_HERE`
* send a `POST` request to `/api/check/` with token as a JSON:

```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsiYWRtaW4iOiJpbml0IiwicGFzc3dvcmQiOiJpbml0IiwibG9naW4iOiJpbml0IiwiX2lkIjoiaW5pdCJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6e30sImluaXQiOnsiYWRtaW4iOnRydWUsInBhc3N3b3JkIjp0cnVlLCJsb2dpbiI6dHJ1ZSwiX2lkIjp0cnVlfSwibW9kaWZ5Ijp7fSwicmVxdWlyZSI6e319LCJzdGF0ZU5hbWVzIjpbInJlcXVpcmUiLCJtb2RpZnkiLCJpbml0IiwiZGVmYXVsdCIsImlnbm9yZSJdfSwiZW1pdHRlciI6eyJkb21haW4iOm51bGwsIl9ldmVudHMiOnt9LCJfZXZlbnRzQ291bnQiOjAsIl9tYXhMaXN0ZW5lcnMiOjB9fSwiaXNOZXciOmZhbHNlLCJfZG9jIjp7ImFkbWluIjp0cnVlLCJwYXNzd29yZCI6IjEyMzQ1NiIsImxvZ2luIjoiRGF3aWQiLCJfaWQiOiI1OTAxYmE0MzczNGQxZDMyNTkwZDJmN2YifSwiaWF0IjoxNDkzNzI2NDg3LCJleHAiOjE0OTM3MzAwODd9.VaTFmX19iXuXLa-Xa76naatUKNRLMncNOS7rztYa-qg"
}
```

If everythink goes well you will get a JSON similar to this:

```json
{
  "id": "<UUID>",
  "login": "<LOGIN>",
  "password": "<DECODED PASSWORD>",
  "admin": "false"
}
```

### User registration

Send a `POST` request to `/register` with JSON:

```json
  {
    "login": "<LOGIN>",
    "password": "<PASSWORD>",
    "email": "<EMAIL>"
  }
```

### Save history of user's searching

Send a `POST` request to `/api/history/` with JSON:

```json
{
	"url": {
		"full": "www.example.com/books?login=Dawid&password=555555",
		"protocol": "HTTPS",
		"domain": "www.example.com",
		"port": "4536",
		"path": "/books",
		"query": {
			"login": "Dawid",
			"password": "555555"
		}
	},
	"parentUrl": {
		"full": "www.google.com/",
		"protocol": "HTTPS",
		"domain": "www.google.com",
		"port": "2222",
		"path": "/",
		"query": {}
	},
	"time": "1495362058727",
	"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsiYWRtaW4iOiJpbml0IiwiX192IjoiaW5pdCIsImVtYWlsIjoiaW5pdCIsInBhc3N3b3JkIjoiaW5pdCIsImxvZ2luIjoiaW5pdCIsImlkIjoiaW5pdCIsIl9pZCI6ImluaXQifSwic3RhdGVzIjp7Imlnbm9yZSI6e30sImRlZmF1bHQiOnt9LCJpbml0Ijp7Il9fdiI6dHJ1ZSwiYWRtaW4iOnRydWUsImVtYWlsIjp0cnVlLCJwYXNzd29yZCI6dHJ1ZSwibG9naW4iOnRydWUsImlkIjp0cnVlLCJfaWQiOnRydWV9LCJtb2RpZnkiOnt9LCJyZXF1aXJlIjp7fX0sInN0YXRlTmFtZXMiOlsicmVxdWlyZSIsIm1vZGlmeSIsImluaXQiLCJkZWZhdWx0IiwiaWdub3JlIl19LCJlbWl0dGVyIjp7ImRvbWFpbiI6bnVsbCwiX2V2ZW50cyI6e30sIl9ldmVudHNDb3VudCI6MCwiX21heExpc3RlbmVycyI6MH19LCJpc05ldyI6ZmFsc2UsIl9kb2MiOnsiYWRtaW4iOmZhbHNlLCJfX3YiOjAsImVtYWlsIjoiZGF3aWRAZ21haWwuY29tIiwicGFzc3dvcmQiOiIxMjM0NTYiLCJsb2dpbiI6IkRhd2lkIiwiaWQiOiJiYjYzY2JmNy05YmRlLTRlNjUtOTFlYi1hMTI4ZDRjZThjNTAiLCJfaWQiOiI1OTIxNmJiNDM2NWQwNTI0NTEwNTY4MGEifSwiaWF0IjoxNDk1MzYyNTEwLCJleHAiOjE0OTUzNjk3MTB9.tHH0M5vRuaG-EOItRBPAb5B3Af0tJ1cvp1ylKjVo0-E"
}
```

[This](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now) format of time is required.

### Searching history (outdated!)

Send a `GET` request with URL parameters:
* `user` - **required**, owner of record
* `url` - **required**, what page is searching for
* `token` - **required**
* `offset` - **optional**
* `limit` - **optional**

For example: `/api/history?user=Dawid&url=www.antyweb.pl&limit=1&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsiX192IjoiaW5pdCIsImFkbWluIjoiaW5pdCIsInBhc3N3b3JkIjoiaW5pdCIsImxvZ2luIjoiaW5pdCIsIl9pZCI6ImluaXQifSwic3RhdGVzIjp7Imlnbm9yZSI6e30sImRlZmF1bHQiOnt9LCJpbml0Ijp7Il9fdiI6dHJ1ZSwiYWRtaW4iOnRydWUsInBhc3N3b3JkIjp0cnVlLCJsb2dpbiI6dHJ1ZSwiX2lkIjp0cnVlfSwibW9kaWZ5Ijp7fSwicmVxdWlyZSI6e319LCJzdGF0ZU5hbWVzIjpbInJlcXVpcmUiLCJtb2RpZnkiLCJpbml0IiwiZGVmYXVsdCIsImlnbm9yZSJdfSwiZW1pdHRlciI6eyJkb21haW4iOm51bGwsIl9ldmVudHMiOnt9LCJfZXZlbnRzQ291bnQiOjAsIl9tYXhMaXN0ZW5lcnMiOjB9fSwiaXNOZXciOmZhbHNlLCJfZG9jIjp7Il9fdiI6MCwiYWRtaW4iOmZhbHNlLCJwYXNzd29yZCI6IjU1NTU1NSIsImxvZ2luIjoiQWxpY2lhIEtleXMiLCJfaWQiOiI1OTEyZjgzMzNiNDg2OTE1M2MxYWI2NmMifSwiaWF0IjoxNDk0NDMwMDY3LCJleHAiOjE0OTQ0MzcyNjd9.gE3ZPcDclQDGwLAAoBASzj2axjY78LzE2XsCRKSkPrg`

If everythink goes well you will get a JSON similar to this:

```json
{
  "success": true,
  "data": [
    {
      "_id": "59132eadf773d727582b588b",
      "owner": "Dawid",
      "url": "www.antyweb.pl",
      "parentUrl": "www.google.com",
      "__v": 0,
      "time": "1494429357019"
    }
  ]
}
```
