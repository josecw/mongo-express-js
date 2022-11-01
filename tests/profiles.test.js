const { app } = require('../index');

const request = require('supertest');
const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;


describe('Operations on profiles', () => {
    let connection;

    beforeAll(async () => {
        connection = await MongoClient.connect(process.env.MONGO_URI);
    });

    afterAll(async () => {
        await connection.close();
    });

    it('POST /api/profiles : Create profile', async () => {
        const response = await request(app)
            .post('/api/profiles')
            .send(
                {
                    "org_id": "1",
                    "translate_language": "en",
                    "threshold": 8,
                    "service_providers": {
                        "USE_BAIDU": true,
                        "USE_BING": true,
                        "USE_YAHOO": true,
                        "USE_GOOGLE": true,
                    }
                }
            );

        expect(response.status).to.eql(200);
        expect(response.body).to.have.property('org_id', '1');
    });

    it('GET /api/profiles/1 : Retrieve profile with org_id', async () => {
        const response = await request(app)
            .get('/api/profiles/1')
            .set({ 'Content-Type': 'application/json' });

        expect(response.status).to.eql(200);
        expect(response.body).to.have.property('org_id', '1');
        expect(response.body).to.have.property('translate_language', 'en');
        expect(response.body).to.have.property('threshold', 8);
        expect(response.body).to.have.property('service_providers');
        expect(response.body).to.deep.nested.property('service_providers.USE_GOOGLE', true);
        expect(response.body).to.deep.nested.property('service_providers.USE_YAHOO', true);
        expect(response.body).to.deep.nested.property('service_providers.USE_BAIDU', true);
        expect(response.body).to.deep.nested.property('service_providers.USE_BING', true);
    });

    it('POST /api/profiles/1 : Update profile with org_id', async () => {
        let response = await request(app)
            .post('/api/profiles/1')
            .set({ 'Content-Type': 'application/json' })
            .send(
                {
                    "org_id": "1",
                    "translate_language": "jp",
                    "threshold": 9,
                    "service_providers": {
                        "USE_BAIDU": false,
                        "USE_BING": false,
                        "USE_YAHOO": true,
                        "USE_GOOGLE": true,
                    }
                }
            );

        expect(response.status).to.eql(200);

        response = await request(app)
            .get('/api/profiles/1')
            .set({ 'Content-Type': 'application/json' });
        
            expect(response.status).to.eql(200);
        expect(response.body).to.have.property('org_id', '1');
        expect(response.body).to.have.property('translate_language', 'jp');
        expect(response.body).to.have.property('threshold', 9);
        expect(response.body).to.have.property('service_providers');
        expect(response.body).to.deep.nested.property('service_providers.USE_GOOGLE', true);
        expect(response.body).to.deep.nested.property('service_providers.USE_YAHOO', true);
        expect(response.body).to.deep.nested.property('service_providers.USE_BAIDU', false);
        expect(response.body).to.deep.nested.property('service_providers.USE_BING', false);
    });

    it('DELETE /api/profiles/1 : Delete profile with org_id', async () => {
        const response = await request(app)
            .delete('/api/profiles/1')
            .set({ 'Content-Type': 'application/json' });

        expect(response.status).to.eql(200);
    });

    it('GET /api/profiles/1 : Retrieve profile with unknown org_id', async () => {
        const response = await request(app)
            .get('/api/profiles/1')
            .set({ 'Content-Type': 'application/json' });

        expect(response.status).to.eql(204);
    });

});