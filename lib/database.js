const Model = require('./model');
const MongoDBAdapter = require('./adapters/mongo-db');
const MySQLAdapter = require('./adapters/mysql');

let _models = {};

class Database {
    constructor({ dialect, username, password, databaseName, hostname, port, options }) {
        this.dbConfig = {
            username: username,
            password: password,
            hostname: hostname,
            port: port,
            databaseName: databaseName,
            options: options,
        };

        this.dialect = dialect;

        switch (dialect) {
            case 'mongodb':
                this.adapter = new MongoDBAdapter(this.dbConfig);
                break;
            case 'mysql':
                this.adapter = new MySQLAdapter(this.dbConfig);
                break;
            default:
                throw new Error('Invalid dialect');
                break;
        }
    }

    connect() {
        return this.adapter.connect();
    }

    sync() {
        let promises = [];

        for (let key in _models) {
            promises.push(_models[key].sync());
        }

        return Promise.all(promises);
    }

    model(name, schema, schemaOptions) {
        const key = name + '_' + this.dialect;

        if (!_models[key]) {
            _models[key] = new Model(name, this.adapter, schema, schemaOptions);
        }

        return _models[key];
    }
}

module.exports = Database;