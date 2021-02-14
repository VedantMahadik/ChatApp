const express = require("express");
const app = express();
const path = require("path");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

// Routing
app.use(express.static(path.join(__dirname, "/public")));

http.listen(port, () => {
	console.log(`[STARTED] Server started at port:${port}`);
});

let numOfUsers = 0;
io.on("connection", socket => {
	let addedUser = false;

	// new message sent by user
	socket.on("new message", data => {
		socket.broadcast.emit("new message", {
			username: socket.username,
			message: data,
		});
	});

	socket.on("add user", username => {
		// if user is already added
		if (addedUser) return;
		console.log(`[CONNECTED]: New user ${username} has connected`);

		// store username in socket
		socket.username = username;
		++numOfUsers;
		addedUser = true;

		// on successful login change number of users
		socket.emit("login", {
			numOfUsers: numOfUsers,
		});

		// notify users about the new joined user and total number of users
		socket.broadcast.emit("user joined", {
			username: socket.username,
			numOfUsers: numOfUsers,
		});
	});

	//notify users which user(s) is/are typing
	socket.on("typing", () => {
		socket.broadcast.emit("typing", {
			username: socket.username,
		});
	});
	socket.on("stop typing", () => {
		socket.broadcast.emit("stop typing", {
			username: socket.username,
		});
	});

	socket.on("disconnect", () => {
		if (addedUser) {
			--numOfUsers;

			socket.broadcast.emit("user left", {
				username: socket.username,
				numOfUsers: numOfUsers,
			});
		}
	});
});
