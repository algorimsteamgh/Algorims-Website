// Ported 1:1 from `awsIcon()` in assets/js/site.js — maps an AWS service
// name to a representative Lucide icon by keyword, most specific pattern
// first. Used by AwsServices.astro when rendering `aws[]` entries on
// solutions/products detail pages.
const RULES: [RegExp, string][] = [
  [/guardrail/, "shield-check"],
  [/guardduty|macie|waf|shield|cloudtrail|vpc|\bwaf\b/, "shield"],
  [/knowledge base|kendra/, "book-open"],
  [/bedrock|claude|sagemaker|comprehend medical/, "sparkles"],
  [/textract|\bocr\b/, "scan-text"],
  [/step function/, "workflow"],
  [/lambda/, "zap"],
  [/eventbridge|event-driven/, "radio"],
  [/aurora|dynamodb|rds|postgres|pgvector/, "database"],
  [/opensearch|search/, "search"],
  [/cognito/, "user-check"],
  [/\bkms\b|encrypt/, "key-round"],
  [/quicksight|dashboard|analytics/, "bar-chart-3"],
  [/connect/, "headset"],
  [/\blex\b/, "bot"],
  [/contact lens|transcrib/, "audio-lines"],
  [/pinpoint|\bses\b|\bsns\b/, "send"],
  [/\bs3\b|storage/, "hard-drive"],
  [/a2i|human-in-the-loop/, "user-round-check"],
  [/\bsqs\b|\bdlq\b|queue/, "layers"],
  [/comprehend|translate|language/, "languages"],
  [/api gateway|cloudfront|\bcdn\b/, "network"],
];

export function awsIcon(name = ""): string {
  const n = name.toLowerCase();
  for (const [re, ic] of RULES) {
    if (re.test(n)) return ic;
  }
  return "cloud";
}
