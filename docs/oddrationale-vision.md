# oddrationale.com — Product Vision

## The Odd Rationale

Most personal websites are digital brochures. Static pages. Fixed layouts. The same experience whether the visitor is a recruiter, a fellow engineer, a potential client, or someone who stumbled in from a search result. They serve the author's organizational instinct, not the reader's intent.

**oddrationale.com** will be different. It will be one of the first personal websites where an AI agent is not bolted on as a chatbot sidebar, but woven into the fabric of the experience itself. The website adapts to who you are and what you're looking for. The blog posts respond to how you read them. The whole thing feels *alive* — not in a gimmicky way, but in the way a great host makes you feel when you walk into their home: they pay attention, they adjust, they make the experience about *you*.

This is a personal website that practices what its author preaches: that AI-enabled automation, done well, should feel invisible, intentional, and human.

---

## Two Core Experiences

### 1. The Living Portfolio

**What visitors see:** A beautifully designed landing page that loads instantly — fast, accessible, SEO-friendly. But within moments, a subtle prompt invites them to share what brought them here. A recruiter types "I'm hiring for an AI engineering lead." A developer types "show me your LangGraph work." A friend types "hey, what have you been up to?"

**What happens next:** The page *reconfigures itself*. Not from scratch — the agent selects, sequences, and tunes pre-built components to match the visitor's intent. A recruiter sees a leadership-focused narrative with impact metrics front and center. A developer sees architecture diagrams, code samples, and technical deep-dives. A casual visitor gets a relaxed, magazine-style layout with recent blog posts and personal updates.

**The key principle:** The agent is a DJ, not a composer. It remixes a library of polished, tested components — never generating raw markup. The "generative" act is selection and sequencing, not creation. Every piece of content comes from a curated, vetted content store. The agent cannot hallucinate accomplishments or invent projects.

**The fallback is the product:** If the visitor never types anything, if JavaScript fails, if the LLM is slow — they see a beautiful, complete, static website. The agentic layer is pure progressive enhancement.

### 2. The Ambient Blog

**What visitors see:** A well-written blog post, cleanly typeset, perfectly readable on its own. But as they read, the article *notices*. Linger on a technical section, and an interactive comparison widget materializes in the margin. Highlight a code snippet, and a runnable sandbox appears beneath it. Skim through quickly, and a TLDR card gently surfaces. Return to the site after reading a related post last week, and a "concept bridge" appears connecting the two ideas.

**What it feels like:** Margin notes from a thoughtful friend who's reading alongside you. Not interrupting — *augmenting*. The interventions are sparse, high-signal, and always dismissable. The system has a strict intervention budget: it would rather do nothing than be annoying.

**The key principle:** The author (me) curates what's *possible* for each article — the available widgets, comparison data, sandbox templates, depth-toggle variants. The agent decides *whether and when* to surface those possibilities based on real-time reading behavior. It cannot invent interventions that weren't authored. This keeps quality high and surprises predictable.

---

## Design Principles

### Intent Over Navigation
Traditional websites force visitors to navigate a structure the author chose. This site understands what the visitor wants and reorganizes around their intent. The information architecture is dynamic, not fixed.

### Progressive Enhancement, Always
The site works without JavaScript. It works without the agent. It works on slow connections. Every agentic feature is layered on top of a solid, statically-generated foundation. The baseline experience is excellent; the agent makes it *personal*.

### Sparse, High-Signal Interventions
The agent has a budget. It earns trust by knowing when *not* to act. Dismissals are tracked and respected. The goal is 2–4 perfectly-timed interventions per session, not a constant stream of AI-generated noise.

### Content Integrity
The agent never writes content, fabricates claims, or generates portfolio items. All projects, metrics, blog posts, and biographical details come from a structured content store that I maintain. The agent's role is curation and presentation, never authorship.

### The Experience Is the Portfolio
For someone who consults on AI-enabled automation, the website itself is the most powerful demonstration of expertise. The site doesn't just *describe* what I do — it *does* what I do. Every visitor interaction is a live case study in agentic UX.

---

## Architecture Overview

### Frontend
- **Next.js** with static generation as the foundation
- **React** component library: 15–20 polished, reusable pieces (project cards, timelines, metric showcases, code sandboxes, comparison widgets, depth toggles, TLDR cards, concept bridges)
- **CopilotKit v2** (`@copilotkit/react-core/v2`) in headless mode — no chat chrome, the page *is* the interface
  - `useAgent` (v2 hook, superset of the legacy `useCoAgent`) provides unified programmatic access to each agent: `agent.state`, `agent.setState`, `agent.sendMessage()`, `agent.messages`, `agent.isRunning`
  - Multi-agent support native to the hook — the portfolio composer and reading companion run as separate `useAgent` instances in the same session, with the ability to share context between them
  - `useCopilotAction` registers each component as a callable tool with typed parameters and render functions
  - `useCopilotReadable` feeds structured content and reading state as agent context
  - Built-in thread persistence via thread IDs — conversations are durable, resumable, and automatically reconnect across sessions
