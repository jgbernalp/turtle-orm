process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const Database = require('../lib/database');
const Types = require('../lib/types');

describe('MongoDB adapter', function () {
    it('should connect to a local MongoDB DB', (done) => {
        let database = new Database({
            dialect: 'mongodb',
            databaseName: 'test'
        });

        database.connectAndSync().then(() => done());
    });

    it('should create an encapsulated mongoose model', (done) => {
        let database = new Database({
            dialect: 'mongodb',
            databaseName: 'test'
        });

        let Users = database.model('users', {
            username: { type: Types.STRING },
            password: { type: Types.STRING }
        });

        expect(Users.create).to.be.a('function');
        expect(Users.findOne).to.be.a('function');
        expect(Users.findAll).to.be.a('function');
        expect(Users.remove).to.be.a('function');

        done();
    });

    it('should create an encapsulated mongoose model instance', (done) => {
        let database = new Database({
            dialect: 'mongodb',
            databaseName: 'test'
        });

        let Users = database.model('users', {
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
});
