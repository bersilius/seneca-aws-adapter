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
            cmd: 'publish',
            params: {
                Message: JSON.stringify({"GCM": "{ \"data\": { \"message\": \"Sent by using seneca-aws-adapter.\" } }"}),
                MessageStructure: 'json',
                TargetArn: /* Paste in your TargetArn */
            }
        }, function(error, result) {
            if (error) {
                seneca.log.error(error)
                return seneca.log.error(error)
            }

            seneca.log.info(result)
        })
    })
