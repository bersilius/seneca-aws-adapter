const AWS = require('aws-sdk')
const _ = require('lodash')

const pluginName = 'seneca-aws-adapter'

module.exports = function(options) {
    const seneca = this
    const service = new AWS[options.service](options.serviceOptions)

    seneca.add(`init: ${pluginName}`, function(msg, respond) {
        seneca.log.info('init ' + pluginName)
        respond(null)
    })

    _.forEach(service.api.operations, function(value, operation) {
        seneca.add(`role: ${pluginName}, service: ${options.service}, cmd: ${operation}`, function(msg, respond) {
            seneca.log.info(`called => role: ${pluginName}, service: ${options.service}, cmd: ${operation}`)

            const params = msg.params || {}

            service[operation](params, function(error, data) {
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
