# 高科考勤平台前端代码

## 开发环境

 1. 在根目录下执行安装命令

    ```
    npm install
    ```

 2. 修改proxy-conf.json进行适配，默认使用测试环境。

    ```
    "target": "https://testpalm.hileveps.net",
    ```

 3. 如果要适配到本地环境，则需要将所有后端boot放到nginx反向代理的后面，对外暴露一个端口即可。并修改proxy-conf.json中的target，配置其指向本地的nginx服务器。

 4. 在根目录下启动前端

    ```
    npm run start
    ```

 5. 通过浏览器访问 http://localhost:4200