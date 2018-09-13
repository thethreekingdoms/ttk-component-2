//import 'fetch-ie8'
import fetchJsonp from 'fetch-jsonp';
import { SuperFetch } from './SuperFetch';
import { Util } from './commontypes/Util';
import { error } from 'util';
const crossDomain = window.crossDomain;
/**
 * @member SuperFetch.CORS
 * @description 是否支持跨域
 * @type {boolean}
 */
export var CORS = SuperFetch.CORS = SuperFetch.CORS || (window.XMLHttpRequest && 'withCredentials' in new window.XMLHttpRequest());
/**
 * @member SuperFetch.RequestTimeout
 * @description 请求超时时间，默认45s
 * @type {number}
 */
export var RequestTimeout = SuperFetch.RequestTimeout = SuperFetch.RequestTimeout || 45000;

export var FetchRequest = SuperFetch.FetchRequest = {
    commit: function (method, url, params, options) {
        method = method ? method.toUpperCase() : method;
        switch (method) {
            case 'GET':
                return this.get(url, params, options);
            case 'POST':
                return this.post(url, params, options);
            case 'PUT':
                return this.put(url, params, options);
            case 'DELETE':
                return this.delete(url, params, options);
            default:
                return this.get(url, params, options);
        }
    },

    get: function (url, params, options) {
        options = options || {};
        var type = 'GET';
        url = this._processUrl(url, options);
        url = Util.urlAppend(url, this._getParameterString(params || {}));
        if (!this.urlIsLong(url)) {
            if (Util.isInTheSameDomain(url) || CORS || options.proxy) {
                return this._fetch(url, params, options, type);
            }
            if (!Util.isInTheSameDomain(url)) {
                url = url.replace('.json', '.jsonp');
                return this._fetchJsonp(url, options);
            }
        }
        return this._postSimulatie(type, url.substring(0, url.indexOf('?') - 1), params, options);
    },

    delete: function (url, params, options) {
        options = options || {};
        var type = 'DELETE';
        url = this._processUrl(url, options);
        url = Util.urlAppend(url, this._getParameterString(params || {}));
        if (!this.urlIsLong(url) && CORS) {
            return this._fetch(url, params, options, type);
        }
        return this._postSimulatie(type, url.substring(0, url.indexOf('?') - 1), params, options);
    },

    post: function (url, params, options) {
        options = options || {};
        return this._fetch(this._processUrl(url, options), params, options, 'POST');
    },

    put: function (url, params, options) {
        options = options || {};
        return this._fetch(this._processUrl(url, options), params, options, 'PUT');
    },
    urlIsLong: function (url) {
        //当前url的字节长度。
        var totalLength = 0,
            charCode = null;
        for (var i = 0, len = url.length; i < len; i++) {
            //转化为Unicode编码
            charCode = url.charCodeAt(i);
            if (charCode < 0x007f) {
                totalLength++;
            } else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {
                totalLength += 2;
            } else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {
                totalLength += 3;
            }
        }
        return (totalLength < 2000) ? false : true;
    },
    _postSimulatie: function (type, url, params, options) {
        var separator = url.indexOf("?") > -1 ? "&" : "?";
        url += separator + '_method=' + type;
        if (typeof params !== 'string') {
            params = JSON.stringify(params);
        }
        return this.post(url, params, options);
    },

    _processUrl: function (url, options) {
        if (options && options.proxy) {
            if (typeof options.proxy === "function") {
                url = options.proxy(url);
            } else {
                //url = decodeURIComponent(url);
                // url = options.proxy + encodeURIComponent(url);
                url = options.proxy + url
            }
        }
        return url;
    },



    _fetch: function (url, params, options, type) {


        // if(!Util.isArray(params)){
        params = JSON.stringify(params);
        // }
        options = options || {};
        options.headers = options.headers || {};
        if (!options.headers['Content-Type']) {
            // options.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
            options.headers['Content-Type'] = 'application/json;charset=utf-8'
        }
        if (!options.headers['token']) {
            options.headers['token'] = null;
        }
        if (options.timeout) {
            return this._timeout(options.timeout, fetch(url, {
                method: type,
                headers: options.headers,
                body: type === 'PUT' || type === 'POST' ? params : undefined,
                credentials: options.withCredentials ? 'include' : 'omit',
                mode: 'cors',
                timeout: RequestTimeout
            }).then(function (response) {
                return response;
            }));
        }

        return fetch(url, {
            method: type,
            body: type === 'PUT' || type === 'POST' ? params : undefined,
            headers: options.headers,
            credentials: options.withCredentials ? 'include' : 'omit',
            mode: 'cors',
            timeout: RequestTimeout
        })
            .then(checkStatus)
            .then(parseJSON)
            .then((data) => (data))
            .catch((err) => (err))

        function checkStatus(response) {
            // if (response.status >= 200 && response.status < 300) {
            return response;
            // }
            //const error = new Error(response.statusText);
            // error.response = response;
            // throw error;
        }
        function parseJSON(response) {
            return response.json();
        }
    },

    _fetchJsonp: function (url, options) {
        options = options || {};
        return fetchJsonp(url, { method: 'GET', timeout: options.timeout })
            .then(function (response) {
                return response;
            });
    },

    _timeout: function (seconds, promise) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                reject(new Error("timeout"))
            }, seconds)
            promise.then(resolve, reject)
        })
    },

    _getParameterString: function (params) {
        var paramsArray = [];
        for (var key in params) {
            var value = params[key];
            if ((value != null) && (typeof value !== 'function')) {
                var encodedValue;
                if (typeof value === 'object' && value.constructor === Array) {
                    var encodedItemArray = [];
                    var item;
                    for (var itemIndex = 0, len = value.length; itemIndex < len; itemIndex++) {
                        item = value[itemIndex];
                        encodedItemArray.push(encodeURIComponent(
                            (item === null || item === undefined) ? "" : item)
                        );
                    }
                    encodedValue = '[' + encodedItemArray.join(",") + ']';
                } else {
                    encodedValue = encodeURIComponent(value);
                }
                paramsArray.push(encodeURIComponent(key) + "=" + encodedValue);
            }
        }
        return paramsArray.join("&");
    }
};