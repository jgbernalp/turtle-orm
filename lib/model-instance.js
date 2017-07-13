class ModelInstance {
    constructor(data, adapter, schema, model) {
        this.adapter = adapter;
        this.model = model;

        // create inner instance
        this.instance = this.adapter.createInstance(data, model);
        this.idPropertyName = this.adapter.getIdName();

        for (let attribute in schema) {
            if (attribute != this.adapter.getIdName()) {
                Object.defineProperty(this, attribute, {
                    configurable: true,
                    get: function () {
                        return this.instance[attribute];
                    },
                    set: function (value) {
                        this.instance[attribute] = value;
                    }
                });
            }
        }
    }

    hasOwnProperty(property) {
        if (this.hasOwnProperty(property)) {
            return true;
        }

        return this.instance.hasOwnProperty(property);
    }

    get id() {
        return this.instance[this.idPropertyName] ? this.instance[this.idPropertyName] : null;
    }

    set id(value) {
        this.instance[this.idPropertyName] = value;
    }

    getModelName() {
        return this.model.name;
    }

    validate() {
        return this.adapter.validate(this.model, data);
    }

    save() {
        return this.adapter.save(this.instance);
    }

    remove() {
        return this.adapter.removeInstance(this.instance);
    }
}

module.exports = ModelInstance;