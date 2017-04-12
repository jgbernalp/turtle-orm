var Sequelize = require('sequelize');
var Types = require('../types');

class MySQLAdapter {
    constructor(dbConfig) {
        this.dbConfig = dbConfig;

        let connectionString = 'mysql://';

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

        this.connection = new Sequelize(connectionString, this.getDefaultOptions());
    }

    define(name, schema, schemaOptions) {
        return this.connection.define(name, schema, schemaOptions);
    }

    getDefaultOptions(){
        return {
            logging: false
        };
    }

    getIdName() {
        return 'id';
    }

    connect() {
        return Promise.resolve();
    }

    sync(model) {
        return model.sync();
    }

    processSchema(schema) {
        for (let attributeName in schema) {
            let attribute = schema[attributeName];

            if (attribute.type == Types.STRING) {
                attribute.type = Sequelize.STRING;
            }
        }

        return schema;
    }

    createInstance(data, model) {
        return model.build(data);
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

module.exports = MySQLAdapter;