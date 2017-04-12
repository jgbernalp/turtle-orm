var Moongose = require('mongoose');

Moongose.Promise = global.Promise;

class MongoDBAdapter {
    constructor(dbConfig) {
        this.dbConfig = dbConfig;
    }

    define(name, schema) {
        return Moongose.model(name, schema);
    }

    getIdName() {
        return '_id';
    }

    connect() {
        let connectionString = 'mongodb://';

        if (this.dbConfig.username && this.dbConfig.password) {
            connectionString += this.dbConfig.username + ':' + this.dbConfig.password + '@';
        }

        if (!this.dbConfig.hostName) {
            this.dbConfig.hostName = 'localhost';
        }

        connectionString += this.dbConfig.hostName;

        if (this.dbConfig.port) {
            connectionString += ':' + this.dbConfig.port;
        }

        if (this.dbConfig.databaseName) {
            connectionString += '/' + this.dbConfig.databaseName;
        }

        return Moongose.connect(connectionString, this.getDefaultOptions());
    }

    getDefaultOptions() {
        return {};
    }

    sync(model) {
        // Nothing to do
        return Promise.resolve();
    }

    processSchema(schema) {
        return schema;
    }

    createInstance(data, model) {
        return new model(data);
    }

    save(instance) {
        return instance.save();
    }

    remove(model, { query }) {
        return model.remove(query);
    }

    removeInstance(instance) {
        return instance.remove();
    }

    findAll(model, { query, limit, fields, sort, options }) {
        let operation = model.findAll(query);

        if (options && options.lean) {
            operation = operation.lean();
        }

        if (limit) {
            operation = operation.limit(limit);
        }

        if (fields) {
            operation = operation.select(fields);
        }

        if (sort) {
            operation = operation.sort(sort);
        }

        return operation.exec();
    }
}

module.exports = MongoDBAdapter;