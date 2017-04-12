# Turle ORM

Turtle ORM aims to allow developers to use several relational and non-relational databases as a persistent layer abstracction for their nodejs projects, with a simple and agnostic logic. It uses well known libraries to handle database interaction.

At this time turltle supports the following databases:

* MongoDB (moongose)
* MySQL (sequelize)

## Get Started

### installation

```bash
npm i turtle-orm --save
```

### MongoDB Example

```javascript
const Database = require('turtle-orm').Database;
const Types = require('turtle-orm').Types;

let database = new Database({
    dialect: 'mongodb',
    port: 27017,
    hostName: 'localhost',
    databaseName: 'test',
    username: 'db_username',
    password: 'myPas$w0rd'
});

database.connectAndSync().then(() => {
    let Users = database.model('users', {
        username: { type: Types.STRING },
        password: { type: Types.STRING }
    });

    let userInstance = Users.create({ username: 'test@gmail.com', password: 'pass' });

    userInstance.save().then(resource => {
        console.log("I'm a mongo document", resource);
    });
});
```

### MySQL Example

```javascript
const Database = require('turtle-orm').Database;
const Types = require('turtle-orm').Types;

let database = new Database({
    dialect: 'mysql',
    port: 3306,
    hostName: 'localhost',
    databaseName: 'test',
    username: 'db_username',
    password: 'myPas$w0rd'
});

database.connectAndSync().then(() => {
    let Users = database.model('users', {
        username: { type: Types.STRING },
        password: { type: Types.STRING }
    });

    let userInstance = Users.create({ username: 'test@gmail.com', password: 'pass' });

    userInstance.save().then(resource => {
        console.log("I'm a mysql row", resource);
    });
});
```