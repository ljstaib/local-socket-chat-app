console.log("[INFO] Main loaded.")

var socket = io.connect()

const uname = prompt("Please enter a username: ")

socket.emit("new-cxn", {uname})

socket.on("welcome-msg", (data) => {
    console.log(`[INFO] Received welcome message: ${data}`)
    addMsg(data, false)
})

function addMsg(data, isOwn=false) {
    const msg = document.createElement("div")
    msg.classList.add("msg")

    if (isOwn) {
        msg.classList.add("own-msg")
        msg.innerText = `${data.msg}`
    }
    else {
        if (data.user === "root") {
            msg.innerText = `${data.msg}`
            msg.classList.add("root-msg")
        }
        else {
            msg.classList.add("not-own-msg")
            msg.innerText = `${data.user}: ${data.msg}`
        }
    }

    const chatDiv = document.getElementById("chat-container")
    chatDiv.append(msg)
}

const msgForm = document.getElementById("msg-form")

msgForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const msgInput = document.getElementById("msg-input")

    if (msgInput.value === "") {
        msgInput.classList.add("error");
    }
    else {
        let msgSend = msgInput.value
        socket.emit("new-msg", {user: socket.id, msg: msgSend})
        addMsg({msg: msgSend}, true)
        msgInput.value = ""
    }
})

socket.on("broadcast-msg", (data) => {
    console.log(`[INFO] Broadcast: ${data}`)
    addMsg(data, false)
})