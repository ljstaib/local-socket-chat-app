# Socket Chat App

Luke Staib, 2023

# About
A simple web browser chat application using socket programming. The main purpose of this project was to learn about socket programming in JavaScript.

# Usage
1. Download the repository.
2. Navigate to the directory that the repository is located in and type `npm start` in a terminal.
3. Open a web browser and go to `localhost:3000` (the application is not hosted yet)
   1. Up to four users can connect and chat in real time.
4. To stop the server, simply cancel the process running `npm start` from step 2.

# Features
- Instant messaging with up to 4 users on a local network
- Message limit up to 128 characters
- Member list visible to the left of the main chat window
- Server-side messages
  - Welcome a new user client-side
  - Share to the server when a new member has joined
  - Share to the server when a member has leaved
- Username and chat message censorship
- Clean UI

# Technologies Used
- JavaScript (Node.js) for client and server
  - Libraries
    - socket.io for socket programming (Credit: https://socket.io/)
    - bad-words for censorship (Credit: https://github.com/web-mech/badwords)
- HTML for the web page
- CSS for styling