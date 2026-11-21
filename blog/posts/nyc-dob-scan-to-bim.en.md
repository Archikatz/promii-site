# From Manual Zoning Checks to Algorithmic Workflows: NYC DOB & Scan-to-BIM Automation

Working on residential and multifamily projects in New York requires millimeter precision. The [[NYC DOB]] is relentless with zoning regulations, and an inaccurate as-built model can delay a permit for months.

My approach solves two parallel pain points: reality capture and regulatory validation.

## Phase 1: Reality Capture (Scan-to-BIM)

Translating dense point clouds (.RCP/.RCS) into native Revit geometry (LOD 300-400) demands constant geometric [[QA/QC]]. In [[Scan-to-BIM]] workflows, I automate deviation analysis to ensure the parametric model perfectly matches existing conditions before any retrofitting design begins.

## Phase 2: Algorithmic Code Compliance

Once the as-built model is accurate, zoning verification begins. Instead of calculating gross floor areas, setbacks, and light/air factors by hand, I use parametric programming to create conditional volumes. If a wall breaches the NYC DOB restriction plane, the system automatically flags it. By crossing this structured spatial data with AI engines, we can audit complex floor plans almost instantaneously.
