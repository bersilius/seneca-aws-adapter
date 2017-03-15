const AWS = require('aws-sdk')
const _ = require('lodash')

const pluginName = 'seneca-aws-adapter'

module.exports = function(options) {
    const seneca = this
    const services = {}

    services[options.service] = new AWS[options.service](options.serviceParams)

    seneca.add(`init: ${pluginName}`, function(msg, respond) {
        seneca.log.info('init ' + pluginName)
        respond(null)
    })

    if (options.awsEventListeners) {
        _.forEach(options.awsEventListeners, function(listener, event) {
            AWS.events.on(event, listener)
        })
    }

    _.forEach(services[options.service].api.operations, function(value, operation) {
        seneca.add(`role: aws, service: ${options.service}, cmd: ${operation}`, function(msg, respond) {
            seneca.log.info(`called => role: aws, service: ${options.service}, cmd: ${operation}`)

            const params = msg.params || {}

            if (msg.eventListeners) {
                const request = services[options.service][operation](params)

                _.forEach(msg.eventListeners, function(listener, event) {
                    request.on(event, function(resp) {
                        listener(resp)
                    })
                })

                request.send()
                respond(null, {})
            } else {
                services[options.service][operation](params, function(error, data) {
                    if (error) {
                        seneca.log.error(error, error.stack)
                        respond(error, null)
                    } else {
                        seneca.log.debug(data)
                        respond(null, { response: data })
                    }
                })
            }
        })
    })

    return pluginName
}