- **AG-UI Protocol** as the transport layer between frontend and agents — a single typed event stream (messages, tool calls, state updates, lifecycle signals) replacing the older GraphQL-based communication
- **Tailwind CSS** for styling
- Portal-based intervention slots in blog articles for seamless inline widget injection
- Reading state instrumentation: scroll tracking, intersection observers, dwell time, selection events — all computed locally, fed to the agent as context

### Backend (Unified TypeScript)
- **LangGraph.js** (`@langchain/langgraph`) as the agent orchestration layer — same language, same types, same repo as the frontend
  - Living Portfolio: intent classifier → archetype selector → layout composer pipeline
  - Ambient Blog: trigger evaluator → relevance assessor → intervention selector with budget constraints
- **`@ag-ui/langgraph`** bridges the LangGraph.js graphs to the AG-UI protocol, supporting both local in-process graphs and remote LangGraph Cloud deployments
- **`@copilotkit/runtime`** served via a Next.js API route (`/api/copilotkit`) — no separate backend service, no Python process, no network boundary between agent and frontend
- Structured content store (MDX files with rich frontmatter, or a headless CMS)
- Intent classification cache (embedding similarity against previous intents)
- Layout archetype cache (pre-computed layout states for common visitor profiles)
- Intervention plan cache (pre-computed widget sequences for common reading patterns)

### Why Unified TypeScript
- **Shared types end-to-end.** The `PageLayout` state, `ReadingState`, `InterventionConfig`, and all agent state interfaces are defined once and used on both the agent and React sides. No keeping Python dataclasses in sync with TypeScript interfaces.
- **Single deployment.** One Next.js app — the agents run in-process within the API route's serverless function. No separate container for a Python backend, no inter-service networking.
- **Simpler DX.** One package manager, one test runner, one linter config, one CI pipeline. Changes to agent behavior and the frontend that consumes it ship in the same PR.

### State Model

```typescript
// Shared types — used by both LangGraph.js agents and React components

type PageLayout = {
  archetype: "recruiter" | "developer" | "client" | "casual" | "blog_reader";
  sections: SectionConfig[];    // ordered list of component configs
  tone: "professional" | "technical" | "conversational";
  depth: "overview" | "detailed";
};

type BlogAgentState = {
  reading_state: ReadingState;  // section dwell times, scroll speed, highlights, current position
  intervention_budget: number;  // starts at 3, replenishes over scroll distance
  interventions_shown: InterventionRecord[];
  visitor_profile: VisitorProfile; // accumulated reading patterns across sessions
};

// Frontend wiring — both agents run as separate useAgent instances
// import { useAgent } from "@copilotkit/react-core/v2";

const { agent: portfolio } = useAgent({ agentId: "portfolio-composer" });
const { agent: blog } = useAgent({ agentId: "reading-companion" });

// Agents can share context when a blog reader navigates to the portfolio
portfolio.setMessages(blog.messages);
```

### Performance Guardrails
- LLM calls are infrequent: 1 call for portfolio composition, 3–5 calls per blog article read
- Prompt caching for the system prompt and content corpus (stable prefix across all requests)
- Pre-computed intervention plans for common reading patterns (LLM only needed for unusual behavior or cross-article context)
- Full-page layout snapshots cached by archetype
- Component-level memoization for stable props

---

## Content Strategy

### Portfolio Content
Structured data, not prose blobs. Each project, role, and accomplishment is stored as a typed TypeScript object with fields for: title, description, impact metrics, tech stack, timeframe, tags, target audience relevance scores. Because the agents and frontend share the same TypeScript types, the agent can filter, sort, and present content with full type safety — no serialization mismatches between backend and frontend.

### Blog Content
MDX articles with enriched frontmatter declaring:
- Topics and tags
- Related articles (explicit connections for concept bridges)
- Available widgets per section (comparison data, sandbox templates, depth-toggle variants)
- Estimated reading time and complexity level

Each article is a self-contained reading experience that *optionally* becomes interactive when the agent layer is active.

### Authoring Workflow
Write the article. Then ask: "If I were sitting next to the reader, what would I point out? What would I show them? Where might they need more context?" Author those interventions as structured widget configs in the frontmatter. The agent handles the *when*, I handle the *what*.

---

## Visitor Archetypes

