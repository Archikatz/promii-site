My portfolio was a nice page, but a still one. It had my projects, my experience and a form, but I didn't know who visited it, it didn't capture emails, and every design change meant touching code. I wanted something different: a page that felt alive, that could change its skin without being rebuilt, and that told me what works. This is the story of how I built it.

## The concept: architecture that moves

I'm an architect, so I started with what I know: technical drawings. My projects were already shown as line drawings that drew themselves on screen, and that was what I liked most. Instead of replacing it, I extended that language to the whole page: drawing dimension marks under every title (A-01, A-02…), a timeline that fills as you scroll, icons that trace themselves, and a route between New York and Bogotá, the two cities I work between.

On top of that base I added a second layer: **Liquid Glass**, the liquid glass Apple introduced in iOS 26. Glass that refracts what's behind it, continuous corners (squircles) instead of ordinary rounded corners, and motion based on **springs**: nothing lasts "0.3 seconds", everything has stiffness and damping, like a physical object.

![Liquid Glass: the hero with the drop over the background](img/glass.jpg)

## A lab first, then the page

Before touching the page I built a **Motion Lab**: 13 independent demos to test each idea on its own. Glass with real refraction, squircle corners, a tab bar with a liquid indicator, buttons that split into droplets, spring physics, a drawing that draws itself, scroll-linked animation, a WebGL background, 3D cards, kinetic type, fluid transitions and a building that separates by levels.

Seeing each effect in isolation let me choose without fear. In the end I liked them all, so I brought them to the page one by one, each with a switch to turn it off.

## Three materials, one system

The most important decision was separating **motion** from **material**. Every curve, duration and spring lives in a few tokens; colors and textures change with the style. That's how three styles were born that share the same buttons, proportions and physics:

- **Liquid Glass**: glass, light and color on a dark background.
- **Chinese ink**: grainy paper, ink clouds moving in WebGL, ink borders and a single contrast color that I choose.
- **Obsidian**: obsidian, gold and cyan neon, with sacred geometry in the background. It comes from the color system I defined for Promii and ArchiKatz: one gem per brand (gold for Promii, magenta for ArchiKatz, sapphire, amber).

![Chinese ink: paper, ink and a brush stroke under the headline](img/ink.jpg)

![Obsidian: gold and neon over obsidian](img/gem.jpg)

## The drop: optical physics in the browser

My favorite element is the **water drop**. It floats over the word *promii* on the hero and then travels down the page as you scroll, stretching with speed like a real drop.

It works as a **magnifier**. In Chrome and Edge it uses a displacement map: an invisible image where each pixel tells the browser which point to take its color from. To magnify, each point inside the drop takes the color of a point closer to the center; at the rim, light bends harder and the colors separate a little, like a real lens.

![The drop as a magnifier: it enlarges the "o" in promii](img/lupa.jpg)

On iPhone, Safari doesn't allow distorting a web page's background. Instead of giving up, the drop copies what is underneath it, live, enlarges it and keeps it aligned with the real page while you move it. So it magnifies any part of the page.

And you can play with it: drag it and leave it wherever you want to use it as a magnifier. If you tap it fast or throw it hard, it **bursts into droplets** that fly out and come back together with spring physics.

![The drop bursts into droplets that rejoin](img/explota.jpg)

## Making it smooth: what I learned by measuring

A beautiful effect that stutters is useless. When I tested the page on my iPhone, the Chinese ink style was slow, so I measured instead of guessing: I simulated a phone with a processor four times slower and scrolled the whole page counting frames per second.

I found two culprits:

1. **Filters recalculated live.** The "brush" borders of Chinese ink used a noise filter on every card, and the browser recalculated it on scroll. I removed it: jank dropped by almost half.
2. **Things moving behind the glass.** Every glass card blurs what's behind it. If the background moves, even slowly, the browser has to recalculate the glass of every card on every frame. With the page still at mid-scroll it went from 14 frames per second to **60** just by keeping the background still once you scroll down.

The rule I kept: **what's behind the glass only moves on the hero**, where it shines. Further down, everything stays still and the page runs at 60 frames per second in all three styles. Every interaction animation also goes to sleep when nothing moves, and the quote form only loads when you get close.

## A panel to play with the page

The second half of the project is invisible: a **private panel** where I control the page without touching code.

![The panel: test bench, physics and preview](img/panel.jpg)

From there:

- I switch between the three styles and pick the contrast color.
- I move the **physics**: corner radius, squircle smoothing, glass blur and shine, refraction, spring stiffness and damping, how jelly the buttons feel, and the drop's size and magnification. A test bench with the word *promii* and the drop reacts live to every control.
- I turn each animation on or off.
- I save combinations as **themes**, generate random combinations or use suggested themes.
- I hit **Apply** and the panel saves, opens the real page internally and **verifies** point by point that everything is as I left it.

I also see the **analytics**: visits, time per section, scroll depth and a click heat map over the real page. No cookies and no personal data: each visitor is a random number.

## How I built it

I built it by talking with **Claude Code**, Anthropic's coding agent, in one long session from my phone. My role was art director and client: deciding the concept, testing on my iPhone, saying what felt slow or what was missing. The agent researched, built, measured and showed me screenshots before publishing.

The process was iterative: first the demo lab, then the layer of new animations on top of what already existed, then the content, analytics and panel, and finally rounds of adjustments guided by what I saw on my phone. Every change was recorded on GitHub and documented so it can be picked up with any AI.

**Tools:** HTML, CSS and JavaScript with no frameworks, SVG and WebGL for the effects, Supabase for the database and sign-in, MailerLite for email, GitHub Pages and Vercel for publishing, and Claude Code to build it all.

## What's next

The page is now a platform: this blog, an academy, a community and an ArchiKatz art shop on the way. And a corner of lightweight web games, also made with AI.

If you want the next case when I publish it, subscribe to the blog at the bottom of this page.
