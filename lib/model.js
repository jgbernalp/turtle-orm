const ModelInstance = require('./model-instance');

class Model {
    constructor(name, schema, schemaOptions) {
        this.name = name;
        this.schema = schema;
        this.schemaOptions = schemaOptions;
    }

    setAdapter(adapter) {
        this.adapter = adapter;
    }

    getInnerModel(forceRedefinition) {
        if (!this.adapter) {
            throw new Error('Turtle ORM error: Adapter is not set for model definition, have you connected to the database?');
        }

        if (forceRedefinition || !this.model) {
            this.model = this.adapter.define(this.name, this.adapter.processSchema(this.schema), this.schemaOptions);
        }

        return this.model;
    }

    create(data) {
        return new ModelInstance(data, this.adapter, this.schema, this.getInnerModel());
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
        return this.adapter.remove(this.getInnerModel(), { query: query });
    }

    findAll({ query, limit, fields, sort, options }) {
        return this.adapter.findAll(this.getInnerModel(), {
            query: query,
            limit: limit,
            fields: fields,
            sort: sort,
            options: options
        });
    }

    sync() {
        return this.adapter.sync(this.getInnerModel(true));
    }
}

module.exports = Model;