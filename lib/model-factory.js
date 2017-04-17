const Model = require('./model');

let _models = {};
let _adapter = null;

class ModelFactory {
    static model(name, schema, schemaOptions, indexes) {
        const key = name;

        if (!_models[key]) {
            _models[key] = new Model(name, schema, schemaOptions, indexes);
            _models[key].setAdapter(_adapter);
        }

        return _models[key];
    }

    static sync() {
        let promises = [];

        for (let key in _models) {
            promises.push(_models[key].sync());
        }

        return Promise.all(promises);
    }

    static setAdapter(adapter) {
        _adapter = adapter;

        for (let key in _models) {
            _models[key].setAdapter(_adapter);
        }
    }

    static clearInstances(){
        _models = {};
    }
}

module.exports = ModelFactory;