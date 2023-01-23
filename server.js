// Luke Staib, 2023

// Imports
var fs = require('fs')
var http = require('http')
var path = require('path')

// Start server and handle HTTP requests
const app_port = process.env.APP_PORT || 3000
const app = http.createServer(reqHandler)

app.listen(app_port)
console.log(`[INFO] HTTP Server running at ${app_port}`)

// Handle requests
function reqHandler(req, resp) {
    console.log(`[INFO] Received request for ${req.url}`)

    var fpath = req.url
    if (req.url == '/') {
        fpath = 'index.html'
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
        }
    }) 
}