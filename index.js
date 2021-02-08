var app = require("express")();
var http = require("html").createServer(app);

app.get("/", (req, res) => {});

http.listen(3000, () => {
	console.log("[STARTED] Server started at port 3000");
});
