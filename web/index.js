import {
    Create,
    GET,
    POST,
    PUT,
    DELETE,
    Cancel,
    Headers,
    FormUrlEncoded,
    AddReqInterceptor,
    AddResInterceptor
} from '../lib/index';
import {
    Interval,
    Timer,
    Autobind,
    Debounce,
    Throttle
} from '../lib/utils';

// Topics 接口类
@AddResInterceptor(response => {
    console.log('res-interceptor', response);
    return response;
})
@AddReqInterceptor(request => {
    console.log('req-interceptor', request);
    request.transformRequest = [function (data) {
        let ret = ''
        for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
    }];
    return request;
})
@Create({
    baseURL: 'https://cnodejs.org/api',
    timeout: 1000
})
class TopicApi {

    @GET('https://cnodejs.org/api/v1/topics')
    getList(res) {
        console.log(res);
    };

    @GET({
        url: 'https://cnodejs.org/api/v1/topics',
        params: {
            limit: 10
        }
    })
    getListByTab(res) {
        console.log(res);
    };

    @GET('https://cnodejs.org/api/v1/topic/{topicId}?limit={limit}')
    getDetails(res) {
        console.log('---', res);
    };

    @GET('/v1/{0}', 'topics')
    @Cancel((cancel) => {
        // cancel() //手动cancel
    })
    getTopic(res) {
        console.log('topic', res);
    }

    @Throttle(600, {
        trailing: false
    })
    print(msg) {
        console.log('print-------');
    }

    @FormUrlEncoded
    @POST('http://192.168.2.195:8000/user')
    addUser(res) {

    }

    @PUT('http://192.168.2.195:8000/user')
    modifyUser(res) {

    }

    @DELETE('http://192.168.2.195:8000/user')
    deleteUser(res) {

    }
}

// test
let topics = new TopicApi();
// topics.getList({limit: 10, page: 2});
// topics.getListByTab();
// topics.getDetails();
topics.getTopic();
// topics.getDetails('topicId=5433d5e4e737cbe96dcef312', {
//     limit: 20
// });


// topics.addUser({
//     id: 1,
//     name: 'glang'
// });
// topics.modifyUser({
//     id: 1,
//     name: 'glang'
// });
// topics.deleteUser({id: 1});