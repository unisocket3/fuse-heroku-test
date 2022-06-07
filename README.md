# fuse-heroku
Deployable version of Fuse. (Fork this repo, modify [functions.js](https://github.com/Unzor/fuse-heroku/blob/main/functions.js) and deploy on Heroku)

# Demo
```lua
local fuse = require(game.ServerScriptService.Fuse)

local host = fuse.connect('fuse-rblx-demo.herokuapp.com')
local result = host.hello("world")

print(result)
```
