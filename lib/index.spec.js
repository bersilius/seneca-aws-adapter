const fs = require('fs')
const expect = require('chai').expect
const seneca = require('seneca')({ log: { level: 'warn+' } })
const plugin = require('./index')
const nock = require('nock')

const snsResponse = fs.readFileSync('./fixtures/SNS/listPlatformApplications.xml', 'utf-8')
const snsErrorResponse = fs.readFileSync('./fixtures/SNS/invalidToken.xml', 'utf-8')
const s3Response = fs.readFileSync('./fixtures/S3/listObjects.xml', 'utf-8')
const s3ErrorResponse = fs.readFileSync('./fixtures/S3/invalidAccessKeyId.xml', 'utf-8')

const pluginName = 'seneca-aws-adapter'

const optionsSNS = {
    service: 'SNS',
    serviceParams: {
        region: 'us-west-2',
        accessKeyId: 'myAWSaccessKeyId',
        secretAccessKey: 'myAWSsecretAccessKey'
    }
}

const optionsS3 = {
    service: 'S3',
    serviceParams: {
        accessKeyId: 'myAWSaccessKeyId',
        secretAccessKey: 'myAWSsecretAccessKey'
    }
}

before(function(done) {
    nock('https://sns.us-west-2.amazonaws.com', {'encodedQueryParams': true})
        .post('/', 'Action=ListPlatformApplications&Version=2010-03-31')
        .reply(200, snsResponse, [
            'x-amzn-RequestId',
            '205c0000-4009-5007-a008-d29b01b90000',
            'Content-Type',
            'text/xml',
            'Content-Length',
            '613',
            'Date',
            'Mon, 26 Dec 2016 16:40:32 GMT'
        ])
    nock('https://sns.us-west-2.amazonaws.com', {'encodedQueryParams': true})
        .post('/', 'Action=ListPlatformApplications&Version=2010-03-31')
        .reply(400, snsErrorResponse, [
            'x-amzn-RequestId',
            '205c0000-4009-5007-a008-d29b01b90000',
            'Content-Type',
            'text/xml',
            'Content-Length',
            '613',
            'Date',
            'Mon, 26 Dec 2016 16:40:32 GMT'
        ])

    nock('https://bucket.s3.amazonaws.com', {'encodedQueryParams': true})
        .get('/')
        .reply(200, s3Response, [
            'x-amz-bucket-region',
            'us-east-1',
            'x-amz-request-id',
            '2FA83FBACB4EEFEE',
            'x-amz-id-2',
            '5qzlMjIqBtQVPsEowTE0uvUOxd2+ONbepvvRAMnDCPy45YHney4MP3eg6I87bU+ib0VaRSKcBpc=',
            'Content-Type',
            'application/xml',
            'Transfer-Encoding',
            'chunked',
            'Date',
            'Wed, 28 Dec 2016 15:13:43 GMT',
            'Server',
            'AmazonS3'
        ])
    nock('https://bucket.s3.amazonaws.com', {'encodedQueryParams': true})
        .get('/')
        .reply(403, s3ErrorResponse, [
            'x-amz-bucket-region',
            'us-east-1',
            'x-amz-request-id',
            'AD425EA656FC3727',
            'x-amz-id-2',
            'zRwdoC0Z3x9RL4gdHyDADsvfk0jMmXJrWh5Mq70214LqbM27TKTH3AtyjkjmyoJk6w/CzmEbkgY=',
            'Content-Type',
            'application/xml',
            'Transfer-Encoding',
            'chunked',
            'Date',
            'Thu, 29 Dec 2016 08:40:33 GMT',
            'Server',
            'AmazonS3'
        ])

    this.seneca = seneca
        .use(plugin, optionsSNS)
        .use(plugin, optionsS3)
        .ready(function() {
            done()
        })
})

after(function() {
    seneca.act('role:seneca,cmd:close')
})

describe(`${pluginName}`, function() {
    it('SNS - listPlatformApplications', function(done) {
        seneca.act(`role: 'aws', service: SNS, cmd: listPlatformApplications`, function(err, data) {
            seneca.log.info('response to listPlatformApplications:', err, data)
            if (err === null) {
                expect(data.response).to.have.property('ResponseMetadata')
                expect(data.response).to.have.property('PlatformApplications')
                done(err)
            }
        })
    })

    it('S3 - listObjects', function(done) {
        const params = { Bucket: 'bucket' }

        seneca.act({ role: 'aws', service: 'S3', cmd: 'listObjects', params: params }, function(err, data) {
            seneca.log.info('response to listObjects:', err, data)
            if (err === null) {
                expect(data.response).to.have.property('Name', 'bucket')
                expect(data.response).to.have.property('Contents')
                done(err)
            }
        })
    })

    it('SNS - listPlatformApplications - Error', function(done) {
        seneca.act(`role: 'aws', service: SNS, cmd: listPlatformApplications`, function(err, data) {
            seneca.log.info('response to listPlatformApplications:', err, data)
            if (data === null) {
                expect(err).to.have.property('eraro', true)
                expect(err).to.have.property('requestId')
                done()
            }
        })
    })

    it('S3 - listObjects - Error', function(done) {
        const params = { Bucket: 'bucket' }

        seneca.act({ role: 'aws', service: 'S3', cmd: 'listObjects', params: params }, function(err, data) {
            seneca.log.info('response to listObjects:', err, data)
            if (data === null) {
                expect(err).to.have.property('eraro', true)
                expect(err).to.have.property('requestId')
                done()
            }
        })
    })
})
