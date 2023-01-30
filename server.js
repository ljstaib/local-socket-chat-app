// Luke Staib, 2023

// Imports
var fs = require('fs')
var http = require('http')
var path = require('path')

// Start server and handle HTTP requests
const app_port = process.env.APP_PORT || 3000
const app = http.createServer(reqHandler)

app.listen(app_port)
console.log(`[INFO] HTTP Server running on port ${app_port}`)

// Socket IO

const io = require('socket.io')(app, {
    allowEIO3: true,
    cors: {
        origin: "http://localhost",
        methods: ["GET", "POST"],
        credentials: true,
        transports: ["websocket"]
    },
    path: '/socket.io',
})

var members = {}

io.on("connection", (socket) => {
    console.log(`[INFO] New socket: ${socket.id}`)

    socket.on("new-cxn", (data) => {
        //Check if server is full (right now, 4 slots)
        if (Object.keys(members).length >= 4) {
            socket.disconnect()
            return null
        }

        //Check if username already exists
        var flag = false
        Object.keys(members).forEach(function(key) {
            if (members[key] == data.uname) {
                // Username already exists.
                flag = true
            }
        });
        // If username exists, give user a 16 digit hex username
        flag ? members[socket.id] = require("crypto").randomBytes(8).toString('hex') : members[socket.id] = data.uname
        data.uname = members[socket.id]

        console.log(`[INFO] Current members: ${JSON.stringify(Object.values(members))}`)
        io.emit("update-members", {
            users: members
        })

        console.log(`[INFO] ${Object.keys(members).length} current member/s`)
        io.emit("update-member-title", {
            amount: Object.keys(members).length
        })

        socket.emit("welcome-msg", {
            user: "root",
            msg: `Welcome, ${data.uname}!`
        })
    })

    socket.on("new-msg", (data) => {
        socket.broadcast.emit("broadcast-msg", {
            user: members[data.user],
            msg: data.msg,
        })
    })

    socket.on("disconnect", () => {
        console.log(`[INFO] Disconnect: ${members[socket.id]}`)
        delete members[socket.id]
        io.emit("update-members", {
            users: members
        })
        io.emit("update-member-title", {
            amount: Object.keys(members).length
        })
    })
})

// Handle requests
function reqHandler(req, resp) {
    console.log(`[INFO] Received request for ${req.url}`)

    var fpath = req.url
    if (req.url == '/') {
        fpath = 'index.html'
    }
    else {
        fpath = fpath.slice(1)
    }

    var ext = String(path.extname(fpath)).toLowerCase()

    var media = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.gif': 'image/gif',
        '.jpg': 'image/jpg',
        '.png': 'image/png',
        '.svg': 'image/svg+xml',
    }

    var ctype = media[ext] || 'application/octet-stream'

    fs.readFile(fpath, function (error, content) {
        if (error) {
            if (error.code != 'ENOENT') {
                resp.writeHead(500)
                resp.end('There was an error. Error code: ' + error.code)
            } 
            else {
                fs.readFile('404.html', function (_, content) {
                    resp.writeHead(404, { 'Content-Type': ctype })
                    resp.end(content, 'utf-8')
                })
            }
        } 
        else {
            resp.writeHead(200, { 'Content-Type': ctype })
            resp.end(content, 'utf-8')
            console.log(`[INFO] File success: ${fpath}`)
        }
    }) 
}