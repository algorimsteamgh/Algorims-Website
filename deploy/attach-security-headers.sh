#!/usr/bin/env bash
# Creates/updates a CloudFront response headers policy with baseline security
# headers and attaches it to the default cache behavior of the
# algorims-website distribution.
#
# Headers set on every response:
#   Strict-Transport-Security  max-age=31536000 (no includeSubDomains/preload:
#                              enable those only once every subdomain is HTTPS)
#   X-Content-Type-Options     nosniff
#   X-Frame-Options            DENY
#   Referrer-Policy            strict-origin-when-cross-origin
#   Permissions-Policy         camera, microphone, geolocation, payment off
#   Content-Security-Policy    frame-ancestors/base-uri/object-src/form-action
#                              only. This blocks clickjacking, <base> hijacking
#                              and plugins without restricting scripts, so it
#                              cannot break the Chatling widget or the inline
#                              config script. A full script-src policy is a
#                              separate, later step (report-only first).
#
# Requires: aws CLI (authenticated with permission on the CloudFront
# distribution), jq.
#
# Usage:
#   ./deploy/attach-security-headers.sh
#
# Safe to re-run: creates the policy on first run, updates it afterwards.
# Refuses to replace a different response headers policy that is already
# attached.

set -euo pipefail

DIST_ID="ESYSC15E546OI"
POLICY_NAME="algorims-security-headers"

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required (brew install jq)" >&2
  exit 1
fi

WORK_DIR="$(mktemp -d)"
trap 'rm -rf "$WORK_DIR"' EXIT

cat > "$WORK_DIR/policy.json" <<JSON
{
  "Name": "$POLICY_NAME",
  "Comment": "Baseline security headers for www.algorims.com",
  "SecurityHeadersConfig": {
    "StrictTransportSecurity": {
      "Override": true,
      "AccessControlMaxAgeSec": 31536000,
      "IncludeSubdomains": false,
      "Preload": false
    },
    "ContentTypeOptions": { "Override": true },
    "FrameOptions": { "Override": true, "FrameOption": "DENY" },
    "ReferrerPolicy": {
      "Override": true,
      "ReferrerPolicy": "strict-origin-when-cross-origin"
    },
    "ContentSecurityPolicy": {
      "Override": true,
      "ContentSecurityPolicy": "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self' https://api.web3forms.com"
    }
  },
  "CustomHeadersConfig": {
    "Quantity": 1,
    "Items": [
      {
        "Header": "Permissions-Policy",
        "Value": "camera=(), microphone=(), geolocation=(), payment=()",
        "Override": true
      }
    ]
  }
}
JSON

echo "== Checking for existing policy '$POLICY_NAME' =="
POLICY_ID=$(aws cloudfront list-response-headers-policies --type custom \
  | jq -r --arg name "$POLICY_NAME" '
      .ResponseHeadersPolicyList.Items // []
      | map(select(.ResponseHeadersPolicy.ResponseHeadersPolicyConfig.Name == $name))
      | .[0].ResponseHeadersPolicy.Id // empty')

if [ -n "$POLICY_ID" ]; then
  ETAG=$(aws cloudfront get-response-headers-policy --id "$POLICY_ID" | jq -r '.ETag')
  echo "Policy exists ($POLICY_ID), updating..."
  aws cloudfront update-response-headers-policy \
    --id "$POLICY_ID" \
    --if-match "$ETAG" \
    --response-headers-policy-config "file://$WORK_DIR/policy.json" \
    > /dev/null
else
  echo "Creating policy..."
  POLICY_ID=$(aws cloudfront create-response-headers-policy \
    --response-headers-policy-config "file://$WORK_DIR/policy.json" \
    | jq -r '.ResponseHeadersPolicy.Id')
fi
echo "Policy id: $POLICY_ID"

echo "== Fetching distribution config ($DIST_ID) =="
aws cloudfront get-distribution-config --id "$DIST_ID" > "$WORK_DIR/dist.json"
DIST_ETAG=$(jq -r '.ETag' "$WORK_DIR/dist.json")

echo "== Attaching policy to DefaultCacheBehavior =="
jq --arg id "$POLICY_ID" '
  .DistributionConfig
  | (.DefaultCacheBehavior.ResponseHeadersPolicyId // "") as $current
  | if $current != "" and $current != $id
    then error("a different response headers policy is already attached: " + $current)
    else .DefaultCacheBehavior.ResponseHeadersPolicyId = $id
    end
' "$WORK_DIR/dist.json" > "$WORK_DIR/dist-new.json"

aws cloudfront update-distribution \
  --id "$DIST_ID" \
  --if-match "$DIST_ETAG" \
  --distribution-config "file://$WORK_DIR/dist-new.json" \
  > /dev/null

echo "== Invalidating cache =="
aws cloudfront create-invalidation --distribution-id "$DIST_ID" --paths "/*" > /dev/null

echo "Done. CloudFront deploys typically take 3-5 minutes to propagate."
echo "Verify with: curl -sI https://www.algorims.com/ | grep -iE 'strict-transport|x-frame|x-content-type|referrer-policy|permissions-policy|content-security'"
