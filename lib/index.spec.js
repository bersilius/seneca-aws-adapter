const fs = require('fs')
const expect = require('chai').expect
const seneca = require('seneca')(/*{ log: { level: 'warn+' } }*/)
const plugin = require('./index')
const nock = require('nock')
const AWS = require('aws-sdk')

const response = fs.readFileSync('./fixtures/SNS/listPlatformApplications.xml', 'utf-8')

const pluginName = "seneca-aws-adapter"
const options = {
    service: 'SNS',
    serviceOptions: {
        region: 'us-west-2',
        accessKeyId: 'myAWSaccessKeyId',
        secretAccessKey: 'myAWSsecretAccessKey'
    }
}

before(function(done) {
    nock('https://sns.us-west-2.amazonaws.com', {"encodedQueryParams":true})
        .post('/', "Action=ListPlatformApplications&Version=2010-03-31")
        .reply(200, response, [
            'x-amzn-RequestId',
            '205c0000-4009-5007-a008-d29b01b90000',
            'Content-Type',
            'text/xml',
            'Content-Length',
            '613',
            'Date',
            'Mon, 26 Dec 2016 16:40:32 GMT'
        ])
    this.seneca = seneca
        .use(plugin, options)
        .ready(function() {
            done()
        })
})

after(function() {
    seneca.act('role:seneca,cmd:close')
})

describe(`${pluginName}`, function() {
    it('listPlatformApplications', function(done) {
        seneca.act(`role: ${pluginName}, service: SNS, cmd: listPlatformApplications`, function(err, data) {
            seneca.log.info('response to listPlatformApplications:', err, data)
            if (err === null) {
                expect(data.response).to.have.property('ResponseMetadata')
                expect(data.response).to.have.property('PlatformApplications')
                done(err)
            }
        })
    })
})
