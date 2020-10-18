const request = require('supertest');
const sinon = require('sinon');

const app = require('../../app');
const UploadsModel = require('../../models/Uploads');
const UploadedDataModel = require('../../models/UploadedData');

describe('Uploads', () => {

  let UploadsFindAndCountAllStub;
  let UploadsFindByPk;
  let UploadedDataModel;

  before(() => {
    UploadsFindAndCountAllStub = sinon.stub(UploadsModel, 'findAndCountAll');
    UploadsFindByPk = sinon.stub(UploadsModel, 'findByPk');
  });

  describe('read', () => {

    beforeEach(() => {
      UploadsFindAndCountAllStub.resolves([{ id: 'fake-upload-id-0' }]);
    });

    it('should return status 200 with results', (done) => {
      request(app)
        .get('/uploads')
        .expect(200, [{
          id: 'fake-upload-id-0'
        }])
        .end(function(err, _) {
          if (err) return done(err);
          done();
        });
    });

    it('should query first page by default, with limit = 10', (done) => {
      request(app)
        .get('/uploads')
        .expect(() => {
          sinon.assert.calledWith(UploadsFindAndCountAllStub, { limit: 10, offset: 0 });
        })
        .end(function(err, _) {
          if (err) return done(err);
          done();
        });
    });

    it('should query with correct pagination parameters', (done) => {
      request(app)
        .get('/uploads?page=3')
        .expect(() => {
          sinon.assert.calledWith(UploadsFindAndCountAllStub, { limit: 10, offset: 20 });
        })
        .end(function(err, _) {
          if (err) return done(err);
          done();
        });
    });

    it('should return status 500 if fails to read from database', (done) => {
      UploadsFindAndCountAllStub.rejects({ error: 'fake-error' });
      request(app)
        .get('/uploads')
        .expect(500, { message: 'Failed to read uploads' })
        .end(function(err, _) {
          if (err) return done(err);
          done();
        });
    });

  });

  describe('readById', () => {

    beforeEach(() => {
      UploadsFindByPk.resolves({ id: 'fake-upload-id-0' });
    });

    it('should return status 200 with result', (done) => {
      request(app)
        .get('/uploads/1')
        .expect(200, { id: 'fake-upload-id-0' })
        .end(function(err, _) {
          if (err) return done(err);
          done();
        });
    });
  
    it('should query by id and associate uploaded data', (done) => {
      request(app)
        .get('/uploads/1')
        .expect(() => {
          sinon.assert.calledWith(UploadsFindByPk, '1', { include: { association: 'uploaded_data' }});
        })
        .end(function(err, _) {
          if (err) return done(err);
          done();
        });
    });
  
    it('should return 404 if not found', (done) => {
      UploadsFindByPk.resolves();
      request(app)
        .get('/uploads/1')
        .expect(404, { message: 'Upload not found' })
        .end(function(err, _) {
          if (err) return done(err);
          done();
        });
    });
  
    it('should return status 500 if fails to read by id from database', (done) => {
      UploadsFindByPk.rejects({ error: 'fake-error' });
      request(app)
        .get('/uploads/1')
        .expect(500, { message: 'Failed to read upload by id' })
        .end(function(err, _) {
          if (err) return done(err);
          done();
        });
    });

  });

  after(() => {
    UploadsFindAndCountAllStub.restore();
  });

});
