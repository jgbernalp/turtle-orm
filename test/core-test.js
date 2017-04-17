const Database = require('../lib/database');
const ModelFactory = require('../lib/model-factory');
const Types = require('../lib/types');
const expect = require('chai').expect;

describe('Core test', function () {
    it('should connect to a local MongoDB DB', (done) => {
        ModelFactory.clearInstances();

        Database.create({
            dialect: 'mongodb',
            db: 'test'
        }).connectAndSync()
            .then(Database.getInstance().disconnect())
            .then(() => done())
            .catch(done);
    });

    it('should create model properties', (done) => {
        let Users = ModelFactory.model('users', {
            username: Types.STRING,
            password: Types.STRING,
            test_id: Types.OBJECT_ID
        });

        let modelInstance = Users.create({
            username: 'test@gmail.com',
            password: 'p@$$w0rd'
        });

        expect(modelInstance.username).to.equal('test@gmail.com');
        expect(modelInstance.password).to.equal('p@$$w0rd');
        expect(modelInstance.not_created_propety).to.be.an('undefined');

        done();
    });

    it('should get a database instance', (done) => {
        let database = Database.create({
            dialect: 'mongodb',
            db: 'test'
        }).connectAndSync()
            .then(() => {
                database === Database.getInstance();

                return Database.getInstance().disconnect();
            })
            .then(() => done())
            .catch(done);
    });

    it('should drop a database', (done) => {
        Database.create({
            dialect: 'mongodb',
            db: 'test'
        }).connectAndSync()
            .then(Database.getInstance().dropDatabase())
            .then(Database.getInstance().disconnect())
            .then(() => done())
    });
});