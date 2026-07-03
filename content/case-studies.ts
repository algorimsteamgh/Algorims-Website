import type { CaseScene, NarrativeEntry } from "./types";

export const caseStudies = [
  {
    "slug": "qsr-conversational-analytics",
    "source": {
      "href": "/case-studies",
      "label": "Case Studies"
    },
    "kind": "Case Study",
    "tag": "Agentic AI · Quick Service Restaurants",
    "title": "Turning 490K+ transactions of dark data into real-time intelligence for a Singapore QSR chain",
    "subtitle": "From manual labour reports to AI-powered conversational analytics — designed, built, and deployed in four weeks.",
    "glyph": "utensils-crossed",
    "accent": "hsl(265 85% 58%)",
    "meta": [
      {
        "label": "Industry",
        "value": "Food & Beverage · QSR"
      },
      {
        "label": "Region",
        "value": "Singapore"
      },
      {
        "label": "Engagement",
        "value": "4 weeks to production"
      },
      {
        "label": "Platform",
        "value": "Serverless AWS + Amazon Q"
      }
    ],
    "intro": [
      "A leading QSR operator managing multiple outlets across Singapore was making critical workforce decisions in the dark. Labour analytics relied entirely on manual reporting and fragmented data sources, leaving managers unable to answer the questions that mattered most.",
      "The answer wasn't more reports. It was real-time, AI-powered intelligence that anyone in the business could access — instantly, in plain English, without needing a data analyst."
    ],
    "challenge": {
      "lead": "Workforce decisions were being made without the data to support them — and the existing reporting stack couldn't close the gap:",
      "items": [
        "Labour analytics relied entirely on manual reporting and fragmented, disconnected data sources.",
        "Managers couldn't see which time periods were genuinely productive versus loss-making.",
        "Overstaffing and understaffing went undetected across outlets until after the fact.",
        "There was no visibility into how labour cost was impacting outlet-level performance."
      ]
    },
    "solutionTitle": "What Algorims built",
    "solutionLead": "A Conversational Analytics Platform on AWS — a fully serverless, cloud-native intelligence system that transforms raw operational data into actionable insights through natural language, engineered across six layers.",
    "solution": [
      {
        "h": "Data ingestion & storage",
        "p": "Raw labour and transaction data ingested and structured in Amazon S3 — creating a single, reliable source of truth across all outlets."
      },
      {
        "h": "Data engineering pipeline",
        "p": "AWS Glue crawlers and ETL processes clean, transform, and optimise raw data for high-speed analytical querying at enterprise scale."
      },
      {
        "h": "Analytics layer",
        "p": "Amazon Athena computes critical business KPIs — TCPMH (transactions per crew man-hour), SPMH (sales per man-hour), and labour cost % — all validated against real business logic."
      },
      {
        "h": "AI-powered natural language interface",
        "p": "Amazon Q lets business users ask workforce questions in plain English and instantly receive AI-generated charts, insights, and contextual follow-up recommendations. No SQL, no analysts, no waiting."
      },
      {
        "h": "Real-time dashboards",
        "p": "AWS QuickSight delivers interactive, real-time visualisations — KPI monitoring across time periods, zones, and operational areas — giving every manager complete visibility at a glance."
      },
      {
        "h": "Enterprise security & governance",
        "p": "Full encryption, IAM role-based access control, and comprehensive audit logging — built in from day one, not retrofitted after launch."
      }
    ],
    "tech": [
      "Amazon S3",
      "AWS Glue",
      "Amazon Athena",
      "Amazon Q",
      "AWS QuickSight",
      "AWS IAM",
      "AWS KMS"
    ],
    "architecture": {
      "src": "/assets/case-studies/qsr-architecture.png",
      "alt": "QSR conversational analytics architecture on AWS — S3, Glue, Athena, Amazon Q and QuickSight",
      "caption": "Raw labour and transaction data flows from source systems into Amazon S3, is catalogued and transformed by AWS Glue, queried through Amazon Athena, and surfaced to business users through Amazon Q natural-language queries and QuickSight dashboards."
    },
    "results": [
      "<strong>Instant decision-making</strong> — real-time workforce insights through natural language; decisions that took days now happen in seconds.",
      "<strong>490K+ transactions</strong> across 13 months of operational data processed with complete visibility.",
      "A previously invisible <strong>46% productivity gap</strong> between time periods uncovered — enabling targeted optimisation.",
      "<strong>4 weeks</strong> from architecture to production — faster than any traditional analytics programme.",
      "Managers now make <strong>proactive staffing decisions</strong> driven by AI, controlling labour cost across every outlet.",
      "<strong>Data access democratised</strong> — non-technical users interrogate operational data freely, no SQL required."
    ],
    "metrics": [
      {
        "value": "490K+",
        "label": "Transactions processed across 13 months of data"
      },
      {
        "value": "46%",
        "label": "Hidden productivity gap uncovered between time periods"
      },
      {
        "value": "4 wks",
        "label": "From architecture to production deployment"
      },
      {
        "value": "✓",
        "label": "Plain-English analytics via Amazon Q — no SQL, no analysts"
      },
      {
        "value": "✓",
        "label": "Fully serverless AWS architecture — scalable by design"
      },
      {
        "value": "✓",
        "label": "Data access democratised across the whole business"
      }
    ],
    "related": [
      "finance-document-automation",
      "enterprise-knowledge-mining"
    ]
  },
  {
    "slug": "ai-school-scheduler",
    "source": {
      "href": "/case-studies",
      "label": "Case Studies"
    },
    "kind": "Case Study",
    "tag": "Agentic AI · Education",
    "title": "Eliminating scheduling chaos for a school — replacing manual coordination with intelligent automation",
    "subtitle": "From error-prone manual timetables to an AI-powered scheduling platform delivering complete operational visibility and instant decision-making.",
    "glyph": "calendar-clock",
    "accent": "hsl(265 85% 58%)",
    "meta": [
      {
        "label": "Industry",
        "value": "Education"
      },
      {
        "label": "Region",
        "value": "Singapore"
      },
      {
        "label": "AI engine",
        "value": "GPT-4o"
      },
      {
        "label": "Architecture",
        "value": "Cloud-native · serverless"
      }
    ],
    "intro": [
      "Managing a school's daily operations is more complex than it looks from the outside. Every day, administrators juggle teacher absences, last-minute substitute assignments, room conflicts, and timetable changes — all manually, across disconnected spreadsheets and paper-based systems.",
      "The result was predictable: scheduling errors, operational bottlenecks, and administrators spending hours on coordination instead of leadership. The answer was an AI-powered platform that automates the entire scheduling lifecycle."
    ],
    "challenge": {
      "lead": "Three critical problems demanded an intelligent solution:",
      "items": [
        "Teacher absences created cascading disruptions with no fast, reliable way to assign the right substitute.",
        "Manual timetable management was error-prone — double bookings, room clashes, and workload imbalances went undetected until they caused real disruption.",
        "Decision-makers had no real-time visibility into operations — acting on instinct rather than data."
      ]
    },
    "solutionTitle": "What Algorims built",
    "solutionLead": "An AI-Powered School Scheduler — a fully cloud-native, modular platform that automates the entire scheduling lifecycle from timetable management to absence resolution, powered by natural language AI.",
    "solution": [
      {
        "h": "Core web application",
        "p": "A secure, responsive platform with role-based access for administrators, teachers, and staff — seamlessly accessible across all devices."
      },
      {
        "h": "Schedule management",
        "p": "Daily and weekly timetable views with real-time conflict detection — automatically identifying teacher clashes, room double-bookings, and workload imbalances before they cause disruption."
      },
      {
        "h": "Absence management",
        "p": "End-to-end absence tracking with automated approval workflows and complete historical records — giving administrators full visibility and control."
      },
      {
        "h": "AI substitute assignment engine",
        "p": "Intelligent automatic substitute allocation based on subject expertise, availability, and workload balancing — ensuring the right teacher is assigned instantly, every time."
      },
      {
        "h": "What-if simulation engine",
        "p": "Scenario-based planning that lets administrators test the impact of absences, departmental changes, and room unavailability without touching live schedules."
      },
      {
        "h": "AI analyst module",
        "p": "Powered by GPT-4o — administrators ask operational questions in plain English and instantly receive AI-generated insights, SQL-driven analytics, and decision support. No technical skills required."
      },
      {
        "h": "Real-time dashboard",
        "p": "Live metrics covering teacher distribution, room utilisation, absence trends, and workload — giving every decision-maker a complete operational picture at a glance."
      },
      {
        "h": "Conflict detection engine",
        "p": "Automated alerts for double-booking, room clashes, and workload violations — with intelligent resolution suggestions served immediately."
      },
      {
        "h": "Reporting & export",
        "p": "Automated schedule reports, absence summaries, and substitute utilisation exports — ready when needed, without manual compilation."
      }
    ],
    "tech": [
      "GPT-4o",
      "Cloud-Native Architecture",
      "Role-Based Access Control",
      "Real-Time Conflict Detection",
      "Serverless Infrastructure",
      "Automated Reporting"
    ],
    "architecture": {
      "src": "/assets/case-studies/school-scheduler-architecture.png",
      "alt": "AI school scheduler architecture — user access portal, web application core, AI analyst engine and conflict detection",
      "caption": "A role-based access portal feeds the web application core — authentication, schedule, and absence managers — with a GPT-4o AI analyst engine and conflict-detection layer reading and writing against a shared relational database, then generating reports and dashboards."
    },
    "results": [
      "<strong>Scheduling chaos eliminated</strong> — manual timetable management replaced with real-time updates and instant conflict resolution.",
      "<strong>AI-powered decision-making</strong> — administrators ask questions in plain English and receive instant, accurate answers.",
      "<strong>Smarter substitute management</strong> — the right substitute auto-assigned by expertise, availability, and workload.",
      "<strong>Proactive planning</strong> — administrators test scenarios before implementation, eliminating disruption.",
      "<strong>Real-time operational visibility</strong> — one platform across schedules, absences, staff, rooms, and analytics.",
      "<strong>Secure & scalable</strong> — built to grow with the institution, with enterprise-grade access controls."
    ],
    "metrics": [
      {
        "value": "✓",
        "label": "Manual scheduling eliminated end-to-end"
      },
      {
        "value": "✓",
        "label": "Substitute assignment fully automated by AI"
      },
      {
        "value": "✓",
        "label": "What-if simulation before any live change"
      },
      {
        "value": "✓",
        "label": "Plain-English analytics powered by GPT-4o"
      },
      {
        "value": "✓",
        "label": "Real-time conflict detection across rooms & staff"
      },
      {
        "value": "✓",
        "label": "Single source of truth across all operations"
      }
    ],
    "related": [
      "qsr-conversational-analytics",
      "enterprise-knowledge-mining"
    ]
  },
  {
    "slug": "cicd-release-automation",
    "source": {
      "href": "/case-studies",
      "label": "Case Studies"
    },
    "kind": "Case Study",
    "tag": "DevOps & Platform · SaaS",
    "title": "Engineering a production-ready CI/CD pipeline that ships secure, high-quality software automatically",
    "subtitle": "From manual deployments to a fully automated, security-first delivery pipeline — built on GitHub Actions, Kubernetes, and AWS.",
    "glyph": "git-branch",
    "accent": "hsl(265 85% 58%)",
    "meta": [
      {
        "label": "Domain",
        "value": "DevOps & Platform Engineering"
      },
      {
        "label": "Workload",
        "value": "SaaS application delivery"
      },
      {
        "label": "Runtime",
        "value": "Kubernetes on AWS EKS"
      },
      {
        "label": "Provisioning",
        "value": "Terraform · Infrastructure as Code"
      }
    ],
    "intro": [
      "In modern software development, speed without quality is a liability — and quality without speed is a competitive disadvantage. Most engineering teams face the same painful reality: manual deployments are slow, error-prone, and inconsistent.",
      "Security vulnerabilities slip through undetected, testing is rushed under delivery pressure, and by the time a bug reaches production the cost of fixing it has multiplied many times over."
    ],
    "challenge": {
      "lead": "Three critical problems demanded an intelligent solution:",
      "items": [
        "Manual deployment processes were slowing release cycles and creating inconsistent, unreliable delivery.",
        "Security and code-quality checks were disconnected from the delivery workflow — catching problems too late.",
        "Teams lacked real-time visibility into the pipeline — blind spots created risk and reduced confidence."
      ]
    },
    "solutionTitle": "What Algorims built",
    "solutionLead": "RaaS — Release Automation as a Service — a fully automated, security-first CI/CD pipeline that takes code from commit to production with zero manual intervention, engineered across four precision-designed stages.",
    "solution": [
      {
        "h": "Stage 1 — Code & build",
        "p": "The moment a developer commits, the pipeline activates automatically. Source code is compiled, validated, and built into an optimised container image — ready for the next stage within minutes, not hours."
      },
      {
        "h": "Stage 2 — Scan & package",
        "p": "SonarQube performs deep static analysis and Trivy scans for vulnerabilities across the image and dependencies. Only clean, secure, quality-verified code advances — eliminating the risk of security debt reaching production."
      },
      {
        "h": "Stage 3 — Deploy & test",
        "p": "The verified app deploys to a dedicated AWS EKS staging environment provisioned automatically via Terraform. Unit, end-to-end, and UI tests run in parallel, delivering fast, reliable feedback before anything reaches production."
      },
      {
        "h": "Stage 4 — Notify & release",
        "p": "Stakeholders receive real-time Slack notifications at every stage. Once all gates clear, the verified release ships to production seamlessly, automatically, and with full confidence."
      }
    ],
    "tech": [
      "GitHub Actions",
      "Docker",
      "SonarQube",
      "Trivy",
      "Kubernetes",
      "AWS EKS",
      "Terraform",
      "Slack"
    ],
    "results": [
      "<strong>Deployment speed dramatically increased</strong> — commit to production in a fraction of the time, zero manual intervention.",
      "<strong>Security built into every release</strong> — automated SonarQube and Trivy scans ensure only vulnerability-free code ships.",
      "<strong>Quality assured at every stage</strong> — unit, end-to-end, and UI tests run automatically on every candidate.",
      "<strong>Infrastructure as code</strong> — Terraform-provisioned EKS environments are consistent, repeatable, and cost-effective.",
      "<strong>Complete pipeline visibility</strong> — real-time Slack notifications keep every stakeholder informed.",
      "<strong>Engineering teams unblocked</strong> — developers focus on features, not deployments."
    ],
    "metrics": [
      {
        "value": "0",
        "label": "Manual steps from commit to production"
      },
      {
        "value": "4",
        "label": "Automated stages — build, scan, deploy, release"
      },
      {
        "value": "✓",
        "label": "Security gates on every release (SonarQube + Trivy)"
      },
      {
        "value": "✓",
        "label": "Parallel unit, E2E & UI testing on each candidate"
      },
      {
        "value": "✓",
        "label": "Terraform-provisioned, drift-free EKS environments"
      },
      {
        "value": "✓",
        "label": "Real-time Slack visibility across the pipeline"
      }
    ],
    "related": [
      "finance-document-automation",
      "qsr-conversational-analytics"
    ]
  },
  {
    "slug": "enterprise-knowledge-mining",
    "source": {
      "href": "/case-studies",
      "label": "Case Studies"
    },
    "kind": "Case Study",
    "tag": "Agentic AI · Enterprise Knowledge Management",
    "title": "Building an enterprise knowledge mining assistant that answers questions — not just returns files",
    "subtitle": "A permissions-aware, retrieval-augmented AI assistant on Amazon S3 Vectors and Amazon Nova — giving employees instant, cited answers from thousands of documents.",
    "glyph": "brain-circuit",
    "accent": "hsl(265 85% 58%)",
    "meta": [
      {
        "label": "Industry",
        "value": "Enterprise Knowledge Management"
      },
      {
        "label": "Region",
        "value": "Singapore (ap-southeast-1)"
      },
      {
        "label": "Platform",
        "value": "Amazon S3 Vectors + Amazon Nova"
      },
      {
        "label": "Status",
        "value": "In active deployment"
      }
    ],
    "intro": [
      "Enterprises accumulate thousands of documents across SharePoint, S3, internal portals, and email. The knowledge is there — but finding it is a different problem entirely. Employees waste hours hunting for policy answers, contract clauses, and SOP steps, while keyword search returns lists of files, not answers.",
      "We are deploying a permissions-aware retrieval-augmented assistant built on Amazon S3 Vectors and Amazon Nova. Employees ask questions in plain English; the system retrieves the most relevant information, reasons through it, and delivers grounded, cited answers — instantly, securely, and without hallucination."
    ],
    "challenge": {
      "lead": "The problem is not a lack of knowledge — it is a lack of intelligent access to it:",
      "items": [
        "Slow onboarding — new employees spend weeks finding information that should take minutes.",
        "Compliance risk — outdated or incorrect documents get actioned because the right one was never found.",
        "Repeated SME escalations — experts field the same questions daily instead of focusing on high-value work.",
        "Decision delays — leaders wait for information that already exists somewhere in the organisation."
      ]
    },
    "solutionTitle": "What Algorims is building",
    "solutionLead": "A permissions-aware Enterprise Knowledge Mining Assistant — a production-grade RAG system engineered across six core capabilities that transforms how enterprises interact with their institutional knowledge.",
    "solution": [
      {
        "h": "Permissions-aware retrieval",
        "p": "Built on Amazon S3 Vectors — users only ever see documents within their authorised access scope. Enterprise security and compliance are enforced at the retrieval layer, not bolted on afterwards."
      },
      {
        "h": "Citation-grounded answers",
        "p": "Every answer links directly back to its source document and specific chunk — eliminating hallucinated facts and giving employees the confidence to act on AI-generated answers."
      },
      {
        "h": "Multi-format document ingestion",
        "p": "PDF, DOCX, PPTX, HTML, and email all ingested, indexed, and made searchable — across SharePoint, S3, Confluence, Salesforce, and internal portals."
      },
      {
        "h": "Incremental document sync",
        "p": "The system tracks document changes and updates incrementally — no full re-indexing required, keeping the knowledge base current without operational overhead."
      },
      {
        "h": "Intelligent fallback handling",
        "p": "When confidence falls below threshold, the system escalates rather than guessing. Enterprise AI that knows the boundaries of its own knowledge is safer than one that doesn't."
      },
      {
        "h": "Continuous improvement loop",
        "p": "User feedback ratings feed directly into relevance tuning — the system gets measurably smarter with every interaction, compounding value over time."
      }
    ],
    "tech": [
      "Amazon S3 Vectors",
      "Amazon Nova",
      "Amazon Nova Lite",
      "Amazon Bedrock Guardrails",
      "AWS IAM",
      "SharePoint Connector",
      "Amazon S3",
      "Confluence",
      "Salesforce"
    ],
    "results": [
      "<strong>Instant knowledge access</strong> — precise, cited answers in seconds, not lists of files to search manually.",
      "<strong>Zero security compromise</strong> — permissions-aware retrieval enforces every user's authorised scope natively.",
      "<strong>Answers you can trust</strong> — every response cites its source, eliminating hallucinated facts.",
      "<strong>SME escalations dramatically reduced</strong> — repeated questions answered autonomously.",
      "<strong>Fast time to value</strong> — functional in under a week from architecture to first demo.",
      "<strong>Singapore-ready</strong> — deployed in ap-southeast-1 for data residency compliance."
    ],
    "metrics": [
      {
        "value": "<1 wk",
        "label": "From architecture to first working demo"
      },
      {
        "value": "✓",
        "label": "Permissions-aware retrieval — authorised scope only"
      },
      {
        "value": "✓",
        "label": "Every answer cited back to its source chunk"
      },
      {
        "value": "✓",
        "label": "PDF, DOCX, PPTX, HTML & email ingestion"
      },
      {
        "value": "✓",
        "label": "PII redaction via Bedrock Guardrails"
      },
      {
        "value": "✓",
        "label": "Deployed in ap-southeast-1 for data residency"
      }
    ],
    "related": [
      "finance-document-automation",
      "qsr-conversational-analytics"
    ]
  },
  {
    "slug": "finance-document-automation",
    "source": {
      "href": "/case-studies",
      "label": "Case Studies"
    },
    "kind": "Case Study",
    "tag": "Agentic AI · Finance · Singapore SMB",
    "title": "An AI-native finance document platform that takes invoices to ERP in minutes",
    "subtitle": "A fully automated, compliance-ready finance automation platform built on AWS Bedrock and Claude — designed specifically for Singapore SMBs.",
    "glyph": "receipt",
    "accent": "hsl(265 85% 58%)",
    "meta": [
      {
        "label": "Industry",
        "value": "Finance · Singapore SMB"
      },
      {
        "label": "Region",
        "value": "Singapore"
      },
      {
        "label": "Platform",
        "value": "AWS Bedrock + Claude"
      },
      {
        "label": "Status",
        "value": "POC complete — ready to deploy"
      }
    ],
    "intro": [
      "Singapore SMBs process hundreds of finance documents every month — invoices, purchase orders, GST returns, financial statements, and tax documents. Almost all of it manually, at enormous hidden cost.",
      "We built an AI-native finance automation platform on AWS Bedrock and Claude that takes finance documents from ingestion to ERP export autonomously — with full compliance validation, role-based approvals, and a complete audit trail."
    ],
    "challenge": {
      "lead": "For Singapore SMBs navigating ACRA compliance and GST requirements, the stakes are high and the margin for error is zero:",
      "items": [
        "Finance teams spend hours manually extracting and keying figures that should never require human input.",
        "Validation errors slip through — incorrect UEN numbers, invalid GST registrations, and reconciliation mismatches create compliance risk.",
        "Approval workflows live in email chains — no visibility, no audit trail, no accountability.",
        "ERP data entry is done by hand — slow, error-prone, and impossible to scale.",
        "Exception handling consumes disproportionate time — finance teams firefighting instead of adding value."
      ]
    },
    "solutionTitle": "What Algorims is building",
    "solutionLead": "An AI-Native Finance Automation Platform on AWS Bedrock and Claude that takes finance documents from ingestion to ERP export autonomously, engineered across seven integrated capabilities.",
    "solution": [
      {
        "h": "Intelligent document processing",
        "p": "Claude on AWS Bedrock extracts structured data from every finance document type — invoices, POs, GST returns, financial statements, and tax documents — with human-level accuracy and zero manual keying."
      },
      {
        "h": "Singapore compliance validation",
        "p": "Built-in ACRA UEN and GST validation rules automatically verify every document against Singapore regulatory requirements — catching compliance errors before they become costly problems."
      },
      {
        "h": "Retrieval-augmented generation",
        "p": "A Claude-powered RAG layer lets finance teams query their entire document history in plain English — instantly surfacing contract terms, payment histories, and vendor records without manual searching."
      },
      {
        "h": "Automated approval workflows",
        "p": "Real-time exception and approval queues route documents intelligently by value threshold, document type, and business rules — giving finance managers complete visibility without email chains."
      },
      {
        "h": "Automated reconciliation",
        "p": "AI-driven reconciliation matches invoices against purchase orders, delivery notes, and payment records automatically — identifying discrepancies instantly and flagging exceptions for human review."
      },
      {
        "h": "ERP export",
        "p": "Validated, reconciled data exported directly to ERP systems — eliminating manual data entry and ensuring financial records are always accurate, current, and audit-ready."
      },
      {
        "h": "Role-based access & full audit trail",
        "p": "Every action, approval, and exception logged with a complete, tamper-proof audit trail — giving finance teams, auditors, and compliance officers the visibility they need."
      }
    ],
    "tech": [
      "AWS Bedrock",
      "Claude (Anthropic)",
      "Amazon S3",
      "Amazon Textract",
      "AWS Lambda",
      "Amazon DynamoDB",
      "AWS IAM",
      "ACRA UEN Validation",
      "GST Compliance Rules"
    ],
    "results": [
      "<strong>Finance processing automated end-to-end</strong> — from ingestion to ERP export; processing time reduced from hours to minutes.",
      "<strong>Singapore compliance built in</strong> — ACRA UEN and GST validation enforced automatically on every document.",
      "<strong>Claude-powered extraction accuracy</strong> — human-level accuracy across all finance document types.",
      "<strong>Complete approval visibility</strong> — real-time queues replace chaotic email chains; every decision logged.",
      "<strong>Instant document intelligence</strong> — query entire document history in plain English via Claude-powered RAG.",
      "<strong>Enterprise-grade security</strong> — role-based access and a full audit trail, audit-ready from day one."
    ],
    "metrics": [
      {
        "value": "Hours→min",
        "label": "Invoice-to-ERP processing time"
      },
      {
        "value": "100%",
        "label": "ACRA UEN & GST validation on every document"
      },
      {
        "value": "POC ✓",
        "label": "Built, tested, and production-ready"
      },
      {
        "value": "✓",
        "label": "Claude-powered extraction across all document types"
      },
      {
        "value": "✓",
        "label": "Automated reconciliation against POs & payments"
      },
      {
        "value": "✓",
        "label": "Tamper-proof audit trail with role-based access"
      }
    ],
    "related": [
      "qsr-conversational-analytics",
      "enterprise-knowledge-mining"
    ]
  }
] satisfies NarrativeEntry[];

