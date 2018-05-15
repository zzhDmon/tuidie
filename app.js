
var express = require('express');
var fs = require('fs')

//创建服务器对象
var app = express()


//配置静态文件夹
app.use(express.static('www'));



app.listen(4000,function(){
	console.log("伍玖云服务器开启……")
})
