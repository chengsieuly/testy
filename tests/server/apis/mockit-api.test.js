import request from 'supertest';
import fixture from '@/example/mockit/GET_200_bhakti.fixture';
import app from '@/example/server/server';

describe('Test the api path', () => {
    describe('GET', () => {
        test('respond with 200 and json', (done) => {
            request(app)
                .get('/mockit/api')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(done);
        });

        test('respond with store data', (done) => {
            request(app)
                .get('/mockit/api')
                .then(response => {
                    expect(response.body).toHaveProperty(
                        'activeFixtures',
                        'fixtures',
                        'latency',
                    );
                    done();
                });
        });

        test('respond with all available fixtures', (done) => {
            request(app)
                .get('/mockit/api')
                .then(response => {
                    expect(response.body.fixtures).toHaveLength(12);
                    response.body.fixtures.forEach(fixture => {
                        expect(fixture).toHaveProperty(
                            'id',
                            'description',
                            'method',
                            'status',
                            'url',
                        );
                    });
                    done();
                });
        });
    });

    describe('PUT', () => {
        test('respond with 200 and json', (done) => {
            request(app)
                .put('/mockit/api')
                .send({ id: 'GET_200_CHENG' })
                .expect(200)
                .expect('Content-Type', /json/)
                .end(done);
        });

        test('should be able to set another fixture as active', (done) => {
            request(app)
                .put('/mockit/api')
                .send({ id: 'GET_200_bhakti' })
                .then(response => {
                    expect(response.body.activeFixtures.GET['/api/test']).toEqual({
                        ...fixture,
                        handler: undefined,
                    });
                    done();
                });
        });

        test('should be able to set latency', (done) => {
            request(app)
                .put('/mockit/api')
                .send({ latency: 1000 })
                .then(response => {
                    expect(response.body.latency).toBe(1000);
                    done();
                });
        });
    });
});
