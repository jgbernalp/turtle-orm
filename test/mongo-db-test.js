process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const Database = require('../lib/database');
const ModelFactory = require('../lib/model-factory');
const Types = require('../lib/types');

describe('MongoDB adapter', function () {
    before(() => {
        ModelFactory.clearInstances();
    });

    after((done) => {
        Database.getInstance().disconnect().then(() => done());
    });

    it('should connect to a local MongoDB DB', (done) => {
        Database.create({
            dialect: 'mongodb',
            db: 'test'
        }).connectAndSync().then(() => done());
    });

    it('should create an encapsulated mongoose model', (done) => {
        let Users = ModelFactory.model('users', {
            username: { type: Types.STRING },
            id_test: { type: Types.OBJECT_ID },
            password: { type: Types.STRING }
        });

        expect(Users.create).to.be.a('function');
        expect(Users.findOne).to.be.a('function');
        expect(Users.findAll).to.be.a('function');
        expect(Users.remove).to.be.a('function');

        expect(Users.schema.id_test).to.be.an('object');

        done();
    });

    it('should create an encapsulated mongoose model instance', (done) => {
        let Users = ModelFactory.model('users', {
            username: { type: Types.STRING },
            password: { type: Types.STRING }
        });

        let userInstance = Users.create({ username: 'test@gmail.com', password: 'pass' });

        userInstance.save().then(resource => {
            expect(userInstance.id).to.not.equal(null);

            expect(resource.username).to.equal('test@gmail.com');
            expect(resource.password).to.equal('pass');

            done();
        });
    });

    it('should count elements', (done) => {
        let Users = ModelFactory.model('users', {
            username: { type: Types.STRING },
            password: { type: Types.STRING }
        });

        Users.remove({}).then(() => {
            let userInstance = Users.create({ username: 'test@gmail.com', password: 'pass' });

            userInstance.save().then(resource => {
                Users.count().then(count => {
                    expect(count).to.equal(1);
                    done();
                }, error => {
                    expect(error).to.be.a('null');
                });
            });
        });
    });
});
