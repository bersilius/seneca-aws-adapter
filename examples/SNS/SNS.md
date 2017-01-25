# Preparation steps for setting up AWS services

Example Seneca microservice [see sns.js](https://github.com/bersilius/seneca-aws-adapter/examples/SNS/sns.js) in this repository.

## AWS SNS service

Sign up or log in with your account at [AWS Console](https://console.aws.amazon.com)

### Set up AWS SNS service

After you log in you can choose which AWS service you want use. On the navigation bar (top left) there is a services dropdown menu. In this menu choose 'SNS' to enable the notification service.

Before going further, you will have to have access keys and IDs to configure your microservice.

The practice is that you create "users" ("groups" and "roles" as well if you want) for using an enabled service. This is for your own sake. You do not want to accidentally expose your root access key(s). And it is "easier" to just delete a user, than reset your own access information and changing it everywhere else you used it before. This is because you can use many services with one or many users, so it makes it easier to manage access rights for your individual microservices or even for your collaborators. 

You will use AWS IAM service to manage access rights. See [GENERAL](https://github.com/bersilius/seneca-aws-adapter/blob/master/examples/GENERAL.md) info in this repository for basic instructions.

If you already have the accessKeyId and secretAccessKey or just obtained a new set, basically you are ready to use the seneca-aws-adapter.

### Some of the important options are:

accessKeyId // your AWS access key ID.
secretAccessKey // your AWS access key
region // the region you have chosen for your service

In this example we load the plugin with the 'options' object for using AWS SNS service. Optionally we will use built in seneca-transport to listen for incoming messages. Your microservice is ready to process commands, like:

```
Creates an endpoint for a device and mobile app on one of the supported push notification services, such as GCM and APNS.
'role:aws,service:SNS,cmd:createPlatformEndpoint,params:{...}'

Lists the endpoints and endpoint attributes for devices in a supported push notification service, such as GCM and APNS.
'role:aws,service:SNS,cmd:listEndpointsByPlatformApplication,params:{...}'

Sends a message to a specific endpoint or to all of a topic's subscribed endpoints.
'role:aws,service:SNS,cmd:publish,params:{...}'
```

See [aws-sdk SNS documentation](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html) for available SNS API commands and parameters.

### Usage:

```javascript
const seneca = require('seneca')()

const options = {
    service: 'SNS',
    serviceParams: {
        region: process.env.SNS_REGION,
        accessKeyId: process.env.SNS_ACCESS_KEY_ID,
        secretAccessKey: process.env.SNS_SECRET_ACCESS_KEY
    }
}

seneca
    .use('../../lib', options)
    .listen({
        type: 'http',
        port: '8000',
        host: 'localhost',
    })
    .ready(function() {
        seneca.log.info('seneca-aws-adapter plugin init done')
    })
```

## Options details:

If you use aws-sdk for SNS service you might do it this way:

```javascript
const options = {}
const aws = require('aws-sdk')
const sns = aws.SNS(options)
```

You can find details of the available options in the aws-sdk SNS documentation at [Constructor Details](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#constructor-property)

