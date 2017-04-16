process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const Database = require('../lib/database');
const ModelFactory = require('../lib/model-factory');
const Types = require('../lib/types');

describe('MySQL adapter', function () {
    it('should connect to a local MySQL DB', (done) => {
        ModelFactory.clearInstances();

        Database.create({
            dialect: 'mysql',
            databaseName: 'test',
            username: 'root',
            password: 'root'
        }).connectAndSync().then(() => done());
    });

    it('should create an encapsulated sequelize model', (done) => {
        let Users = ModelFactory.model('users', {
            username: { type: Types.STRING },
            password: { type: Types.STRING }
        });

        expect(Users.create).to.be.a('function');
        expect(Users.findOne).to.be.a('function');
        expect(Users.findAll).to.be.a('function');
        expect(Users.remove).to.be.a('function');

        done();
    });

    it('should create an encapsulated sequelize model instance', (done) => {
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
});
