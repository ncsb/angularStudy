//操作json
var fs = require('fs');
//1.获取 (柯里化)
/*fs.readFile('./book.json','utf8',function (err,data) {
    if(err) console.log(err);
    console.log(JSON.parse(data));
});*/
//2.增加
var newBook = {
    "bookName": "angular权威指南",
    "bookPrice": 70,
    "bookCover": "http://img4.imgtn.bdimg.com/it/u=3121219979,3595959843&fm=21&gp=0.jpg",
    "id": 3
};
//先获取 在写入
//1. 只要读取就要写一个路径 2.不指定utf8  3.不处理错误 4，json.parse
function getBooks(fn) {
    fs.readFile('./book.json','utf8',function (err,data) {
        if(err){
            fn([])
        }else{
            fn(JSON.parse(data));
        }
    });
}
function setBooks(data,cb) {
    fs.writeFile('./book.json',JSON.stringify(data),cb);
}
/*getBooks(function (data) {//拿到的就是读取后的json
    data.push(newBook);//加入内容
    setBooks(data,function () {//只需传递数据 和回掉函数，setBooks内部会自动stringify 写入后在调用fn
        console.log('成功');
    });
});*/
//3.删除 id = 3 全部删除掉
/*getBooks(function (data) {
    data = data.filter (function (item) {
        return item.id != 3;
    });
    setBooks(data,function () {
        console.log('删除成功');
    })
});*/
//4.修改  id=2 name=>hello 改map
getBooks(function(data){
    data=data.map(function(item){
        if(item.id==2){
            item.bookName="hello"
        }
        return item;
    });
    setBooks(data,function(){
        console.log("修改成功");
    })
})