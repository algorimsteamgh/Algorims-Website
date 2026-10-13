# Evidence (orchestrator-gathered; page is a single 205-line file)
- E1 Broken markup: `<pCertified: Algorims is Certified…</p>` (partners.astro:59) — the core Claude claim never renders (confirmed in screenshot).
- E2 Structure: 3 near-identical bordered cards stacked (partners.astro:47-139); Claude card uses a different internal layout than AWS/Xero → empty band between badge and heading (screenshot, Claude card left column).
- E3 Badge scale mismatch: Claude badge max-width 360px (css .claude-badge) vs AWS/Xero 108px plinth.
- E4 Label noise per card: status dot w/ glow + partner tag + "/" + tier tag + "Verified Competencies" + "Delivered Capabilities" + "Production Deliverables" (partners.astro:49-55, 98, 113-114). "Delivered Capabilities"/"Production Deliverables" say the same thing.
- E5 Hover states on non-interactive elements: .tag-list li:hover, .outcome-cell:hover, .alliance-card:hover (css) → imply clickability that doesn't exist.
- E6 No next action: page ends at Xero card; only one link (Claude program, external). No CTA to contact.
- E7 Copy: "Verified Competencies" lists product names (SageMaker, Amazon EKS) that are not formal AWS Competencies; "Zero-downtime" absolute claim (partners.astro:16).
- E8 Weight: no client JS on page, lazy-loaded badges, prefers-reduced-motion respected; overflow 0 at 390/1440.
