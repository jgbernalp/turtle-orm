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
const ModelFactory = require('turtle-orm').ModelFactory;
const Types = require('turtle-orm').Types;

let Users = ModelFactory.model('users', {
    username: { type: Types.STRING },
    password: { type: Types.STRING },
    clientId: { type: Types.OBJECT_ID }
});

let database = Database.create({
    dialect: 'mongodb',
    port: 27017,
    hostName: 'localhost',
    databaseName: 'test',
    username: 'db_username',
    password: 'myPas$w0rd'
});

database.connectAndSync().then(() => {
    let userInstance = Users.create({ username: 'test@gmail.com', password: 'pass' });

    userInstance.save().then(resource => {
        console.log("I'm a mongo document", resource);
    });
});
```

### MySQL Example

```javascript
const Database = require('turtle-orm').Database;
const ModelFactory = require('turtle-orm').ModelFactory;
const Types = require('turtle-orm').Types;

let Users = ModelFactory.model('users', {
    username: { type: Types.STRING },
    password: { type: Types.STRING }
});

let database = Database.create({
    dialect: 'mysql',
    port: 3306,
    hostName: 'localhost',
    databaseName: 'test',
    username: 'db_username',
    password: 'myPas$w0rd'
});

database.connectAndSync().then(() => {
    let userInstance = Users.create({ username: 'test@gmail.com', password: 'pass' });

    userInstance.save().then(resource => {
        console.log("I'm a mysql row", resource);
    });
});
```