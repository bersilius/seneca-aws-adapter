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
            cmd: 'createPlatformEndpoint',
            params: {
                PlatformApplicationArn: /* Paste in your PlatformApplicationArn */,
                Token: /* Paste in your Token */
            }
        }, function(error, result) {
            if (error) {
                seneca.log.error(error)
                return seneca.log.error(error)
            }

            seneca.log.info(result)
        })
    })
