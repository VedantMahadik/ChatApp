var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

username = "user";
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/form.html");
});
app.get("/index", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

http.listen(3000, () => {
	console.log("[STARTED] Server started at port 3000");
});

io.on("connected", socket => {
	console.log(`${username} has joined`);
	socket.on("disconnect", () => {
		console.log(`${username} has left`);
	});
});
io.on("connection", socket => {
	socket.on("chat message", msg => {
		console.log("message: " + msg);
	});
	socket.on("username", content => {
		username = content;
	});
});

io.on("connection", socket => {
	socket.on("chat message", msg => {
		content = { username, msg };
		io.emit("chat message", content);
	});
});

// check if user is typing
io.on("connection", socket => {
	/*from server side we will emit 'display' event once the user starts typing
	so that on the client side we can capture this event and display 
	'<data.user> is typing...' */
	socket.on("typing", data => {
		if (data.typing == true) io.emit("display", data);
		else io.emit("display", data);
	});
});
