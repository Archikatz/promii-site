# Claude Inside Revit: Automating Model QA/QC & BIM Data Extraction

Quality Assurance and Quality Control [[QA/QC]] is the most expensive bottleneck in construction document production. Manually verifying that all families have correct parameters, hunting for orphaned elements, or checking sheet naming conventions consumes critical billable hours.

Instead of relying on the human eye, I built a workflow that injects Claude's analytical reasoning (via API or Model Context Protocol) directly into the Revit ecosystem.

## The Technical Workflow

1. **Spatial Data Extraction:** I use [[Dynamo]] and Python to extract the model's metadata (Schedule Data, Room Boundaries, Family Parameters) and export it into a clean JSON format.
2. **Prompt Injection ([[Prompt Chaining]]):** The JSON is sent to Claude alongside the firm's "Rulebook" (e.g., naming conventions, minimum clear heights, fire safety parameters).
3. **Automated Auditing:** The AI returns a structured report pinpointing exactly which Revit Element IDs are violating the rules, generating an actionable To-Do list for the drafter.

This workflow does not replace the BIM Manager; it grants them a "co-pilot" that audits invisible model data in seconds, allowing the team to focus on actual construction coordination rather than fixing typos in a title block.
