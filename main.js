console.log("[INFO] Main loaded.")

var socket = io.connect()

const uname = prompt("Please enter a username: ")

socket.emit("new-cxn", {uname})

socket.on("welcome-msg", (data) => {
    console.log(`[INFO] Received welcome message: {data}`)
})