const formatTime = require("date-format")
const createTimeMessages =(messgesText,username) => {
    return {
    messgesText,
    username  ,
    createAt: formatTime("dd/MM/yyyy hh:mm:ss",new Date())
        }
}
module.exports = {
    createTimeMessages
}