I work in architecture, construction, B2B sales and my own projects at the same time. For years that meant information scattered across email, folders, notes and memory. The Trinity is the system I used to organize all of it: three pieces that talk to each other so repetitive work does itself and everything else gets recorded.

## The three pieces

- **Notion is the memory.** Projects, databases, procedures (SOPs) and decisions live there. If something isn't in Notion, it doesn't exist for the system.
- **n8n is the nervous system.** Automation flows move data between tools: something comes in, gets classified, transformed and delivered where it needs to go.
- **Claude is the judgment.** It reads, summarizes, drafts and decides in the steps where a fixed rule isn't enough: classifying a document, preparing a draft, checking if something is missing.

I call that orchestration layer **Trinity**: the agent that connects the three pieces and makes sure the flows run.

## A pattern that repeats: inbox, outbox and log

Almost every automation follows the same pattern, and it's what has been most useful to copy from one flow to the next:

1. **Dropzone (inbox).** A folder or form where I drop what needs processing: a PDF, a contact list, an export.
2. **Processed (outbox).** What's processed comes out in another folder, already renamed, classified or converted.
3. **Run logs.** Every run leaves a record: what came in, what went out, what failed.

With that pattern any flow can be audited. If something goes wrong, I know exactly at which step and with which file.

## What I built on top

- **A base pack of automations** (13 flows) covering what I repeat every week: capture, classification, follow-ups and reports.
- **A workflow intake form.** Before automating something, I describe it: what triggers the flow, what data it uses, who receives the result. If I can't describe it on one page, it isn't ready to be automated.
- **A workflow registry.** A living list of which automations exist, what they do and what state they're in.
- **A credentials assistant.** A small local app that guides connecting each service step by step, so keys don't end up scattered in notes.

## What I learned

- **Document first, automate second.** Automating a confusing process only makes it confusing faster.
- **One pattern, many flows.** Repeating the same inbox, outbox and log structure makes every new flow easier than the last.
- **AI belongs in the judgment step, not in every step.** Where a rule works, I use a rule. Claude comes in where something has to be read or decided.

This site is an example: the analytics, the design configuration and the blog emails are connected so I don't have to touch code.

In upcoming posts I'll open up specific flows, with the diagram and the steps. If you're interested, subscribe to the blog at the bottom of the page.
