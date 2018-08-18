# retrofit-cjs

> **retrofit-cjs** 是一个基于JavaScript装饰器（Decorator）和 axios 实现的网络请求库, 支持Vue / React / react-native 等常用框架, 支持node.js
 [![tests](https://travis-ci.org/glangzh/retrofit-cjs.svg?branch=master)](http://travis-ci.org/glangzh/retrofit-cjs)
 [![npm](https://img.shields.io/npm/v/retrofit-cjs.svg?style=flat-square)](https://www.npmjs.com/package/retrofit-cjs) [![npm](https://img.shields.io/npm/dt/retrofit-cjs.svg?style=flat-square)](https://www.npmjs.com/package/retrofit-cjs) [![npm](https://img.shields.io/npm/l/retrofit-cjs.svg?style=flat-square)](https://www.npmjs.com/package/retrofit-cjs)

## 使用方法
**1. 安装**
```sh
npm i retrofit-cjs --save
```
**Babel 转码器的支持**

安装 babel-plugin-transform-decorators-legacy
```sh
npm i babel-plugin-transform-decorators-legacy -D
```
配置 .babelrc 文件
```json
"plugins": ["transform-decorators-legacy"]
```
**如果是使用 create-react-app 创建的项目，需要先弹出 webpack 配置**
```sh
npm run eject
```
**安装 babel-plugin-transform-decorators-legacy，在 package.json  中配置 babel**
```json
"babel": {
    "presets": [
        "react-app"
    ],
    "plugins": [
        "transform-decorators-legacy"
    ]
  }
```
**vue-cli3 已默认支持 Decorator**

**2. 引入 retrofit-cjs**
```js
import { GET, POST, Headers } from 'retrofit-cjs';
```

## 修饰器
##### 属性方法修饰器
* [@GET](#GET)
```js
    @GET('/v1/topics')
    @GET('/v1/{0}', 'topics')
    @GET('https://cnodejs.org/api/v1/topics')
    @GET({url: '/v1/topics', params: {limit: 10}})
    @GET('/v1/topic/{topicId}')
```
* [@POST](#POST)
```js
    @POST({url: '/user', data: {id: 1, name: 'glang'}})
```
* [@PUT](#PUT)
* [@DELETE](#DELETE)
* [@HTTP](#HTTP)
* [@Config](#Config)
    * 设置请求信息，只作用与当前请求
    * [查看请求配置](https://github.com/axios/axios#request-config)
* [@Headers](#Headers)
    * 设置请求头，只作用与当前请求
* [@Cancel](#Cancel)
* [@Multipart](#Multipart)
* [@FormUrlEncoded](#FormUrlEncoded)
    * 以表单方式提交数据，默认以json方式提交
    * [兼容适配处理方案](https://github.com/axios/axios#using-applicationx-www-form-urlencoded-format)
    * [通过请求拦截器处理](#AddReqInterceptor)
##### 类修饰器
* [@Create](#Create)
    * **创建新的请求实例，后续其他操作都依赖与创建的实例，默认使用全局的请求实例。可配置请求基础信息，也可通过 @Config 和 @Headers 完成基础信息配置**
* [@Config](#Config)
    * 配置全局请求信息，**若使用了 @Create 则作用与当前请求对象，否则作用与全局对象**
* [@Headers](#Headers)
    * 配置全局请求头信息，**若使用了 @Create 则作用与当前请求对象，否则作用与全局对象**
* [@AddReqInterceptor](#AddReqInterceptor)  添加请求拦截器
* [@AddResInterceptor](#AddResInterceptor)  添加响应拦截器
    > 注意配置顺序，修饰器会从内向外执行
##### 一些工具修饰器
* [@Debounce](#Debounce) 防抖
```js
    @Debounce(1000) // 1秒防抖
    @Debounce(1000, true) // 1秒防抖, 立即执行
```
* [@Throttle](#Throttle)  节流
```js
    @Throttle(1000, {leading: false}) // 忽略开始函数的的调用
    @Throttle(1000, {trailing: false}) // 忽略结尾函数的调用
    // 两者不能共存， 否则函数不能执行
```
* [@Timer](#Timer) 定时操作
```js
    @Timer(1000) // 延迟1秒执行
    @Timer(1000, true) // 延迟1秒执行, 立即执行修饰函数
```
* [@Interval](#Interval) 定时操作
```js
    @Interval(1000) // 每隔1秒执行一次
    @Interval(1000, true) // 每隔1秒执行一次, 立即执行修饰函数
    @Interval(1000, 10000) // 每隔1秒执行一次, 10秒后结束
    @Interval(1000, 10000, true) // 每隔1秒执行一次, 10秒后结束，立即执行修饰函数
```
* [@RetroPlugin](#RetroPlugin) Vue 插件：全局配置网络请求
> **注意：在同一个方法上，@Debounce,@Throttle,@Timer,@Interval 和 @GET,@POST,@PUT,@DELETE,@HTTP是无法同时使用的**

**3. 使用**

1. 推荐
```js
@AddResInterceptor((res)=>{
    // response result
    return res;
}, (error)=>{
    // response error
})
@Config({timeout: 2000})
@Headers({'User-Agent': 'request'})
@Create({
    baseURL: 'https://cnodejs.org/api',
    timeout: 1000,
    headers: {
        'X-Custom-Header': 'foobar'
    }
})
class TopicApi{
    static getInstance(){
        return new TopicApi();
    }

    @Cancel((cancel) => {
        // cancel();  //取消当前请求
    })
    @Config({timeout: 1000})
    @Headers({'User-Agent': 'request'})
    @GET('/v1/topics')
    // @GET('/v1/{0}', 'topics')
    // @GET('https://cnodejs.org/api/v1/topics')
    // @GET({url: '/v1/topics', params: {limit: 10}})
    getTopicList(res){
        // 处理结果
        return res;
    }

    @Debounce(2000)
    // @HTTP({
    //     url: '/v1/topic/5433d5e4e737cbe96dcef312',
    //     method: 'get',
    //     params: {}
    // })
    @GET('/v1/topic/{topicId}')
    getTopicDetails(res){
        // response result
    }

    // 以表单方式提交数据
    @FormUrlEncoded
    @POST('/user')
    // @POST({url: '/user', data: {id: 1, name: 'glang'}})
    addUser(res) {

    }
}

let topicApi = TopicApi.getInstance();
// topicApi.getTopicDetails('topicId=5433d5e4e737cbe96dcef312', {
//     limit: 20
// });
// 参数会按 {} 自动匹配
topicApi.getTopicDetails({
    topicId: '5433d5e4e737cbe96dcef312',
    limit: 20
});
topicApi.addUser({id: 1, name: 'glang'});
```
2. react / react-native
```js
import {Interval} from 'retrofit-cjs';

@Create({
    baseURL: 'https://cnodejs.org/api'
})
class App extends Component{
    constructor(props) {
        super(props);
        // this.countdwon = this.countdwon.bind(this);
    }

    @GET('/v1/topics')
    getTopicList(res){
        // 处理结果
        
    }

    @Interval(1000, 60 * 1000)
    countdwon(){

    }
}
```
3. vue
```js
export default {
  name: "app",
  mounted() {
    this.getList();
  },
  methods: {
    // @Config 只影响当前网络请求
    @Config({
        baseURL: 'https://cnodejs.org/api',
        timeout: 1000 
    })
    @GET("/v1/topics")
    getList(res, err) {
        //
    }
  }
}
```
### @RetroPlugin 
> 使用Vue插件配置请求基本信息
```js
// Vue 入口文件
import Vue from 'vue'
import {RetroPlugin} from 'retrofit-cjs';

Vue.use(RetroPlugin, {
    baseURL: 'https://cnodejs.org/api',
    timeout: 1000,
    headers: {
        'X-Custom-Header': 'foobar'
    }
});
```

### @AddReqInterceptor
> 通过请求拦截器处理请求参数
```js
@AddReqInterceptor((request)=>{
    request.transformRequest = [function (data) {
        let ret = ''
        for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
    }]
    return request;
})
class TopicApi{
    ...
}
```


欢迎大佬们吐槽。

# LICENSE

MIT@[https://github.com/glangzh](glangzh)
