const seneca = require('seneca')()

const options = {
    service: 'SNS',
    serviceOptions: {
        region: 'us-west-2'
    }
}

seneca
    .use('../lib', options)
    .ready(function() {
        seneca.log.info('seneca-aws-adapter plugin init done')
        seneca.act('role:seneca-aws-adapter, service: SNS, cmd:listPlatformApplications', function(error, result) {
            seneca.log.info(result)
        })
    })
