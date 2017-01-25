# seneca-aws-adapter

[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Coveralls][BadgeCoveralls]][Coveralls]

This is a seneca plugin that maps AWS Service operations provided by the aws-sdk to Seneca actions. So the aws-sdk itself can be used as a Seneca plugin. When you instantiate the plugin or call any service operation you can use the same parameters as you would use with the aws-sdk.

## Installation

Run the install command:

    npm install

Run tests:

    npm test

To obtain coverage, run:

    npm coverage

------

## Usage

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
        }
    }
```
The 'service' key stand for AWS service API name like SNS, S3, etc. It has to be the same as the key when you normally instantiate a new AWS object with aws-sdk, like:

```javaScript
    const sns = new AWS.SNS(/* serviceParams */)
    // or
    const s3 = new AWS.S3(/* serviceParams */)
    
    // like between the arrows
    //const sns = new AWS.--->SNS<---(/* serviceParams */)
```

This way you can initialize the plugin multiple times, so you can use multiple AWS services with the same Seneca instance.

```javaScript
    seneca
        .use('seneca-aws-adapter', { service: 'SNS', serviceParams: paramsSNS )
        .use('seneca-aws-adapter', { service: 'S3', serviceParams: paramsS3 )
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

### Actions - examples

All AWS service operations can be called like Seneca actions. All actions provide results via the standard callback format: `function(error, data){ ... }`.

For available commands and the corresponding params see the Method Details of the given service operation you use in [AWS SDK for JavaScript Docs](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/_index.html).

#### role: aws, service: SNS, cmd: listPlatformApplications, params: ...

List all Platform Application Endpoint managed by the AWS SNS Service.

```
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

```
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

In this example the service's JSON response has a property called 'Endpoints'. It is an array of objects, containing details about the available 'endpoints'.

## References

- [Seneca.js](http://senecajs.org/)
- [How to Write a Seneca Plugin](http://senecajs.org/docs/tutorials/how-to-write-a-plugin.html)
- [AWS SDK for JavaScript - Alphabetic Index](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/_index.html)

---

This project was generated from the [seneca-plugin-archetype](https://github.com/tombenke/seneca-plugin-archetype)
by the [kickoff](https://github.com/tombenke/kickoff) utility.

[npm-badge]: https://badge.fury.io/js/seneca-aws-sns.svg
[npm-url]: https://badge.fury.io/js/seneca-aws-sns
[travis-badge]: https://api.travis-ci.org/bersilius/seneca-aws-sns.svg
[travis-url]: https://travis-ci.org/bersilius/seneca-aws-sns
[Coveralls]: https://coveralls.io/github/bersilius/seneca-aws-sns?branch=master
[BadgeCoveralls]: https://coveralls.io/repos/github/bersilius/seneca-aws-sns/badge.svg?branch=master
