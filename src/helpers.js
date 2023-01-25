/**
 * Converts a given moment object to a cron schedule string.
 * @param {Object} date - A moment object.
 * @returns {string} A string in the format of a cron schedule (minutes, hours, date, month, and day in that order).
 */
module.exports.momentToCron = (date) => {
  return `cron(${date.minute()} ${date.hour()} ${date.date()} ${date.month() + 1} ? *)`
}
