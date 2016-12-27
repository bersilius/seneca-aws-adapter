# seneca-aws-adapter

[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Coveralls][BadgeCoveralls]][Coveralls]

This is a seneca plugin

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
    seneca.use('{plugin_name}}', /* options... */ )
```

### Options

There are no options for this plugin.


### Actions

All actions provide results via the standard callback format: `function(error,data){ ... }`.

#### role: seneca-aws-adapter, cmd: TBD

TBD

_Parameters:_

- `payload`: ???

_Response:_ 

- None


## References

- [Seneca.js](http://senecajs.org/)
- [How to Write a Seneca Plugin](http://senecajs.org/docs/tutorials/how-to-write-a-plugin.html)

---

This project was generated from the [seneca-plugin-archetype](https://github.com/tombenke/seneca-plugin-archetype)
by the [kickoff](https://github.com/tombenke/kickoff) utility.

[npm-badge]: https://badge.fury.io/js/seneca-aws-sns.svg
[npm-url]: https://badge.fury.io/js/seneca-aws-sns
[travis-badge]: https://api.travis-ci.org/bersilius/seneca-aws-sns.svg
[travis-url]: https://travis-ci.org/bersilius/seneca-aws-sns
[Coveralls]: https://coveralls.io/github/bersilius/seneca-aws-sns?branch=master
[BadgeCoveralls]: https://coveralls.io/repos/github/bersilius/seneca-aws-sns/badge.svg?branch=master

