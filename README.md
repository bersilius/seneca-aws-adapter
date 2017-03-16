# seneca-aws-adapter

[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Coveralls][BadgeCoveralls]][Coveralls]

This is a Seneca plugin that maps AWS Service operations provided by the aws-sdk to Seneca actions. So the aws-sdk itself can be used as a Seneca plugin. When you instantiate the plugin or call any service operation you can use the same parameters as you would use with the aws-sdk.

Under the hood, upon initialization this plugin creates a new object using the aws-sdk. This object provided by aws-sdk has the methods that are actually API functions for a specific AWS service operation. The plugin then maps these functions to Seneca message patterns by adding Seneca message handlers for each aws-sdk service method. This way with the help of Seneca and this plugin, you can call aws-sdk methods easily by calling a Seneca action with a given pattern from anywhere of your system. Even from a physically remote instance.

------

## Installation

Run the install command:

    npm install --save seneca-aws-adapter

Run tests:

    npm test

To obtain coverage, run:

    npm coverage

------

## Usage

Here you can find general info about initialization and some action examples. Also check the [examples](https://github.com/bersilius/seneca-aws-adapter/tree/master/examples) folder for more use cases.

To load the plugin:

```javaScript
    seneca.use('seneca-aws-adapter', /* options */ )
```

### Options - SNS example

```javaScript
    const options = {
        service: 'SNS',
        serviceParams: {
            accessKeyId: 'accessKeyIdProvidedBySNS',
            secretAccessKey: 'secretAccessKeyProvidedBySNS',
            region: 'us-west-2'
        },
        awsEventListeners: {
            complete: function(resp) {
                // ... listener logic on "complete" event
            }
        }
    }
```
The 'service' property stands for AWS service API name like SNS, S3, etc. It has to be the same as the AWS object's property key when you normally instantiate a new AWS object with aws-sdk, like:

```javaScript
    // Default aws-sdk way
    const sns = new AWS.SNS(/* serviceParams */)
    // or
    const s3 = new AWS.S3(/* serviceParams */)
    
    // like between the arrows
    //const sns = new AWS.--->SNS<---(/* serviceParams */)
```

This way you can initialize the plugin multiple times, so you can use multiple AWS services with the same Seneca instance.

```javaScript
    seneca
        .use('seneca-aws-adapter', { service: 'SNS', serviceParams: paramsSNS })
        .use('seneca-aws-adapter', { service: 'S3', serviceParams: paramsS3, awsEventListeners: { ... } })
```

Maybe you want to gather information from one or more AWS services and save those as a text log in an S3 bucket.

------

```javaScript
serviceParams: {
    accessKeyId: 'accessKeyIdProvidedBySNS',
    secretAccessKey: 'secretAccessKeyProvidedBySNS',
    region: 'us-west-2'
}
```

The 'serviceParams' can be used the same way as the 'params' you use with the aws-sdk. Usually here you set configuration (credentials, API version, httpOptions, etc.) params for the service. See the Constructor Details of the given service you use in [AWS SDK for JavaScript Docs](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/_index.html).

------

With aws-sdk you can define event listeners on the main AWS object. These listeners are applied to every request.

```javaScript
const AWS = require('aws-sdk')

AWS.events.on('complete', function(resp) { ... })
```

When you initiate the plugin, you can define those listener functions in the plugin init options object's 'awsEventsListeners' property. This is an object which keys stands for the event name and values are the actual listener functions you define. The above example would look like this:

```javaScript
{
    service: '...',
    serviceParams: { ... },
    awsEventListeners: {
        complete: function(resp) { ... },
        // ... more event listeners
    }
}
```

You can define 'error' and 'success' event listeners as well, but if you want to use the plugin for asynchronous tasks, see Async examples more below.

See [aws-sdk AWS.Request documentation](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Request.html) for available events and details.

### Actions - examples

Looking at some message patterns we can probably guess which AWS service operation will be triggered with the given params:

- *'role:aws,service:S3,cmd:listBuckets,params:{...}'*
- *'role:aws,service:EC2,cmd:startInstances,params:{...}'*
- *'role:aws,service:IAM,cmd:createUser,params:{...}'*
- *'role:aws,service:SNS,cmd:createPlatformEndpoint,params:{...}'*

All AWS service operations can be called like Seneca actions. All actions provide results via the standard callback format: `function(error, data){ ... }`. Using standard callback format fit aws-sdk and Seneca as well.

For available commands and the corresponding 'params' see the Method Details of the given service operation you use in [AWS SDK for JavaScript Docs](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/_index.html).

#### role: aws, service: SNS, cmd: listPlatformApplications, params: ...

List all Platform Application Endpoint managed by the AWS SNS Service.

```javaScript
seneca.act({
    role: 'aws',
    service: 'SNS',
    cmd: 'listEndpointsByPlatformApplication',
    params: {
        PlatformApplicationARN: 'arn:aws:sns:us-west-2:123456789012:app/GCM/gcmpushapp'
    }
}, function(error, result) {
    // Handle result or error
})
```

_Response:_ 

The 'response' property's value is the actual JSON response from the AWS SNS service.

```javaScript
{"response": actualSNSServiceResponse }
```

In this example the service's JSON response has a property called 'Endpoints'. It is an array of objects, containing details about the available 'endpoints'.

------

#### role: aws, service: S3, cmd: getObject, params: ...

Get object by unique 'Key' from an AWS S3 'Bucket'.

```javaScript
seneca.act({
    role: 'aws',
    service: 'S3',
    cmd: 'getObject',
    params: {
        Bucket: 'BucketName',
        Key: 'ObjectKey'
    }
}, function(error, result) {
    // Handle result or error
})
```

_Response:_ 

The 'response' property's value is the actual JSON response from the AWS S3 service.

```javaScript
{"response": actualS3ServiceResponse }
```

In this example the service's JSON response has a property called 'Body'. It may be Buffer, Typed Array, Blob, String, ReadableStream, the actual data in the 'object'.

### Async examples

You can use aws-sdk requests in asynchronous mode. In that case you define the listeners, like 'error', 'success', etc. This plugin can also be used for async tasks. When you call any action, you can define your custom event listeners in the "sub_message" object's 'eventListeners' property.

Please note that in this case the plugin action call will return immediately after the AWS request has been sent. So it is important to define at least an 'error' AND a 'success' listener! Which you would probably do anyway...

For example:

```javaScript
seneca.act({
    role: 'aws',
    service: 'S3',
    cmd: 'getObject',
    params: {
        Bucket: 'BucketName',
        Key: 'ObjectKey'
    },
    eventListeners: {
        success: function(resp) { ... },
        error: function(err) { ... }
        // ...
    }
}, function(error, result) {
    // Action returns immediately after AWS request has been sent.
    // This AWS request's success or error will be handled by event listeners.
})
```

## References

- [Seneca.js](http://senecajs.org/)
- [How to Write a Seneca Plugin](http://senecajs.org/docs/tutorials/how-to-write-a-plugin.html)
- [AWS SDK for JavaScript - Alphabetic Index](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/_index.html)

---

This project was generated from the [seneca-plugin-archetype](https://github.com/tombenke/seneca-plugin-archetype)
by the [kickoff](https://github.com/tombenke/kickoff) utility.

[npm-badge]: https://badge.fury.io/js/seneca-aws-adapter.svg
[npm-url]: https://badge.fury.io/js/seneca-aws-adapter
[travis-badge]: https://api.travis-ci.org/bersilius/seneca-aws-adapter.svg
[travis-url]: https://travis-ci.org/bersilius/seneca-aws-adapter
[Coveralls]: https://coveralls.io/github/bersilius/seneca-aws-adapter?branch=master
[BadgeCoveralls]: https://coveralls.io/repos/github/bersilius/seneca-aws-adapter/badge.svg?branch=master