export const caseScenes = {
  "qsr-conversational-analytics": {
    "alt": "Labour analytics dashboard with KPI tiles, a productivity bar chart and an Amazon Q natural-language query panel",
    "caption": "The conversational analytics platform — managers ask workforce questions in plain English through Amazon Q and monitor live labour KPIs in QuickSight dashboards."
  },
  "ai-school-scheduler": {
    "alt": "Weekly school timetable grid with colour-coded class blocks, a flagged scheduling conflict, and an AI substitute-assignment notification",
    "caption": "The scheduling platform — a live weekly timetable with real-time conflict detection and AI-driven substitute assignment powered by GPT-4o."
  },
  "cicd-release-automation": {
    "alt": "CI/CD pipeline view with Build, Scan, Deploy and Release stages, a build log terminal and Slack deploy notifications",
    "caption": "The RaaS pipeline — code flows from commit through automated build, security scanning, staged deployment and release, with real-time Slack visibility at every gate."
  },
  "enterprise-knowledge-mining": {
    "alt": "Semantic search interface with a natural-language query, a knowledge graph of connected document nodes, and a cited AI answer panel",
    "caption": "Semantic search across SOPs, policies and contracts — natural-language questions answered in seconds, with the source documents cited."
  },
  "finance-document-automation": {
    "alt": "Document extraction view with an invoice on the left and a structured fields panel on the right showing validated values and confidence scores",
    "caption": "Documents in, structured data out — fields extracted, validated against Singapore UEN/GST rules, and GL-coded with per-field confidence scoring."
  }
} satisfies Record<string, CaseScene>;

export const caseStudiesBySlug = Object.fromEntries(caseStudies.map((study) => [study.slug, study])) as Record<string, NarrativeEntry>;
