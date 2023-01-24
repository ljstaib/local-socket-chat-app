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
        members[socket.id] = data.uname

        socket.emit("welcome-msg", {
            user: "root",
            msg: "Welcome!"
        })
    })

    socket.on("new-msg", (data) => {
        socket.broadcast.emit("broadcast-msg", {
            user: members[data.user],
            msg: data.msg,
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
    console.log(`[INFO] File path: ${fpath}`)

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
                fs.readFile('404.html', function (error, content) {
                    resp.writeHead(404, { 'Content-Type': ctype })
                    resp.end(content, 'utf-8')
                })
            }
        } 
        else {
            resp.writeHead(200, { 'Content-Type': ctype })
            resp.end(content, 'utf-8')
            console.log(`[INFO] File success! : ${fpath}`)
        }
    }) 
}