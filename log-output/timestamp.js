const fs = require("node:fs/promises")
const log_path = String(process.env.LOG_PATH) || "./log.txt"


const randomString = Math.random().toString(36).slice(3)

const timerRun = async () => {
    const now = new Date()
    const format = [String(now.getDate()).padStart(2,"0"),String(now.getMonth()).padStart(2,"0"),String(now.getFullYear()).slice(-2)].join("-")
    const time = [String(now.getHours()).padStart(2,"0"), String(now.getMinutes()).padStart(2,"0"), String(now.getSeconds()).padStart(2,"0")].join(":")
    const timestamp = format + " " + time +  " " + randomString + "\n" 

    try {
        await fs.appendFile(log_path,timestamp)
    } catch (err) {
        console.log(err)
    }
    console.log(timestamp)
    setTimeout(timerRun,5000)
}
timerRun()
