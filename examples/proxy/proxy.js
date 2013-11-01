var request = require('request');
var http = require('http');
var metaserve = require('metaserve')('../../');

http.createServer(function(req, res) {
  if (req.url.match(/^\/proxy/)) {
    // Handle the custom route
    return proxy(req, res);
  } else {
    // Fall back to metaserve
    metaserve(req, res);
  }
}).listen(8080);

function notFound (res) {
  res.statusCode = 404;
  res.end('404 Error');
}

function proxy (req, res) {
  var url = req.url;

  var test = {
    proxy: /^\/proxy\/(.+)$/,
    hosts: /^https?:\/\/(geotrigger\.)?arcgis\.com\//
  };

  var matchProxy = url.match(test.proxy);

  if (!matchProxy) {
    return notFound(res);
  }

  var target = matchProxy[1];
  var matchHosts = target.match(test.hosts);

  if (!matchHosts) {
    return notFound(res);
  }

  var headers = req.headers;
  var method = req.method;

  console.log(method + ' ' + url);

  if (!headers['content-type']) {
    if (matchProxy[1].match(/geotrigger\.arcgis\.com\//)) {
      headers['content-type'] = 'application/json';
    } else {
      headers['content-type'] = 'application/x-www-form-urlencoded';
    }
  }

  delete headers.host;

  req.pipe(request({
    url: target,
    headers: headers,
    method: method
  })).pipe(res);

}

console.log('proxy server running on port 8080');