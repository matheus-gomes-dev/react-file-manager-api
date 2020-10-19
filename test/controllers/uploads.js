const request = require('supertest');
const sinon = require('sinon');

const app = require('../../app');
const utils = require('../../utils');
const UploadsModel = require('../../models/Uploads');
const UploadedDataModel = require('../../models/UploadedData');

describe('Uploads', () => {

  let UploadsFindAndCountAllStub;
  let UploadsFindByPkStub;
  let UploadsCreateStub;
  let UploadedDataBulkCreateStub;
  let utilsParseCSVStub;

  before(() => {
    UploadsFindAndCountAllStub = sinon.stub(UploadsModel, 'findAndCountAll');
    UploadsFindByPkStub = sinon.stub(UploadsModel, 'findByPk');
    UploadsCreateStub = sinon.stub(UploadsModel, 'create');
    utilsParseCSVStub = sinon.stub(utils, 'parseCSVFile');
    UploadedDataBulkCreateStub = sinon.stub(UploadedDataModel, 'bulkCreate');
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
      UploadsFindByPkStub.resolves({ id: 'fake-upload-id-0' });
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
          sinon.assert.calledWith(UploadsFindByPkStub, '1', { include: { association: 'uploaded_data' }});
        })
        .end(function(err, _) {
          if (err) return done(err);
          done();
        });
    });
  
    it('should return 404 if not found', (done) => {
      UploadsFindByPkStub.resolves();
      request(app)
        .get('/uploads/1')
        .expect(404, { message: 'Upload not found' })
        .end(function(err, _) {
          if (err) return done(err);
          done();
        });
    });
  
    it('should return status 500 if fails to read by id from database', (done) => {
      UploadsFindByPkStub.rejects({ error: 'fake-error' });
      request(app)
        .get('/uploads/1')
        .expect(500, { message: 'Failed to read upload by id' })
        .end(function(err, _) {
          if (err) return done(err);
          done();
        });
    });

  });

  describe('create', () => {

    beforeEach(() => {
      UploadsCreateStub.resolves({ id: 'fake-upload-id-0' });
      UploadedDataBulkCreateStub.resolves();
      utilsParseCSVStub.resolves([
        {
          'Yard Code': 'yard-0',
          'Employee Code': 'employee-0',
          'Clock In': '2018-09-24 10:00:00',
          'Clock Out': '2018-09-24 18:00:00'
        },
        {
          'Yard Code': 'yard-1',
          'Employee Code': 'employee-1',
          'Clock In': '2018-09-24 10:00:00',
          'Clock Out': '2018-09-24 18:00:00'
        },
      ]);
    });

    it('should return status 400 if no file was provided', (done) => {
      request(app)
        .post('/uploads')
        .expect(400, { message: 'No file provided' })
        .end(function(err, _) {
          if (err) return done(err);
          done();
        });
    });

    it('should add a new record to uploads table', (done) => {
      request(app)
        .post('/uploads')
        .attach('file', 'test/example.csv')
        .field('fileName', 'fake-name')
        .expect(() => {
          sinon.assert.calledWith(UploadsCreateStub, { name: 'fake-name' });
        })
        .end(function(err, _) {
          if (err) return done(err);
          done();
        });
    });

    it(`should parse data read from file correctly, associating it
    with stored uploaded id and saving it`, (done) => {
      request(app)
        .post('/uploads')
        .attach('file', 'test/example.csv')
        .field('fileName', 'fake-name')
        .expect(() => {
          sinon.assert.calledWith(UploadedDataBulkCreateStub, [{
            clock_in: "2018-09-24 10:00:00",
            clock_out: "2018-09-24 18:00:00",
            employee_code: "employee-0",
            file_row: 0,
            upload_id: "fake-upload-id-0",
            yard_code: "yard-0"
          }, {
            clock_in: "2018-09-24 10:00:00",
            clock_out: "2018-09-24 18:00:00",
            employee_code: "employee-1",
            file_row: 1,
            upload_id: "fake-upload-id-0",
            yard_code: "yard-1"
          }]);
        })
        .end(function(err, _) {
          if (err) return done(err);
          done();
        });
    });

    it('should return status 200 with uploaded file result', (done) => {
      request(app)
        .post('/uploads')
        .attach('file', 'test/example.csv')
        .field('fileName', 'fake-name')
        .expect(200, { id: 'fake-upload-id-0' })
        .end(function(err, _) {
          if (err) return done(err);
          done();
        });
    });

    it('should return status 500 if database fails to save', (done) => {
      UploadsCreateStub.rejects({ error: 'fake-error' });
      request(app)
        .post('/uploads')
        .attach('file', 'test/example.csv')
        .field('fileName', 'fake-name')
        .expect(500, { message: 'Failed to store upload' })
        .end(function(err, _) {
          if (err) return done(err);
          done();
        });
    });

  });

  after(() => {
    UploadsFindAndCountAllStub.restore();
    UploadsFindByPkStub.restore();
    UploadsCreateStub.restore();
    utilsParseCSVStub.restore();
    UploadedDataBulkCreateStub.restore();
  });

});
