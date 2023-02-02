# Socket Chat App

Luke Staib, 2023

# About
A simple web browser chat application using socket programming. The main purpose of this project was to learn about socket programming in JavaScript.

# Usage
1. Download the repository.
2. Navigate to the directory that the repository is located in and type `npm start` in a terminal.
3. Open a web browser and go to `localhost:3000` (the application is not hosted yet)
   1. You should be prompted to enter a username. If you are not, please refresh the page.
4. Enter messages using the prompt at the bottom.
5. To stop the server, simply cancel the process running `npm start` from step 2.

# Features
- Instant messaging with up to 4 users on a local network
- Member list visible to the left of the main chat window, automatically updates
- Server broadcast messages (user joined/left, welcome message)
- Chat control
  - Username and chat message censorship
  - Chat cooldown of 3 seconds to help prevent spam
  - Message limit up to 128 characters
- Auto-scrolling chat

# Technologies Used
- JavaScript (Node.js) for client and server
  - Libraries
    - socket.io for socket programming (Credit: https://socket.io/)
    - bad-words for censorship (Credit: https://github.com/web-mech/badwords/)
    - Node.js: filesystem, HTTP, path
- HTML and CSS for simple UI