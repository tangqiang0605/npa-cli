## API接口
```
method：get 
url：http://localhost:9999/api
return：{
  "dependencies": [
    {
      "name": "x",  依赖名
      "version": "0.0.0",   版本号
      "size": "0KB",  依赖大小(kb)
      "s": 0  依赖大小(字节)
      "dependencies": [],  普通子依赖
      "devDependencies": []  子开发依赖
    }
  ],
  "devDependencies": [
    {
      "name": "x",
      "version": "0.0.0",
    }
  ],
}
```