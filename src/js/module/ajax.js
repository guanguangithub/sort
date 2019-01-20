/*
 * @Author: fairy·guanyue 
 * @Date: 2018-12-07 19:20:00 
 * @Last Modified by: fairy·guanyue
 * @Last Modified time: 2018-12-07 19:20:24
 */

function ajax(opt) {
    var def = {
        type: "get",
        data: null,
        async: true,
        dataType: "text",
        success: null,
        err: null
    }
    var setting = extend({}, def, opt);
    if (!setting.url) {
        return
    }
    //格式化data
    var data = setting.data && format(setting.data);
    // ajax发起请求
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status === 200 || xhr.status === 304) { //请求成功
                    //获取相应数据responseText
                    // 判断dataType
                    if (setting.dataType === "json") {
                        setting.success && setting.success(JSON.parse(xhr.responseText))
                    } else {
                        setting.success && setting.success(xhr.responseText)
                    }
                } else { //请求失败
                    setting.error && setting.error();
                }

            }
        }
        //判断传输方式是否是get  如果是 建立请求 发送请求  建立请求时  参数以？+参数的形式传送
    if (setting.type === 'get' || "GET") {
        var url = setting.data ? setting.url + "?" + data : url;
        xhr.open(setting.type, url, setting.async);
        xhr.send(null);
    } else {
        xhr.open(setting.type, setting.url, setting.async);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded,charset=utf-8")
        xhr.send(data);
    }

}
// 调用
// ajax({
//         type: "get",
//         url: "http://localhost:8080/getData",
//         data: {
//             name: "gy",
//             age: 18
//         },
//         dataType: "josn",
//         success: function(data) {
//             console.log(data)
//         },
//         err: function() {}
//     })
//合并对象的函数
function extend() {
    for (var i = 0; i < arguments.length; i++) {
        for (var k in arguments[i]) {
            arguments[0][k] = arguments[i][k]
        }
    }
    return arguments[0]
}
//格式化 参数
function format(obj) {
    var arr = [];
    for (var i in obj) {
        arr.push(i + "=" + obj[i])
    }
    return arr.join("&")
}