| Archetype | Intent Signal | Portfolio Response | Blog Response |
|---|---|---|---|
| **Recruiter / Hiring Manager** | "AI engineering lead", "your experience", resume keywords | Leadership narrative, impact metrics, team scale, enterprise logos | Professional tone, TLDR-forward, link to relevant case studies |
| **Fellow Developer** | "your stack", "LangGraph", technical terms | Architecture diagrams, code samples, technical deep-dives, opinions | Full depth, code sandboxes active, comparison widgets, related reading |
| **Potential Client** | "automation consulting", "how you can help", business language | Case studies, ROI metrics, process overview, engagement models | Business-outcome framing, methodology highlights |
| **Casual Browser** | Vague or social ("what's up", "cool site", no input) | Magazine-style layout, recent posts, personal voice | Light interventions, mostly concept bridges and related reading |
| **Blog-Referred** | Arrived via direct link to article | Minimal portfolio interruption, reading-focused | Full ambient blog experience, cross-article connections |
| **Returning Visitor** | Recognized via persisted thread | "Welcome back" continuity, surface what's new since last visit | Concept bridges to previously-read articles, depth preferences remembered |

---

## Success Metrics

**Engagement quality, not vanity metrics.** The goal is not to maximize time on site — it's to maximize the chance that each visitor finds exactly what they came for.

- **Intent resolution rate:** What percentage of visitors who type an intent get a layout that addresses it without further interaction?
- **Intervention acceptance rate:** Of agent-surfaced widgets, what percentage are engaged with vs. dismissed? Target: >60% engagement, <15% dismissal.
- **Return visit rate:** Do people come back? Especially for the blog.
- **Portfolio conversion signals:** Do recruiters reach out? Do developers star repos? Do potential clients make contact? (Tracked via lightweight, privacy-respecting analytics.)
- **Baseline experience quality:** Lighthouse scores, Core Web Vitals, accessibility audit. The static foundation must be excellent.

---

## Phased Roadmap

### Phase 0 — Foundation
Build a beautiful, static Next.js personal site with structured content. No agent, no CopilotKit. Just a fast, well-designed site with a component library, MDX blog, and structured project data. This is the fallback that must be excellent on its own.

**Delivers:** A live, deployed personal site at oddrationale.com. The content store. The component library. The blog.

### Phase 1 — The Living Portfolio
Integrate CopilotKit v2 in headless mode. Add the intent prompt to the landing page. Build the LangGraph.js intent classifier and layout composer as an in-process agent served via a Next.js API route. Wire up 3 archetypes (recruiter, developer, casual) with cached layout states. Connect the frontend via `useAgent` from `@copilotkit/react-core/v2`.

**Delivers:** A personal site that reconfigures based on visitor intent. First "wow" moment.

### Phase 2 — The Ambient Blog
Add reading state instrumentation. Build the intervention trigger system and budget logic as a second LangGraph.js agent, wired to the frontend via a second `useAgent` instance. Author widget configs for 3–5 existing blog posts. Deploy with the two-tier trigger/evaluate architecture.

**Delivers:** Blog posts that respond to how you read them. Second "wow" moment.

### Phase 3 — Continuity and Memory
Leverage CopilotKit v1.50's built-in thread persistence to enable cross-session continuity — threads are durable and auto-reconnect, so no custom persistence plumbing is needed. Enable cross-session concept bridges and returning visitor recognition. Wire up multi-agent context sharing (`portfolio.setMessages(blog.messages)`) so the portfolio agent knows what a blog reader has been exploring. Refine intervention timing based on real engagement data.

**Delivers:** A site that gets better the more you visit. The relationship deepens.

### Phase 4 — Polish and Expand
Expand archetype coverage. Author intervention widgets for the full blog archive. Performance optimization (pre-computed intervention plans, aggressive caching). Write the "making of" blog post series — the site becomes its own best case study.

**Delivers:** A complete, production-quality agentic personal website. A reference implementation for the idea.

---

## What This Is Not

- **Not a chatbot.** There is no chat sidebar. No message bubbles. The page is the interface.
- **Not a gimmick.** The agentic features serve the visitor's goals, not the author's ego. If the agent doesn't improve the experience, it stays silent.
- **Not a black box.** The agent selects from authored content and pre-built components. It cannot fabricate, hallucinate, or improvise beyond what's been curated.
- **Not inaccessible.** The static foundation is screen-reader friendly, keyboard navigable, and fast on any connection. Agentic features are progressive enhancement.
- **Not creepy.** No personal data collection. Reading state is processed locally. Visitor profiles are anonymous behavioral patterns stored in the visitor's own browser. The agent asks permission before significant page changes.

---

## The Odd Rationale (Reprise)

The name works on two levels. There's always an odd rationale behind the decisions that matter — the unconventional thinking that leads to breakthroughs. And this site itself is an odd rationale: the argument that a personal website can be more than a static document, that it can be a living, responsive, intelligent experience.

If the best way to show what you can do is to *do it*, then oddrationale.com is the portfolio, the case study, and the demo — all at once.
