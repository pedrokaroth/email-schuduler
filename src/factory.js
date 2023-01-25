const AWS = require('aws-sdk')

// TODO: Alterar para validar stage da aplicacao
if (true) {
  AWS.config.update({
    credentials: {
      accessKeyId: 'test',
      secretAccessKey: 'test'
    },
    endpoint: 'http://localhost:4566'
  })
}

const cloudWatchEvents = new AWS.CloudWatchEvents()
const ses = new AWS.SES()
const lambdas = new AWS.Lambda()

module.exports = {
  cloudWatchEvents,
  ses,
  lambdas
}
