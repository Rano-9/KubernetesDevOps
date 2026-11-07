const randomString = Math.random().toString(36).slice(3)

const timerRun = () => {
    const now = new Date()
    const format = [String(now.getDate()).padStart(2,"0"),String(now.getMonth()).padStart(2,"0"),String(now.getFullYear()).slice(-2)].join("-")
    const time = [String(now.getHours()), String(now.getMinutes()), String(now.getSeconds())].join(":")
    console.log(format + " " + time +  " " + randomString )

    setTimeout(timerRun,5000)
}
timerRun()