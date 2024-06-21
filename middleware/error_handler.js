const {logEvents} = require('./log_events');
const errorHandler = (err, res, next) => {
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt')
    console.log(err.stack);
    res.status(500).send(err.message);
    next();
}
module.exports = errorHandler;

