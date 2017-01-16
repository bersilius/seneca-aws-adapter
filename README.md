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

## Usage

To load the plugin:

```JavaScript
    seneca.use('seneca-aws-adapter', /* options... */ )
```

### Options - SNS example

```JavaScript
    const options = {
        service: 'SNS',
        serviceOptions: {
            accessKeyId: 'accessKeyIdProvidedBySNS',
            secretAccessKey: 'secretAccessKeyProvidedBySNS',
            region: 'us-west-2'
        }
    }
```
The 'service' key stand for AWS service name like SNS, S3, etc. It has to be the same as the key when you normally instantiate a new AWS object with aws-sdk, like:

```JavaScript
    const sns = new AWS.SNS(/*serviceOptions*/)
```

The service options can be the same as the params you use with the aws-sdk. See the Constructor Details of the given service you use in [AWS SDK for JavaScript Docs](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/_index.html).

You can initialize the plugin multiple times, so you can use multiple services at the same time.

```JavaScript
    seneca
        .use('seneca-aws-adapter', { service: 'SNS', serviceOptions: optionsSNS )
        .use('seneca-aws-adapter', { service: 'S3', serviceOptions: optionsS3 )
```

### Actions - examples

All AWS service operations can be called like Seneca actions. All actions provide results via the standard callback format: `function(error, data){ ... }`.

#### role: seneca-aws-adapter, service: SNS, cmd: listPlatformApplications

List all Platform Applications managed by the AWS SNS Service.

_Parameters:_

- `params`: {...}

See the Method Details of the given service operation you use in [AWS SDK for JavaScript Docs](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/_index.html).

_Response:_ 

```JavaScript
    { response: data } // data is an object contains the AWS service response
```

See the Method Details of the given service operation you use in [AWS SDK for JavaScript Docs](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/_index.html).

TODO: include in tests

#### role: seneca-aws-adapter, service: S3, cmd: getObject

Get object by id from an AWS S3 Bucket.

...

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

