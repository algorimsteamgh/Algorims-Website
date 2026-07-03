import type { NarrativeEntry } from "./types";

export const solutions = [
  {
    "slug": "autonomous-customer-operations",
    "source": {
      "href": "/case-studies",
      "label": "Case Studies"
    },
    "kind": "Case Study",
    "tag": "Autonomous Customer Operations · Insurance",
    "title": "Deflecting 68% of customer queries to AI self-service with Amazon Connect",
    "subtitle": "An AI-native contact centre layer built on Amazon Connect — conversational self-service, real-time agent assist, and event-driven outbound — deployed entirely inside a regional insurer's AWS account.",
    "glyph": "headset",
    "accent": "hsl(265 85% 58%)",
    "meta": [
      {
        "label": "Industry",
        "value": "Insurance · Financial Services"
      },
      {
        "label": "Region",
        "value": "Singapore · Malaysia · Australia"
      },
      {
        "label": "Platform",
        "value": "Amazon Connect + Bedrock Claude 4.5"
      },
      {
        "label": "Compliance",
        "value": "PDPA · MAS TRM · Privacy Act 1988"
      }
    ],
    "intro": [
      "A regional insurance group operating across Singapore, Malaysia, and Australia handled over 1.2 million customer interactions a year through a traditional contact centre — policy enquiries, claims status checks, renewal reminders, and complaints, all handled by human agents working across disconnected systems. With rising call volumes, agent attrition above 35%, and CSAT stuck at 58%, the client needed to fundamentally reimagine how customer operations were delivered.",
      "The goal: resolve the majority of queries autonomously, surface the right information to agents in real time during live calls, and eliminate the manual effort behind routine outreach — without sacrificing service quality or MAS TRM and PDPA compliance. The answer was an AI-native contact centre layer on Amazon Connect, powered by Amazon Bedrock Claude 4.5, running entirely within the client's AWS environment."
    ],
    "challenge": {
      "lead": "At this scale, traditional contact-centre operations surface compounding failures that no amount of additional headcount can sustainably solve:",
      "items": [
        "Agents spent 40% of every call searching across 4–5 disconnected systems — inflating average handle time to 18 minutes.",
        "68% of inbound calls were routine enquiries that required no human judgment but consumed full agent capacity.",
        "DTMF-only IVR with no natural-language understanding drove a 38% abandonment rate before customers reached an agent.",
        "No real-time guidance during live calls — decisions relied on memory, static scripts, and supervisor interruptions.",
        "Outbound renewal and payment reminders were batch-processed weekly by hand, causing missed contacts and preventable lapses.",
        "Sentiment was never monitored mid-call — frustrated customers were only identified after a complaint had already escalated.",
        "Post-call notes took 8–12 minutes per agent, consuming 15% of productive capacity across the centre."
      ]
    },
    "solutionLead": "Algorims built its Autonomous Customer Operations Platform inside the client's AWS account — combining conversational AI self-service, real-time agent assistance, intelligent outbound, and live analytics into one platform across voice, web chat, WhatsApp, and mobile.",
    "solution": [
      {
        "h": "Conversational self-service layer",
        "p": "Amazon Lex powers a natural-language IVR across English, Mandarin, Bahasa Malaysia, and Tamil. Customers check policy status, get claims updates, make payments, and request callbacks — all without an agent. When a human is needed, the AI gathers full context before transfer so the agent begins already informed. Contact Lens streams live transcription with sentiment monitoring that alerts supervisors before frustration escalates."
      },
      {
        "h": "Real-time agent assist desktop",
        "p": "A unified AI Agent Desktop inside the Amazon Connect CCP surfaces a complete customer view — policies, claims, billing, and prior interactions — within 800ms of connect via an intelligent screen pop. Bedrock Claude 4.5 generates contextual next-action prompts that update as the conversation moves, and a Kendra-backed knowledge search answers coverage questions in under 5 seconds. Post-call, Bedrock auto-generates a structured summary — removing manual note-taking from 120+ agents."
      },
      {
        "h": "Event-driven outbound engine",
        "p": "An intelligent outbound engine uses Amazon Pinpoint and SES to orchestrate personalised renewal reminders, payment nudges, and claims notifications — triggered by real-time policy events via EventBridge, not weekly batches. Every state change automatically initiates the right touchpoint through the customer's preferred channel, while QuickSight dashboards give managers a live view of queue depth, sentiment, and deflection refreshed every 30 seconds."
      }
    ],
    "awsLead": "Built entirely on AWS managed services, deployed within the client's account — no data leaves their environment:",
    "aws": [
      {
        "name": "Amazon Connect",
        "desc": "Omnichannel contact centre — voice, chat, and outbound across three markets."
      },
      {
        "name": "Amazon Lex",
        "desc": "Conversational IVR with NLU across four languages."
      },
      {
        "name": "Contact Lens",
        "desc": "Real-time transcription, sentiment, and post-call analytics."
      },
      {
        "name": "Amazon Bedrock (Claude 4.5)",
        "desc": "Agent guidance, knowledge answers, and post-call summarisation."
      },
      {
        "name": "Amazon Kendra",
        "desc": "Policy and knowledge-base search returning answers in under 5 seconds."
      },
      {
        "name": "AWS Step Functions",
        "desc": "Outbound campaign and multi-step journey orchestration."
      },
      {
        "name": "Amazon EventBridge",
        "desc": "Event-driven outbound triggers from policy and claims state changes."
      },
      {
        "name": "Amazon Pinpoint + SES",
        "desc": "Personalised SMS, push, WhatsApp, and email delivery."
      },
      {
        "name": "Amazon DynamoDB",
        "desc": "Unified interaction history, session state, and configuration."
      },
      {
        "name": "Amazon QuickSight",
        "desc": "Real-time queue, sentiment, deflection, and SLA dashboards."
      },
      {
        "name": "Amazon S3 + KMS",
        "desc": "Encrypted call-recording storage with per-client CMK."
      },
      {
        "name": "Cognito · WAF · VPC · CloudTrail",
        "desc": "Authentication, network security, and audit logging."
      }
    ],
    "results": [
      "Deflected <strong>68% of inbound calls</strong> to AI self-service within 90 days of go-live.",
      "Average handle time cut from 18 minutes to <strong>8.6 minutes</strong> — a 52% reduction.",
      "First-call resolution rose from 34% to <strong>71%</strong> with unified customer context.",
      "Post-call note-writing <strong>eliminated</strong> — summaries auto-generated within 60 seconds.",
      "Outbound renewal contact rate improved from 41% to <strong>79%</strong>.",
      "Policy lapse rate reduced by <strong>28%</strong> via real-time payment-nudge workflows.",
      "Agent onboarding cut from 6 weeks to <strong>2.5 weeks</strong>.",
      "CSAT improved from 58% to <strong>81%</strong> within 6 months."
    ],
    "metrics": [
      {
        "value": "68%",
        "label": "Inbound queries deflected to AI — no agent required"
      },
      {
        "value": "52%",
        "label": "Reduction in average handle time (18 → 8.6 min)"
      },
      {
        "value": "81%",
        "label": "Customer satisfaction — up from 58%"
      },
      {
        "value": "✓",
        "label": "Real-time sentiment monitoring across 100% of live calls"
      },
      {
        "value": "✓",
        "label": "Post-call summaries auto-generated for 120+ agents"
      },
      {
        "value": "✓",
        "label": "MAS TRM & PDPA compliant — data residency ap-southeast-1"
      }
    ],
    "faqs": [
      {
        "q": "Does the platform work across voice, chat, and digital channels?",
        "a": "Yes — voice (Amazon Connect), web chat, WhatsApp, mobile push, and email, all with a consistent AI backbone and unified interaction history."
      },
      {
        "q": "How does the AI know what to say to agents during a live call?",
        "a": "Contact Lens streams a real-time transcript; Bedrock Claude 4.5 reads it alongside the customer's policy history and current context to generate next-action prompts that update as the call progresses — without the agent navigating away."
      },
      {
        "q": "Does customer data leave the client's AWS account?",
        "a": "No. All AI inference, recording, transcription, and analytics run within the client's own AWS account and region. Data never transits Algorims infrastructure."
      },
      {
        "q": "What does the outbound engine trigger on?",
        "a": "EventBridge listens to policy and claims events in real time — every state change automatically triggers the right outbound message through the customer's preferred channel within minutes, not days."
      },
      {
        "q": "How long does implementation take?",
        "a": "Standard implementation runs 16–18 weeks: Connect + Lex build, AI pipeline and agent desktop, outbound engine and integrations, then UAT and go-live hardening."
      }
    ],
    "related": [
      "intelligent-document-processing",
      "operations-automation"
    ]
  },
  {
    "slug": "intelligent-document-processing",
    "source": {
      "href": "/case-studies",
      "label": "Case Studies"
    },
    "kind": "Case Study",
    "tag": "Intelligent Document Processing · Financial Services",
    "title": "Reducing document processing time by 97% with AI on AWS",
    "subtitle": "A production-grade, AWS-native IDP platform processing 10,000+ documents a day at 99%+ accuracy in under 45 seconds — eliminating manual data entry across invoices, KYC packets, and loan applications.",
    "glyph": "file-text",
    "accent": "hsl(265 85% 58%)",
    "meta": [
      {
        "label": "Industry",
        "value": "Financial Services · Insurance · Healthcare"
      },
      {
        "label": "Region",
        "value": "Singapore (ap-southeast-1) · ASEAN"
      },
      {
        "label": "Platform",
        "value": "Amazon Textract + Bedrock Claude 4.5"
      },
      {
        "label": "Compliance",
        "value": "PDPA · MAS TRM · HIPAA"
      }
    ],
    "intro": [
      "Large enterprises across financial services, insurance, healthcare, and government process millions of documents a year through manual workflows — slow, error-prone, and linearly expensive. A leading Singapore financial services group set out to eliminate manual data entry from its accounts payable, KYC onboarding, and loan processing operations.",
      "With 15–20 FTEs re-keying data from invoices, contracts, and identity documents into SAP and Salesforce every day, the client needed a solution that could handle 10,000+ documents daily at 99%+ accuracy — while staying fully compliant with Singapore's PDPA and MAS TRM requirements. Legacy OCR had already failed them. A new approach built natively on AWS was the answer."
    ],
    "challenge": {
      "lead": "Document processing at scale surfaces a consistent set of failures that manual workflows and legacy OCR cannot solve:",
      "items": [
        "Manual entry introduced 1–3% field error rates, causing downstream reconciliation failures and payment disputes.",
        "Invoice approval cycles of 14–30 days delayed supplier payments and attracted penalty interest.",
        "Doubling document volume required doubling headcount — costs scaled linearly with no automation leverage.",
        "Legacy OCR (ABBYY, Kofax) broke on new supplier layouts and lacked semantic understanding of content.",
        "Documents arrived in English, Mandarin, Bahasa Malaysia, and Tamil with no unified multilingual pipeline.",
        "No immutable audit trail existed to satisfy MAS TRM and PDPA regulatory requirements.",
        "Valuable data locked inside unstructured documents stayed inaccessible to analytics and reporting."
      ]
    },
    "solutionLead": "Algorims deployed its Intelligent Document Processing platform inside the client's AWS account — a cloud-native system that converts unstructured documents into structured, validated, searchable data at above 99% accuracy and below USD 0.08 per document.",
    "solution": [
      {
        "h": "Cost-optimised 5-tier pipeline",
        "p": "Each document is routed to the cheapest AI tier that meets its accuracy requirement — from Textract-only at USD 0.015/page for structured forms, up to full Bedrock + Human-in-the-Loop at USD 0.073/page for critical regulated documents. Bedrock Claude 4.5 classifies every document type, extracts fields with semantic understanding, and applies configurable business-rule validation — all within 45 seconds end-to-end."
      },
      {
        "h": "Confidence-gated human review",
        "p": "A Human-in-the-Loop layer powered by Amazon A2I routes only genuinely ambiguous fields to reviewers, with a side-by-side bounding-box interface that cuts review time from 15 minutes to under 3 per document. Every correction feeds back into the extraction model, driving HIL routing from 18% at launch to under 4% within 90 days — a system that gets more accurate the longer it runs."
      },
      {
        "h": "Straight-through enterprise integration",
        "p": "Pre-built connectors deliver structured JSON directly into the client's SAP (RFC/BAPI), Salesforce (REST), and ServiceNow systems — with HMAC-signed payloads, retry logic, and a full immutable audit trail. All processing runs within the client's own account in ap-southeast-1, ensuring data sovereignty and regulatory compliance from day one."
      }
    ],
    "awsLead": "Built entirely on AWS managed services — no proprietary models, no vendor lock-in, no data leaving the client's account:",
    "aws": [
      {
        "name": "Amazon Textract",
        "desc": "OCR, forms, and table extraction across 10 document types."
      },
      {
        "name": "Amazon Bedrock (Claude 4.5)",
        "desc": "Classification, semantic field extraction, and summarisation."
      },
      {
        "name": "Amazon A2I",
        "desc": "Managed Human-in-the-Loop review with confidence-gated routing."
      },
      {
        "name": "AWS Step Functions (Express)",
        "desc": "End-to-end workflow orchestration with parallel fan-out."
      },
      {
        "name": "AWS Lambda (Graviton3)",
        "desc": "Serverless workers — 20% more cost-efficient than x86."
      },
      {
        "name": "Amazon SQS + DLQ",
        "desc": "Ingestion queuing, parallel page processing, zero message loss."
      },
      {
        "name": "Amazon DynamoDB",
        "desc": "Job metadata, extraction results, and 7-year audit trail."
      },
      {
        "name": "Amazon OpenSearch",
        "desc": "Full-text search across millions of records in under 2 seconds."
      },
      {
        "name": "Comprehend + Translate",
        "desc": "Entity extraction and multilingual processing across four languages."
      },
      {
        "name": "Amazon S3 + KMS",
        "desc": "Encrypted storage with lifecycle policies and per-client CMK."
      },
      {
        "name": "API Gateway + CloudFront",
        "desc": "REST API delivery and web-portal CDN."
      },
      {
        "name": "WAF · Shield · VPC · CloudTrail",
        "desc": "Security, network isolation, and audit logging."
      }
    ],
    "results": [
      "Processed <strong>10,000+ documents per day</strong> across invoices, KYC, POs, and loan applications.",
      "<strong>97% reduction</strong> in processing time — from 8–15 minutes to under 45 seconds.",
      "HIL review rate reduced from 100% to <strong>under 4%</strong> within 90 days.",
      "<strong>14 FTEs redeployed</strong> from manual entry to higher-value reconciliation work.",
      "Supplier payment cycle reduced from <strong>21 days to 4 days</strong>.",
      "MAS TRM and PDPA audit documentation accepted <strong>without a single revision</strong>.",
      "SAP, Salesforce, and ServiceNow integrated with <strong>zero manual re-keying</strong>.",
      "Full-text search across <strong>1M+ documents</strong> returning results in under 2 seconds."
    ],
    "metrics": [
      {
        "value": "97%",
        "label": "Reduction in processing time (15 min → 45 sec)"
      },
      {
        "value": "30–75×",
        "label": "ROI vs. manual cost (USD 2–5 → 0.03–0.08 per doc)"
      },
      {
        "value": "99%+",
        "label": "Field extraction accuracy with HIL review"
      },
      {
        "value": "✓",
        "label": "MAS TRM & PDPA compliant — KMS CMK per client"
      },
      {
        "value": "✓",
        "label": "10 document types — invoices, KYC, contracts, and more"
      },
      {
        "value": "✓",
        "label": "14 FTEs redeployed to higher-value analytical work"
      }
    ],
    "faqs": [
      {
        "q": "Does the platform work with documents in languages other than English?",
        "a": "Yes — English, Mandarin (Simplified and Traditional), Bahasa Malaysia, and Tamil via Amazon Translate and Comprehend, making it purpose-built for ASEAN operations."
      },
      {
        "q": "Does client data leave their AWS account during processing?",
        "a": "No. All AI inference, storage, and processing run entirely within the client's own AWS account and region. Data never transits Algorims infrastructure."
      },
      {
        "q": "How does it handle new document formats from new suppliers?",
        "a": "New layouts are mapped automatically to the existing extraction schema without template updates. New document types are configured within 5–10 business days."
      },
      {
        "q": "What compliance certifications does the platform support?",
        "a": "Designed for PDPA (Singapore), MAS TRM, HIPAA, Privacy Act 1988 (Australia), and GDPR — with controls implemented at the AWS architecture level, not applied as an overlay."
      },
      {
        "q": "How long does implementation take?",
        "a": "Standard implementation runs 16 weeks across four phases: Foundation → AI Pipeline → Portal & Integrations → Hardening & Launch."
      }
    ],
    "related": [
      "autonomous-customer-operations",
      "operations-automation"
    ]
  },
  {
    "slug": "operations-automation",
    "source": {
      "href": "/products",
      "label": "Products"
    },
    "kind": "Solution",
    "tag": "GenAI Operations Automation · Finance · HR · Ops",
    "title": "Cutting manual operations work by 40–70% for Singapore SMBs",
    "subtitle": "An AWS-native platform that automates the end-to-end document lifecycle across finance, HR, and operations — with UEN validation, GST checks, and PayNow matching built in, all inside the client's own account.",
    "glyph": "workflow",
    "accent": "hsl(265 85% 58%)",
    "meta": [
      {
        "label": "Industry",
        "value": "Financial Services · SMB · HR · Operations"
      },
      {
        "label": "Region",
        "value": "Singapore (ap-southeast-1) · ASEAN"
      },
      {
        "label": "Platform",
        "value": "Amazon Bedrock Claude + Textract"
      },
      {
        "label": "Compliance",
        "value": "PDPA · MAS TRM"
      }
    ],
    "intro": [
      "Singapore SMBs processing hundreds of invoices, staff claims, purchase orders, and HR documents every week face a common bottleneck — skilled finance and operations staff spending the majority of their time on manual data entry, document chasing, and exception handling rather than strategic work.",
      "Algorims GenAI Operations Automation eliminates that bottleneck. Built specifically for Singapore's business context — with UEN validation, GST checks, PayNow reference matching, and PDPA-conscious controls — it automates the full document lifecycle across finance, HR, and operations, and integrates with the tools SMBs already use: Xero, QuickBooks, Microsoft 365, and Google Drive."
    ],
    "challenge": {
      "lead": "At growth stage, manual processes that worked at 20 employees cannot scale to 100. The patterns are consistent across finance, HR, and operations:",
      "items": [
        "Finance staff spend 60–80% of their time keying invoice data, checking GST arithmetic, and chasing approvals.",
        "Staff claims and POs pile up in shared inboxes with no visibility into status or bottleneck location.",
        "Duplicate payments, GST errors, and mismatched vendor names surface only during audits — weeks too late.",
        "AR/AP reconciliation against bank statements is a spreadsheet exercise taking 3–5 days every month.",
        "HR teams draft job descriptions from scratch and read CVs without a consistent scoring framework.",
        "Operations managers have no real-time view of queue depth, SLA compliance, or automation performance.",
        "No audit trail exists to demonstrate PDPA-compliant handling of candidate, claims, and vendor data."
      ]
    },
    "solutionLead": "Algorims deployed a modular, AWS-native platform covering the full operations lifecycle — configured for Singapore business rules out of the box and organised around six production-ready modules, each deployable independently or together as a unified hub.",
    "solution": [
      {
        "h": "Intelligent Document Processing",
        "p": "Invoices, claims, receipts, and POs are uploaded in batches; Textract extracts content and Bedrock Claude normalises fields, classifies types, and scores confidence. A Singapore-specific validation engine checks UEN, GST registration and arithmetic, vendor similarity, PO matching, duplicate history, and PayNow format — before a reviewer sees anything. A side-by-side reviewer surfaces only genuine exceptions; clean documents move straight through."
      },
      {
        "h": "AR/AP Coding and Reconciliation",
        "p": "Bedrock Claude recommends GL codes for every line item from vendor history, description, and prior treatment — an accountant reviews only exceptions while clean items flow to the posting queue. Bank statements are matched against invoices, receipts, and PayNow references, and approved batches post to Xero, QuickBooks, or SAP Business One via signed REST connectors."
      },
      {
        "h": "AI HR Assistant",
        "p": "HR managers generate structured job descriptions from a few bullet points with TAFEP-aware language checks. Uploaded CVs are scored against the JD on skill fit, experience, and seniority; ranked scorecards surface the top candidates with supporting evidence. Interview transcripts are summarised into structured assessments, and every hiring decision is logged for explainability."
      },
      {
        "h": "Conversational Operations Assistant",
        "p": "A chat interface in both portals lets users query operational status, finance records, HR policies, and SOPs in natural language. Bedrock Knowledge Bases grounds every answer in the client's approved corpus with source citations — handling questions like “Show invoices pending GST validation this week” or “Why was claim CR-0042 flagged?” — with role-based retrieval access."
      },
      {
        "h": "Workflow, Approval, and HITL",
        "p": "Step Functions orchestrates the end-to-end state machine — ingestion, OCR, extraction, validation, confidence routing, review, approval, and ERP posting — with parallel fan-out and dead-letter handling. Approval routing is configurable by amount, department, vendor risk, and exception reason, with SLA-ageing SNS escalations and an immutable audit log of every action."
      },
      {
        "h": "Admin, Security, and PDPA Controls",
        "p": "Multi-tenant management with Cognito supports RBAC across finance, HR, approver, admin, and customer roles. Singapore-region deployment ensures data residency, KMS customer-managed keys provide per-client isolation, and retention and deletion policies for personal data are configurable by the DPO without code changes."
      }
    ],
    "awsLead": "Built entirely on AWS managed services — no proprietary middleware, no vendor lock-in, all processing within the client's account:",
    "aws": [
      {
        "name": "Bedrock Claude Haiku",
        "desc": "Fast classification, field normalisation, and GL code suggestion."
      },
      {
        "name": "Bedrock Claude Sonnet",
        "desc": "Reasoning, validation explanation, RAG answers, and CV scoring."
      },
      {
        "name": "Bedrock Knowledge Bases",
        "desc": "RAG over finance SOPs, HR policies, and vendor contracts."
      },
      {
        "name": "Bedrock Guardrails",
        "desc": "Hallucination mitigation, prompt-injection filtering, output safety."
      },
      {
        "name": "Amazon Textract",
        "desc": "Invoice, receipt, and form extraction across four document types."
      },
      {
        "name": "AWS Step Functions",
        "desc": "End-to-end workflow orchestration with parallel fan-out."
      },
      {
        "name": "AWS Lambda (Graviton3)",
        "desc": "Serverless workers — 20% more cost-efficient than x86."
      },
      {
        "name": "Aurora PostgreSQL + pgvector",
        "desc": "Extracted fields, GL history, and vector search."
      },
      {
        "name": "OpenSearch Serverless",
        "desc": "Full-text document search and RAG vector retrieval."
      },
      {
        "name": "Cognito · KMS",
        "desc": "RBAC, enterprise SSO, and per-client encryption isolation."
      },
      {
        "name": "GuardDuty · Macie",
        "desc": "Threat detection and sensitive-data discovery."
      },
      {
        "name": "QuickSight",
        "desc": "Automation rate, exception rate, SLA, and cost-savings dashboards."
      }
    ],
    "results": [
      "Reduced manual document processing effort by <strong>40–70%</strong> across finance and operations.",
      "Achieved <strong>85–95%+ field extraction accuracy</strong> after prompt tuning.",
      "Straight-through processing rate of <strong>50–80%</strong> for mature workflows.",
      "Month-end close accelerated by <strong>25–45%</strong> via automated AR/AP reconciliation.",
      "HR job-description drafting time reduced by <strong>50–70%</strong> — hours to minutes.",
      "Candidate screening time cut by <strong>40–60%</strong> through AI scorecards.",
      "Exception-handling cost reduced by <strong>20–35%</strong> by routing only genuine ambiguity.",
      "PDPA audit documentation for personal-data handling accepted without revision."
    ],
    "metrics": [
      {
        "value": "40–70%",
        "label": "Reduction in manual document processing effort"
      },
      {
        "value": "50–80%",
        "label": "Straight-through processing for mature workflows"
      },
      {
        "value": "85–95%+",
        "label": "Field extraction accuracy after prompt tuning"
      },
      {
        "value": "25–45%",
        "label": "Faster month-end close via automated AR/AP"
      },
      {
        "value": "✓",
        "label": "PDPA & MAS TRM compliant — KMS CMK per client"
      },
      {
        "value": "✓",
        "label": "Integrates with Xero, QuickBooks, M365, Google Drive"
      }
    ],
    "faqs": [
      {
        "q": "Does client data leave their AWS account during processing?",
        "a": "No. All AI inference via Bedrock, storage in S3, and workflow processing via Step Functions run entirely within the client's own AWS account and region."
      },
      {
        "q": "Which accounting systems does the platform integrate with?",
        "a": "Out-of-the-box REST connectors for Xero, QuickBooks, and SAP Business One; Microsoft 365, SharePoint, and Google Drive for ingestion and knowledge-base sync. Additional systems integrate via configurable REST/webhook endpoints."
      },
      {
        "q": "How are PDPA requirements handled for candidate CVs and staff claims?",
        "a": "Personal data is handled under configurable retention and deletion policies set by the DPO. RBAC limits access, Macie scans storage for sensitive patterns, and audit logs capture every access, extraction, and deletion event."
      },
      {
        "q": "How long does implementation take?",
        "a": "A focused MVP covering IDP, AR/AP reconciliation, and the conversational assistant typically reaches production in 10–14 weeks, with further modules layered on in subsequent phases."
      }
    ],
    "related": [
      "intelligent-document-processing",
      "autonomous-customer-operations"
    ]
  }
] satisfies NarrativeEntry[];

export const solutionsBySlug = Object.fromEntries(solutions.map((solution) => [solution.slug, solution])) as Record<string, NarrativeEntry>;
