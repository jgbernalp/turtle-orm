const ModelInstance = require('./model-instance');

class Model {
    constructor(name, schema, schemaOptions, indexes) {
        this.name = name;
        this.schema = schema;
        this.schemaOptions = schemaOptions;
        this.indexes = indexes;
    }

    getModelName() {
        return this.name;
    }

    setAdapter(adapter) {
        this.adapter = adapter;
    }

    getInnerModel(forceRedefinition) {
        if (!this.adapter) {
            throw new Error('Turtle ORM error: Adapter is not set for model definition, are you connected to the database?');
        }

        if (forceRedefinition || !this.model) {
            this.model = this.adapter.define(this.name, this.adapter.processSchema(this.schema, this.schemaOptions), this.schemaOptions, this.indexes);
        }

        return this.model;
    }

    validate(data) {
        return this.adapter.validate(this.getInnerModel(), data);
    }

    create(data) {
        return new ModelInstance(data, this.adapter, this.schema, this.getInnerModel());
    }

    findById({ id, fields, options }) {
        let query = {};
        query[this.adapter.getIdName()] = id;

        return this.findOne({ query: query, fields, options });
    }

    findOne({ query, fields, sort, options }) {
        if (query == undefined) {
            query = {};
        }

        return new Promise((resolve, reject) => {
            this.findAll({ query, limit: 1, fields, sort, options })
                .then(resource => {
                    resolve(resource && resource.length > 0 ? resource[0] : null);
                }).catch(reject);
        });
    }

    remove(query) {
        if (query == undefined) {
            return Promise.reject(new Error('undefined query to remove elements'));
        }

        return this.adapter.remove(this.getInnerModel(), { query: query });
    }

    findAll({ query, limit, fields, sort, skip, options }) {
        if (query == undefined) {
            query = {};
        }

        return new Promise((resolve, reject) => {
            this.adapter.findAll(this.getInnerModel(), {
                query,
                limit,
                fields,
                sort,
                skip,
                options
            }).then(items => {
                if (!options || !options.lean) {
                    items.forEach((item, index, array) => {
                        array[index] = new ModelInstance(item, this.adapter, this.schema, this.getInnerModel());
                    });
                }

                resolve(items);
            }).catch(reject);
        });
    }

    sync() {
        return this.adapter.sync(this.getInnerModel(true));
    }
}

module.exports = Model;