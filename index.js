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

io.on("connection", socket => {
	console.log(`${username} has joined`);
	io.on("disconnected", socket => {
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
