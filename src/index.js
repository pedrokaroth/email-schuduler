const { momentToCron } = require('./helpers')
const { randomUUID } = require('node:crypto')
const { cloudWatchEvents } = require('./factory')
const Promise = require('bluebird')
const moment = require('moment')

class Handler {
  // TODO: funcao que vai receber o disparo de email
  event = async (event) => {
    console.log(`\x1b[33m ${randomUUID()} - ${moment().format('MMMM Do YYYY, h:mm:ss a')} \x1b[0m\n\n\n`)

    console.log(await cloudWatchEvents.listRules().promise())

    const targets = await cloudWatchEvents.listTargetsByRule({ Rule: event.id }).promise()

    await Promise.map(targets.Targets, async ({ Id }) => cloudWatchEvents.removeTargets({ Ids: [Id], Rule: event.id }).promise())

    await cloudWatchEvents.deleteRule({ Name: event.id }).promise()

    console.log(await cloudWatchEvents.listRules().promise())

    console.log('\x1b[33m ----------------------------------------------- \x1b[0m')

    return {
      statusCode: 200,
      body: JSON.stringify({ teste: 123 })
    }
  }

  // TODO: funcao que vai solicitar o disparo do email
  saveSchedule = async (event) => {
    const request = JSON.parse(event.body)

    if (!request.schedule || !request.email || !request.mensagem) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          mensagem: 'Parametros faltantes'
        })
      }
    }

    const time = moment().utc().add(1, 'minute')

    const ruleTmpName = randomUUID()

    await cloudWatchEvents.putRule({
      Name: ruleTmpName,
      ScheduleExpression: momentToCron(time),
      State: 'ENABLED'
    }).promise()

    await cloudWatchEvents.putTargets({
      Rule: ruleTmpName,
      Targets: [
        {
          Id: ruleTmpName.toString(),
          Arn: 'arn:aws:lambda:us-east-1:000000000000:function:email-scheduler-local-event',
          Input: JSON.stringify({
            id: ruleTmpName
          })
        }
      ]
    }).promise()

    await cloudWatchEvents.listRules({ NamePrefix: ruleTmpName }).promise()

    console.log(time.format('MMMM Do YYYY, h:mm:ss a'))

    return {
      statusCode: 200,
      body: JSON.stringify({ teste: 123 })
    }
  }
}

module.exports = new Handler()
