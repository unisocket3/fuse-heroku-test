const { wakeDyno, wakeDynos } = require('heroku-keep-awake');
const express = require('express');
const fs = require("fs");
var parser = require("cli2json");
var args = parser.parse(process.argv.slice(2).join(" "), {
  readCommandAfter: ["-u", "--use", "-a", "--attach"]
})

const app = express();
app.use(express.static(__dirname));

var funcs = [];


function arrayFindIncludes(r, n) {
    var u;
    var a = null;
    n.forEach(function(n) {
        if (n.includes(r)) {
            u = n;
            a = n
        } else {
            u = a
        }
    });
    return u
}

function FUSE_FN(fn){
	funcs.push(fn.name);
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

if (arrayFindIncludes("-u", args.flags) || arrayFindIncludes("--use", args.flags)) {
  var preload = JSON.parse(fs.readFileSync(args.flags[0].split(" ")[1]).toString());
  preload.files.forEach(function(file){
    eval(fs.readFileSync(file).toString())
  })
} else if (arrayFindIncludes("-a", args.flags) || arrayFindIncludes("--attach", args.flags)) {
	    eval(fs.readFileSync(args.flags[0].split(" ")[1]).toString())
}

app.get('/fuse/attach/:code', (req, res) => {
  eval(atob(req.params.code))
  res.send("attached")
});

app.get('/fuse/functions', (req, res) => {
  res.send({list: funcs});
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Fuse server started');
  setInterval(function(){
	var data = rangethrough(["/*","*/"], fs.readFileSync('functions.js').toString())[1].split("\n")[1].split(" = ")[1];
  	wakeDyno("https://"+data);
  }, 600000)
});
