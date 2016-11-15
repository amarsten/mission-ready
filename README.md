# mission-ready

Installation:

1. Clone git repo

  `git clone git@github.com:westin/mission-ready.git`
2. If `mission-ready/node_modules` directory exsists, delete entire directory

  `rm -rf /mission-ready/node_modules`
3. DB interactions require connection to a mongo server, ensure mongod is running
4. Install all the npm packages and stuff:

  `npm install`
5. Start it up:

  `node server.js`


Usage:
Server runs on port 50000, access server ip on that port to begin

Important information:

The admin password is defined as a global variable in serverSocket.js. 
Given that this is an idiotproofing method instead of an actually secure solution authentication is
just dont by checking a given sudo password against this variable.
At this time the password is password, but this can be changed at any time by chaning this variable.

(this was done to allow simple authentication without users + a DB  interaction)


Developed by team Kinetic Domain CMU IS 2016
- Westin Lohne
- Arun Marsten
- Donovan Powers
- Aamer Rakla

