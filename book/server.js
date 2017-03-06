var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
//获取图书
function getBooks(callback) {
    fs.readFile('./book.json','utf8',function (err,data) {
        if(err){
            callback([]);
        }else{
            callback(JSON.parse(data));
        }
    });
}
//设置图书
function setBooks(data,callback) {
    fs.writeFile('./book.json',JSON.stringify(data),callback);
}
var server = http.createServer(function (req,res) {
    var urlObj = url.parse(req.url,true);
    var pathname = urlObj.pathname;
    if(pathname=='/'){
        res.setHeader('Content-Type','text/html;charset=utf8');
        fs.createReadStream('./index.html').pipe(res);
    }else if(/\/books(\/\d+)?/.test(pathname)){  //   /books/:id
        var id = /\/books(\/(\d+))?/.exec(pathname)[2];
        switch (req.method){
            case 'GET':
                if(id){ //查询某个
                    getBooks(function (data) {
                        var book = data.find(function (item) {
                            return item.id == id; //返回true 表示找到了会返回出当前找到的对象
                        });
                        res.end(JSON.stringify(book));
                    })
                }else{ //查询所有
                    getBooks(function (data) {
                        res.end(JSON.stringify(data));
                    });
                }
                break;
            case 'POST':
                //做增加操作
                var str = '';
                req.on('data',function (data) {
                    str+=data;
                });
                req.on('end',function () {
                    var book = JSON.parse(str);
                    getBooks(function (data) {
                        //如果有数据 取最后一条的id+1，如果没有则是第一条
                        book.id = data.length?parseInt(data[data.length-1].id)+1:1;
                        data.push(book);
                        setBooks(data,function () {
                            //成功后返回添加成功的那一项
                            res.end(JSON.stringify(book));
                        });
                    });
                });
                break;
            case 'DELETE':
                if(id){
                    getBooks(function (data) {
                        data = data.filter(function (item) {
                            return item.id !=id;
                        });
                        setBooks(data,function () {
                            res.end(JSON.stringify({}));
                        });
                    });
                }
                break;
            case 'PUT':
                if(id){
                    var str = '';
                    req.on('data',function (data) {
                        str+=data;
                    });
                    req.on('end',function () {
                        var book = JSON.parse(str);
                        getBooks(function (data) {
                            data = data.map(function (item) {
                                if(item.id == id){
                                    return book;
                                }
                                return item
                            });
                            setBooks(data,function () {
                                res.end(JSON.stringify(book));//返回修改的那一项
                            });
                        });
                    })
                }
                break;
        }
    }else{
        fs.exists('.'+pathname,function (flag) {
            if(flag){
                res.setHeader('Content-Type',mime.lookup(pathname)+';charset=utf8');
                fs.createReadStream('.'+pathname).pipe(res);
            }else{
                res.statusCode = 404;
                res.end('Not Found');
            }
        });
    }
});
server.listen(80);

