const ModelInstance = require('./model-instance');

class Model {
    constructor(name, adapter, schema, schemaOptions) {
        this.name = name;
        this.adapter = adapter;
        this.schema = schema;
        this.model = this.adapter.define(name, this.adapter.processSchema(schema), schemaOptions);
    }

    create(data) {
        return new ModelInstance(data, this.adapter, this.schema, this.model);
    }

    findOne({ query, fields, sort, options }) {
        return new Promise((resolve, reject) => {
            this.findAll({ query: query, limit: 1, fields: fields, sort: sort, options: options })
                .then((err, resource) => {
                    if (err) return reject(err);

                    resolve(resource && resource.length > 0 ? resource[0] : null);
                });
        });
    }

    remove({ query }) {
        return this.adapter.remove(this.model, { query: query });
    }

    findAll({ query, limit, fields, sort, options }) {
        return this.adapter.findAll(this.model, {
            query: query,
            limit: limit,
            fields: fields,
            sort: sort,
            options: options
        });
    }

    sync() {
        return this.adapter.sync(this.model);
    }
}

module.exports = Model;