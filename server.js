const express = require('express');
const port = process.env.PORT || 8080;

const app = express();

app.use(express.urlencoded({extended: false}));


app.get('/', (req,res) => { // Homepage
    res.sendFile("index.html", { root: __dirname })
}); 


// app.get("*", (req,res) => { // 404 Catch All
// 	res.status(404);
// 	res.render("404")
// });

app.use(express.static(__dirname));

app.listen(port, () => {
	console.log("Node application listening on port " + port);
}); 