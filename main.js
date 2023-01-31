var socket = io.connect()

let uname = null
while (uname === null || uname.toLowerCase() === "root" || uname === "" || uname == undefined) {
    uname = prompt("Please enter a username: ")
    uname = uname.replace(/\s/g, '') // remove whitespace
}

socket.emit("new-cxn", {uname})

socket.on("welcome-msg", (data) => {
    addMsg(data, false)
})

socket.on("new-member-msg", (data) => {
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
    chatDiv.scrollTop = chatDiv.scrollHeight; //auto-scroll
}

function updateMembers(data) {
    // console.log(`Member data: ${JSON.stringify(data)}`)
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

function updateMembersTitle(data) {
    const membersTitle = document.getElementById("members-title")
    membersTitle.innerText = `Members (${data['amount']}/4)`
}

const msgForm = document.getElementById("msg-form")
var timeCheck = 0

msgForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const msgInput = document.getElementById("msg-input")
    const errorMsg = document.getElementById("error-msg")

    if (msgInput.value === "") {
        //Reject empty message
        msgInput.classList.add("error")
        errorMsg.innerText = "Please enter a message."
    }
    else if (Date.now() - timeCheck <= 3000) {
        //Chat message limit: 3 seconds between messages
        msgInput.classList.add("error")
        errorMsg.innerText = "Sending messages too fast! Time limit: 3 seconds."
    }
    else {
        //Reset input field and send message
        let msgSend = msgInput.value
        socket.emit("new-msg", {user: socket.id, msg: msgSend})
        addMsg({msg: msgSend}, true)
        msgInput.value = ""

        //Remove any error messages and start cooldown
        msgInput.classList.remove("error")
        errorMsg.innerText = ""
        timeCheck = Date.now()
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

socket.on("update-member-title", (data) => {
    updateMembersTitle(data)
})

socket.on("member-left-msg", (data) => {
    addMsg(data, false)
})

const textBox = document.getElementById("msg-input")
textBox.addEventListener("input", displayChars)

function displayChars(e) {
    const str_out = document.getElementById("msg-input").value.length
    document.getElementById("char-display").textContent = `${str_out}/128`
}
