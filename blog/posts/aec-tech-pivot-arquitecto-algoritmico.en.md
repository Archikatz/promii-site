# Rabbit Hole: AEC Tech Pivot — Building 'The Algorithmic Architect'

During my early years modeling in Revit, I experienced the same pain that 90% of architecture firms suffer: projects stuck in "LOD 300 Hell." Adjusting a floor plan to comply with strict [[NYC DOB]] zoning codes meant hours of manual review, polygon correction, tedious data extraction, and visual clash detection.

Architecture is a creative discipline, but the production of construction documents is fundamentally a spatial data management problem. Humans are terrible at processing repetitive data. Technology is not.

My transition began by integrating [[Dynamo]] to automate geometric extractions. I went from manually counting areas to designing scripts that recalculated floor area ratios and setbacks in real-time. But the true paradigm shift happened this past year. I asked myself: *What if we connect the geometric rigor of the BIM model with the reasoning capabilities of a Large Language Model (LLM)?*

This led to what I call my operational "Trinity": systems where I use AI not to write text, but to orchestrate and generate validation scripts directly inside Revit. Through [[Prompt Chaining]], the AI writes the code that audits the model for me. This transforms a 10-hour manual [[QA/QC]] process into a 10-minute script execution.

PropTech and ConTech startups are raising millions to solve code compliance and generative design. However, many fail during implementation because software engineers don't understand how an architect thinks, and architects don't know how to structure data.

If you are directing a product team at a ConTech startup, or leading R&D at a Tier-1 firm looking to bridge the gap between BIM production and AI, construction code automation isn't the future; it's a script we can start running today.
