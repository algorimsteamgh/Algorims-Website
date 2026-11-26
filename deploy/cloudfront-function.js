// CloudFront Function (viewer-request) for the Algorims S3 + CloudFront deploy.
//
// Problem: S3 used as a plain REST origin (via `aws s3 sync`, see
// .github/workflows/deploy-s3.yml) only serves an object on an EXACT key
// match. It does not auto-resolve "/case-studies/foo/" to
// "case-studies/foo/index.html" the way S3 website-hosting mode or the
// nginx `try_files $uri $uri/ /index.html` rule (deploy/nginx-algorims.conf)
// does. Without this rewrite, every directory-style route 404s at the S3
// origin, CloudFront's error-response fallback silently serves the ROOT
// index.html instead (200 OK), and that page's relative asset paths then
// resolve wrong under the sub-path — breaking the page entirely.
//
// Fix: rewrite the request URI before it reaches S3 so directory-style
// paths resolve to their own index.html, same as the nginx behavior.
//
// Runtime: cloudfront-js-1.0
// Attach as: DefaultCacheBehavior (and any other behaviors serving HTML)
//            -> Function associations -> Viewer request

// Canonical host: the bare domain redirects to www. Forms post to the lead
// alert API, which only accepts the site's own origin, and serving both hosts
// splits search ranking between duplicate copies of every page.
var APEX_HOST = "algorims.com";
var CANONICAL_ORIGIN = "https://www.algorims.com";

function queryString(querystring) {
  var parts = [];
  for (var key in querystring) {
    var entry = querystring[key];
    var values = entry.multiValue ? entry.multiValue : [entry];
    for (var i = 0; i < values.length; i++) {
      parts.push(values[i].value === "" ? key : key + "=" + values[i].value);
    }
  }
  return parts.length ? "?" + parts.join("&") : "";
}

function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var host = request.headers.host ? request.headers.host.value.toLowerCase() : "";

  if (host === APEX_HOST) {
    return {
      statusCode: 301,
      statusDescription: "Moved Permanently",
      headers: {
        location: { value: CANONICAL_ORIGIN + uri + queryString(request.querystring) },
        "cache-control": { value: "max-age=3600" },
      },
    };
  }

  if (uri.endsWith("/")) {
    // "/case-studies/foo/" -> "/case-studies/foo/index.html"
    request.uri += "index.html";
  } else if (!uri.includes(".")) {
    // "/case-studies/foo" -> "/case-studies/foo/index.html"
    // (no file extension in the last segment, so treat it as a directory)
    request.uri += "/index.html";
  }
  // Paths with a file extension (.webp, .css, .js, ...) or the root "/"
  // that already resolves to "index.html" are left untouched.

  return request;
}
