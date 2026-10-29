// CloudFront Function (viewer request): /about -> /about.html
function handler(event) {
    var request = event.request;
    // Redirect /about/ -> /about, otherwise relative paths (assets/, partners/) resolve under /about/ and 404.
    if (request.uri === '/about/') {
        return { statusCode: 301, statusDescription: 'Moved Permanently', headers: { location: { value: '/about' } } };
    }
    if (request.uri === '/about') {
        request.uri = '/about.html';
    }
    return request;
}
