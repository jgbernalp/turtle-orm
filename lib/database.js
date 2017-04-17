const ModelFactory = require('./model-factory');
const MongoDBAdapter = require('./adapters/mongo-db');
const MySQLAdapter = require('./adapters/mysql');

let _instance = null;

class Database {
    static getInstance() {
        return _instance;
    }

    static create(initConfig) {
        _instance = new Database(initConfig);

        return _instance;
    }

    constructor({ dialect, username, password, db, hostname, port, options }) {
        this.dbConfig = {
            username: username,
            password: password,
            hostname: hostname,
            port: port,
            db: db,
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

        ModelFactory.setAdapter(this.adapter);
    }

    dropDatabase() {
        return this.adapter.dropDatabase();
    }

    disconnect() {
        return this.adapter.disconnect();
    }

    connect() {
        return this.adapter.connect();
    }

    connectAndSync() {
        return this.adapter.connect().then(() => {
            return this.sync();
        });
    }

    sync() {
        return ModelFactory.sync();
    }
}

module.exports = Database;