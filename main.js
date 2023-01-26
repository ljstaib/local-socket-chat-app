console.log("[INFO] Main loaded.")

var socket = io.connect()

let uname = null
while (uname === null) {
    uname = prompt("Please enter a username: ")
}

socket.emit("new-cxn", {uname})

socket.on("welcome-msg", (data) => {
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
            msg.innerText = `[${data.user}] ${data.msg}`
        }
    }

    const chatDiv = document.getElementById("chat-container")
    chatDiv.append(msg)
}

function updateMembers(data) {
    console.log(`Member data: ${JSON.stringify(data)}`)
    const memberDiv = document.getElementById("members-list")
    var mems = document.getElementsByClassName("member");

    while(mems[0]) {
        mems[0].parentNode.removeChild(mems[0]);
    }

    Object.values(data['users']).forEach(member => {
        const memberElement = document.createElement("div")
        memberElement.classList.add("member")
        memberElement.innerText = member

        memberDiv.append(memberElement)
    });
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
        msgInput.classList.remove("error");
        msgInput.value = ""
    }
})

socket.on("broadcast-msg", (data) => {
    console.log(`[INFO] Broadcast: ${data}`)
    addMsg(data, false)
})

socket.on("update-members", (data) => {
    console.log("[INFO] Updating members list")
    updateMembers(data)
})

const textBox = document.getElementById("msg-input")
textBox.addEventListener("input", displayChars)

function displayChars(e) {
    const str_out = document.getElementById("msg-input").value.length
    document.getElementById("char-display").textContent = `${str_out}/128`
}