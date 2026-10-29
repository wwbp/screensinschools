// CloudFront Function (viewer request, cloudfront-js-2.0).
// www -> apex, /about and /about.html -> /about/, folder URLs -> index.html.
function handler(event) {
    var request = event.request;
    var uri = request.uri;
    var host = request.headers.host ? request.headers.host.value : '';

    if (host.indexOf('www.') === 0) {
        return redirect('https://' + host.slice(4) + uri + querystring(request.querystring));
    }
    if (uri === '/about' || uri === '/about.html') {
        return redirect('/about/');
    }
    if (uri.endsWith('/')) {
        request.uri = uri + 'index.html';
    }
    return request;
}

function redirect(location) {
    return { statusCode: 301, statusDescription: 'Moved Permanently', headers: { location: { value: location } } };
}

function querystring(qs) {
    var parts = [];
    Object.keys(qs || {}).forEach(function (key) {
        var values = qs[key].multiValue ? qs[key].multiValue : [qs[key]];
        values.forEach(function (v) {
            parts.push(encodeURIComponent(key) + (v.value === '' ? '' : '=' + encodeURIComponent(v.value)));
        });
    });
    return parts.length ? '?' + parts.join('&') : '';
}
