const { post } = require('request');
const fetch = require('node-fetch')

module.exports = {
    randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    format(){
        var args = Array.prototype.slice.call (arguments, 1);
        return arguments[0].replace (/\{(\d+)\}/g, function (match, index) {
            return args[index];
        });
    },
    async sendPostJsonAsync(url, params){
        const options = {
            uri: url,
            method: 'POST',
            body: params,
            json:true
        }
        try {
            const fetchResponse = await fetch(url, options);
            const data = await fetchResponse.json();
            return data;
        } catch (e) {
            return e;
        }  
    },
    sendPostJson(url, params, callback){
        const options = {
            uri: url,
            method: 'POST',
            body: params,
            json:true
        }
        post(url, options, callback)
    },
    sendPostJson(url, params, headers, callback){
        const options = {
            uri: url,
            method: 'POST',
            body: params,
            json:true,
            headers:headers
        }
        post(url, options, callback)
    }
}