var Mongoose = require('mongoose');
var Schema = require('mongoose').Schema;

Mongoose.Promise = global.Promise;

class MongoDBAdapter {
    constructor(dbConfig) {
        this.dbConfig = dbConfig;
    }

    define(name, schema, schemaOptions) {
        delete Mongoose.connection.models[name];

        return Mongoose.model(name, schema);
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

        Mongoose.connect(connectionString, this.getDefaultOptions());

        return new Promise((resolve) => {
            Mongoose.connection.once('connected', () => {
                return resolve();
            });
        })
    }

    disconnect() {
        return new Promise((resolve) => {
            Mongoose.disconnect();

            Mongoose.connection.once('disconnected', () => {
                return resolve();
            });
        });
    }

    getDefaultOptions() {
        return {};
    }

    sync(model) {
        // Nothing to do
        return Promise.resolve();
    }

    dropDatabase() {
        return new Promise((resolve, reject) => {
            if (Mongoose.connection.readyState == 1) {
                return resolve(this._dropDatabase());
            } else {
                Mongoose.connection.once('connected', () => {
                    return resolve(this._dropDatabase());
                });
            }
        })
    }

    _dropDatabase() {
        var promises = [];

        for (let collection in Mongoose.connection.collections) {
            promises.push(new Promise((resolve, reject) => {
                Mongoose.connection.collections[collection].drop((err) => {
                    if (err && err.message != 'ns not found') {
                        return reject(err);
                    }

                    return resolve();
                });
            }))
        }

        return Promise.all(promises);
    }

    processSchema(schema, schemaOptions) {
        for (let attributeName in schema) {
            let attribute = schema[attributeName];

            if (attribute) {
                let type = attribute.type || attribute;

                if (type) {
                    switch (type) {
                        case 'object_id':
                            schema[attributeName] = Object.assign(schema[attributeName], { type: Schema.Types.ObjectId });
                            break;
                    }
                }
            }
        }

        return new Schema(schema, schemaOptions);
    }

    createInstance(data, model) {
        return new model(data);
    }

    save(instance) {
        return instance.save();
    }

    remove(model, { query }) {
        return model.remove(query).exec();
    }

    removeInstance(instance) {
        return instance.remove().exec();
    }

    findAll(model, { query, limit, fields, sort, options }) {
        let operation = model.find(query);

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