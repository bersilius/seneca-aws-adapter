const seneca = require('seneca')()

// Set your options
const options = {
    service: 'S3',
    serviceParams: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
}

seneca
    // Load the plugin with options
    .use('../../lib', options)
    // Optional: use a transport layer (HTTP in this case)
    .listen({
        type: 'http',
        port: '8000',
        host: 'localhost',
    })
    .ready(function() {
        // Your microservice is now up and waiting actions.
        seneca.log.info('seneca-aws-adapter plugin init done')
    })
