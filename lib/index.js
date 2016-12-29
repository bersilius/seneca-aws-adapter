const AWS = require('aws-sdk')
const _ = require('lodash')

const pluginName = 'seneca-aws-adapter'

module.exports = function(options) {
    const seneca = this
    const services = {}
    services[options.service] = new AWS[options.service](options.serviceOptions)

    seneca.add(`init: ${pluginName}`, function(msg, respond) {
        seneca.log.info('init ' + pluginName)
        respond(null)
    })

    _.forEach(services[options.service].api.operations, function(value, operation) {
        seneca.add(`role: ${pluginName}, service: ${options.service}, cmd: ${operation}`, function(msg, respond) {
            seneca.log.info(`called => role: ${pluginName}, service: ${options.service}, cmd: ${operation}`)

            const params = msg.params || {}

            services[options.service][operation](params, function(error, data) {
                if (error) {
                    seneca.log.error(error, error.stack)
                    respond(error, null)
                } else {
                    seneca.log.debug(data)
                    respond(null, { response: data })
                }
            })
        })
    })

    return pluginName
}
