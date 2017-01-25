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
            service: 'S3',
            cmd: 'listObjects',
            params: {
                Bucket: /* Paste in your Bucket name */ 'seneca-aws-adapter'
            }
        }, function(error, result) {
            if (error) {
                seneca.log.error(error)
                return seneca.log.error(error)
            }

            seneca.log.info(result)
        })
    })
