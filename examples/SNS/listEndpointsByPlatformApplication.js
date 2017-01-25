const seneca = require('seneca')()

seneca
    .client({
        type: 'http',
        port: '8000',
        host: 'localhost',
    })
    .ready(function() {
        seneca.act({
            role: 'aws',
            service: 'SNS',
            cmd: 'listEndpointsByPlatformApplication',
            params: {
                PlatformApplicationArn: /* Paste in your PlatformApplicationArn */'arn:aws:sns:us-west-2:546572276725:app/GCM/seneca-aws-adapter-sns-test'
            }
        }, function(error, result) {
            if (error) {
                seneca.log.error(error)
                return seneca.log.error(error)
            }

            seneca.log.info(result)
        })
    })
