#!/usr/bin/env bash
# Creates/updates the SPA index-rewrite CloudFront Function and attaches it
# to the algorims-website distribution as a viewer-request function on the
# default cache behavior. Fixes: direct loads / refreshes of any sub-route
# (e.g. /case-studies/<slug>/) serving a broken page instead of that page's
# own index.html. See deploy/cloudfront-function.js for the root-cause
# explanation.
#
# Requires: aws CLI (authenticated with permission on the CloudFront
# distribution), jq.
#
# Usage:
#   ./deploy/attach-cloudfront-function.sh
#
# Safe to re-run: creates the function on first run, updates it on
# subsequent runs, and only edits the FunctionAssociations block of the
# distribution config (everything else is passed through untouched).

set -euo pipefail

DIST_ID="ESYSC15E546OI"
FUNCTION_NAME="algorims-spa-index-rewrite"
FUNCTION_FILE="$(dirname "$0")/cloudfront-function.js"

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required (brew install jq)" >&2
  exit 1
fi

echo "== Checking for existing function '$FUNCTION_NAME' =="
if aws cloudfront describe-function --name "$FUNCTION_NAME" --stage DEVELOPMENT >/tmp/cff-describe.json 2>/dev/null; then
  ETAG=$(jq -r '.ETag' /tmp/cff-describe.json)
  echo "Function exists, updating code (ETag $ETAG)..."
  aws cloudfront update-function \
    --name "$FUNCTION_NAME" \
    --if-match "$ETAG" \
    --function-config Comment="Rewrite directory-style SPA routes to their index.html",Runtime=cloudfront-js-1.0 \
    --function-code "fileb://$FUNCTION_FILE" \
    > /tmp/cff-update.json
  UPDATE_ETAG=$(jq -r '.ETag' /tmp/cff-update.json)
else
  echo "Creating function..."
  aws cloudfront create-function \
    --name "$FUNCTION_NAME" \
    --function-config Comment="Rewrite directory-style SPA routes to their index.html",Runtime=cloudfront-js-1.0 \
    --function-code "fileb://$FUNCTION_FILE" \
    > /tmp/cff-create.json
  UPDATE_ETAG=$(jq -r '.ETag' /tmp/cff-create.json)
fi

echo "== Publishing function =="
aws cloudfront publish-function --name "$FUNCTION_NAME" --if-match "$UPDATE_ETAG" > /tmp/cff-publish.json
FUNCTION_ARN=$(jq -r '.FunctionSummary.FunctionMetadata.FunctionARN' /tmp/cff-publish.json)
echo "Published: $FUNCTION_ARN"

echo "== Fetching distribution config ($DIST_ID) =="
aws cloudfront get-distribution-config --id "$DIST_ID" > /tmp/cff-dist.json
DIST_ETAG=$(jq -r '.ETag' /tmp/cff-dist.json)

echo "== Patching DefaultCacheBehavior.FunctionAssociations =="
jq --arg arn "$FUNCTION_ARN" '
  .DistributionConfig.DefaultCacheBehavior.FunctionAssociations = {
    Quantity: 1,
    Items: [
      { EventType: "viewer-request", FunctionARN: $arn }
    ]
  }
  | .DistributionConfig
' /tmp/cff-dist.json > /tmp/cff-dist-config-new.json

echo "== Updating distribution =="
aws cloudfront update-distribution \
  --id "$DIST_ID" \
  --if-match "$DIST_ETAG" \
  --distribution-config file:///tmp/cff-dist-config-new.json \
  > /tmp/cff-update-dist.json

echo "== Invalidating cache =="
aws cloudfront create-invalidation --distribution-id "$DIST_ID" --paths "/*"

echo "Done. CloudFront deploys typically take 3-5 minutes to propagate."
echo "Verify with: curl -sI https://www.algorims.com/case-studies/finance-document-automation/"
