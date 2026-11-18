const logPath = process.env.LOG_PATH || "./log.json"
const randomString = Math.random().toString(36).slice(3)

export let latestTimestamp = ""

export const timerRun = (): void => {
  const now = new Date()
  const format = [
    String(now.getDate()).padStart(2, "0"),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getFullYear()).slice(-2),
  ].join("-")

  const time = [
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join(":")

  latestTimestamp = `${format} ${time} ${randomString}`

  console.log(latestTimestamp)
  setTimeout(timerRun, 5000)
}

