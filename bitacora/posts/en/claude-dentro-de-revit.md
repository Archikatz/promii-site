*This post documents a study in progress. I'll keep updating it as it moves forward.*

I use Revit every day and much of the work is repetitive: reviewing models, preparing sheets, looking for clashes between disciplines. Since January 2025 I've been trying something different: **connecting Claude directly to Revit** so it can read the model, review it and run tasks inside it.

## How it connects

The key piece is **MCP** (Model Context Protocol), an open standard that lets an AI model use external tools. There are MCP servers for Revit that expose the model: elements, parameters, views and sheets. With that, Claude stops being a chat on the side and starts working *inside* the file.

Around that connection I use:

- **C# (Roslyn)** for scripts that compile and run inside Revit.
- **Python and Dynamo** for visual automation and routines I already had.
- **Veras AI** to explore renders and design variations from the model.

## Five flows I'm testing

1. **Quality control (QA/QC).** Checking empty parameters, inconsistent names, views not placed on sheets and misclassified elements, and returning a list of fixes.
2. **Construction documents.** Preparing sheets, views and schedules from rules, so the drafter reviews instead of building from scratch.
3. **Clash detection.** Finding interferences between disciplines and summarizing them by priority.
4. **Generative design.** Exploring layout or massing options from constraints.
5. **Python and Dynamo routines.** Letting Claude write or adjust the scripts I used to write by hand.

## What I've seen so far

- **Reviewing is where it shines.** Reading a whole model and saying what's wrong is exactly what an agent does well and what a person does tired.
- **Context matters.** Without clear standards (names, templates, parameters) the agent guesses. With them, it gets it right.
- **The architect still decides.** The agent proposes changes; I review them before applying them to the model.

## What's next

I'll publish each flow separately, with screenshots and what worked and what didn't. The goal is a repeatable method for small offices that want to use AI in their BIM workflow without a development team.

If you want the next updates, subscribe at the bottom of the page.
