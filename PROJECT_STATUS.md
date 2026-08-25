# Ant Wealth Creation — Master Project Status & Handoff Document

> **Document Version:** 1.8.0  
> **Last Updated:** August 26, 2026  
> **Project Root:** `c:\WORK\Software\Antigravity\AWC_2026_08_23`  
> **Repository:** [https://github.com/santhosh144awc/AntWealth_2026_08](https://github.com/santhosh144awc/AntWealth_2026_08)  
> **Live Deployment:** [https://antwealth.vercel.app](https://antwealth.vercel.app)  
> **Target Production Domain:** [https://antwealth.in](https://antwealth.in)  
> **Status:** All 250 automated unit tests passing • 27 static pages compiled • 0px mobile overflow verified

---

## 1. Project Name & Purpose

* **Project Name:** Ant Wealth Creation (AWC)
* **Tagline:** *Make Better Money Decisions. Build a Better Future.*
* **Purpose:** A family-centric, educational, and goal-oriented digital platform for an AMFI-Registered Mutual Fund Distributor. The website empowers Indian families to discover their life milestones, evaluate their financial health, utilize interactive calculators with zero forced lead capture, read jargon-free financial education, and schedule transparent one-on-one consultations.

---

## 2. Current Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | **Astro 5.18.2** | Static-First generator with island architecture (`output: "static"`). |
| **UI Components** | **React 19.0.0** | Interactive client islands (`client:load`, `client:visible`). |
| **Language** | **TypeScript 5.7.3** | Strict type safety for calculations and schema definitions. |
| **Styling** | **Custom Vanilla CSS** | CSS variables, responsive grid & flexbox, zero heavyweight utility bloat. |
| **Content Engine** | **Astro Content Collections** | Schema-validated Markdown files in `src/content/articles/`. |
| **Icons & Media** | **Custom SVG & Vector Icons** | Pure SVG icons for zero third-party font overhead. |
| **Node Environment** | **Node.js v24.19.0** | Windows PowerShell environment. |

---

## 3. Project Folder Structure

```
AWC_2026_08_23/
├── .git/                                 # Git repository (branches: main, AntWealth_2026_08)
├── .gitignore                            # Comprehensive ignore rules
├── astro.config.mjs                      # Astro configuration with @astrojs/react
├── package.json                          # Dependencies, test runner, and build scripts
├── tsconfig.json                         # TypeScript compiler configuration
├── PROJECT_STATUS.md                     # THIS MASTER HANDOFF DOCUMENT
├── public/
│   ├── assets/                           # Production brand assets, WebP optimized images, logos, founder photo
│   │   ├── Ant Wealth Creation Website Blueprint.png
│   │   ├── homeScreenimage.png
│   │   ├── homeScreenimage.webp          # High-fidelity WebP hero asset (217.6 KB)
│   │   ├── logo awc.png
│   │   ├── logo with tagline.png
│   │   ├── logo_with_tagline.webp        # Lossless WebP logo asset (78.7 KB)
│   │   ├── SANTHOSH .jpg
│   │   ├── santhosh_photo.jpg
│   │   ├── santhosh_photo.webp           # High-fidelity WebP founder portrait (305.1 KB)
│   │   ├── Visiting Card Front.png
│   │   └── Visiting Card back.png
│   └── robots.txt                        # Search engine crawling rules & sitemap reference
└── src/
    ├── components/
    │   ├── Header.astro                  # Main sticky header with brand logo & navigation
    │   ├── Footer.astro                  # 4-column footer with regulatory notices & legal links
    │   ├── Hero.astro                    # 2-column hero with seamless family image integration
    │   ├── HealthCheckTeaser.astro       # Interactive teaser for 3-minute financial health score
    │   ├── GoalCards.astro               # 6 life milestone goal cards
    │   ├── CalculatorCards.astro         # 5-in-1 calculator toolkit teaser cards
    │   ├── FinancialJourney.astro        # 6-step family financial roadmap
    │   ├── LearningSection.astro         # Featured articles & categories teaser
    │   ├── TrustSection.astro            # 4 trust pillars & regulatory registration display
    │   ├── MeetFounder.astro             # Founder story teaser on homepage
    │   ├── WhyAntWealth.astro            # 5 Core Philosophy Cards
    │   ├── ConsultationExpectations.astro# 3-step "What happens when you talk to Santhosh?" module
    │   ├── calculators/                  # Interactive React Calculator Suite
    │   │   ├── CalculatorsHub.tsx        # Tabbed 5-in-1 calculator hub with URL query sync
    │   │   ├── ChildrenFuturePlanner.tsx # Multi-goal Children's Future Planner with asset projection
    │   │   ├── LifeInsuranceNeedCalculator.tsx # 5-step QPFP Life Insurance Need Analysis calculator
    │   │   ├── REALFinancialStatement.tsx# 5-step REAL Financial Statement assessment & snapshot
    │   │   ├── SIPCalculator.tsx         # Monthly SIP, Step-Up SIP, and Lumpsum calculator
    │   │   ├── LumpsumCalculator.tsx     # Dedicated one-time compounding calculator
    │   │   ├── RetirementCalculator.tsx  # Post-retirement corpus & monthly required SIP
    │   │   ├── GoalPlannerCalculator.tsx # Inflation-adjusted milestone goal planner with cross-discovery banner
    │   │   ├── LoanVsInvestmentCalculator.tsx # Prepayment vs mutual fund SIP simulator
    │   │   ├── InsuranceCalculator.tsx   # Income replacement human life value tool
    │   │   └── NetWorthCalculator.tsx    # Liquid/Fixed assets vs liabilities balance calculator
    │   ├── consultation/
    │   │   └── ConsultationBooking.tsx   # 4-step voluntary scheduler with direct WhatsApp bridge
    │   ├── health/
    │   │   ├── HealthCheckIntro.astro    # Financial Health Check introduction hero
    │   │   ├── HealthQuestionnaire.tsx   # 7-step weighted financial health diagnostic
    │   │   └── HealthScoreGauge.tsx      # SVG interactive radial gauge
    │   └── learning/
    │       ├── ArticleCard.astro         # Card item for educational articles
    │       ├── CategoryCard.astro        # Category selector card
    │       └── RelatedArticles.astro     # Related reading suggestions
    ├── content/
    │   ├── config.ts                     # Zod schema for article content collections
    │   └── articles/                     # 10 foundational financial guides (Markdown)
    │       ├── how-much-emergency-fund-should-you-have.md
    │       ├── how-to-plan-for-your-childs-education.md
    │       ├── how-to-start-planning-for-retirement.md
    │       ├── sip-vs-lumpsum-what-is-the-difference.md
    │       ├── what-is-a-mutual-fund.md
    │       ├── what-is-asset-allocation.md
    │       ├── what-is-financial-freedom.md
    │       ├── what-is-goal-based-financial-planning.md
    │       ├── what-is-sip-and-how-does-it-work.md
    │       └── why-life-insurance-is-important-for-a-family.md
    ├── data/
    │   └── siteConfig.ts                 # Single source of truth for business data, phone, email, disclaimers
    ├── layouts/
    │   ├── BaseLayout.astro              # Global layout with SEO meta tags & FinancialService JSON-LD
    │   └── ArticleLayout.astro           # Long-form article layout with Breadcrumbs & Article JSON-LD
    ├── pages/
    │   ├── index.astro                   # Homepage
    │   ├── plan.astro                    # Goal Discovery & Planning Hub
    │   ├── plan/
    │   │   └── children.astro            # Children's Future Planner (Multi-Goal Milestone Hub)
    │   ├── tools.astro                   # Calculators Toolbox (?calc= query support)
    │   ├── tools/
    │   │   └── life-insurance.astro      # Life Insurance Need Analysis (5-Step QPFP Calculator)
    │   ├── health-check.astro            # 3-Minute Financial Health Check
    │   ├── health-check/
    │   │   └── real-statement.astro      # REAL Financial Statement (5-Step Assessment)
    │   ├── learn/
    │   │   ├── index.astro               # Learning Center Library
    │   │   └── [...slug].astro           # Dynamic article renderer
    │   ├── about.astro                   # About Santhosh & Ant Wealth Creation
    │   ├── contact.astro                 # Contact channels & Consultation scheduler
    │   ├── privacy.astro                 # Privacy Policy
    │   ├── terms.astro                   # Terms of Use
    │   ├── disclaimer.astro              # Regulatory Disclosures & AMFI ARN Details
    │   ├── 404.astro                     # Custom 404 recovery page
    │   └── sitemap.xml.ts                # Dynamic XML sitemap generator
    ├── styles/
    │   └── global.css                    # Design tokens, typography, CSS resets, utility classes
    └── utils/
        └── calculations/                 # Centralized Financial Math Calculation Engine
            ├── lifeInsuranceNeed.ts      # Validated NetworkFP/QPFP Life Insurance Need Calculation Engine
            ├── lifeInsuranceNeed.test.ts # 33 automated unit test cases
            ├── childrenFuturePlanner.ts  # Validated NetworkFP/QPFP multi-goal calculation engine
            ├── childrenFuturePlanner.test.ts # 67 automated regression test cases
            ├── realFinancialStatement.ts # NetworkFP/QPFP REAL Statement calculation engine
            ├── realFinancialStatement.test.ts # 45 automated unit test cases
            ├── lumpsum.ts                # One-time investment compounding calculation engine
            ├── lumpsum.test.ts           # 16 automated unit test cases
            ├── emergencyFund.ts
            ├── financialHealth.ts
            ├── goalPlanner.ts
            ├── index.ts
            ├── insurance.ts
            ├── loanVsInvestment.ts
            ├── netWorth.ts
            ├── retirement.ts
            ├── sip.ts
            └── swp.ts
```

---

## 4. Completed Phases Summary (Phases 1–16)

* **Phase 1–2 (Scaffolding & Design System):** Setup Astro 5 with React 19, established global design tokens (`--color-navy-dark: #00182A`, `--color-growth-teal: #00AB96`, `--color-warm-gold: #FFC107`), mobile-first CSS architecture, and base layout.
* **Phase 3 (Homepage & Hero Visual Blend):** Implemented a high-converting, trust-building homepage with approved two-column hero where `homeScreenimage.webp` seamlessly blends into the clean white hero background without boxed card borders.
* **Phase 4 (Financial Health Check):** Created a 7-step weighted self-assessment (Emergency, Insurance, Investments, Retirement, Debt, Discipline, Tax) calculating a 0–100 score with visual radial gauge and non-prescriptive illustrative guidance.
* **Phase 5 (Calculators Suite & Central Calculation Engine):** Developed `src/utils/calculations/` single source of truth and built the 5-in-1 tabbed calculators suite (`/tools?calc=...`) and `/plan?goal=...`.
* **Phase 6 (Learning Center — Money Made Simple):** Created `/learn` hub and 10 full-length Markdown articles covering mutual fund basics, SIP compounding, asset allocation, insurance, and retirement.
* **Phase 7 (Trust, About & Consultation Experience):** Built `/about` (7 comprehensive sections with verified founder credentials) and `/contact` (direct channels + 4-step voluntary consultation scheduler with direct WhatsApp bridge).
* **Phase 8 (Product QA, SEO, Legal & Compliance):** Added `/privacy`, `/terms`, `/disclaimer`, `/404`, dynamic `sitemap.xml`, `robots.txt`, global `FinancialService` structured data, and performed responsive testing across 6 viewports with 0 errors.
* **Phase 9 (Final Business Owner Review & Deployment Audit):** Verified end-to-end user journeys, audited calculation edge cases, confirmed 0 forced lead capture, and pushed production repository to GitHub (`AntWealth_2026_08`).
* **Phase 10 (Image Optimization & Deep-Link Routing Fix):** Converted raster images to high-fidelity WebPs, added dynamic history state listeners and lazy URL initialization to `CalculatorsHub.tsx`.
* **Phase 11 (Children's Future Planner):** Built `/plan/children`, implementing pure NetworkFP / QPFP financial calculation engine, 46 automated regression test cases, multi-goal React island, and WhatsApp consultation bridge.
* **Phase 12 (Dedicated Lumpsum Calculator):** Built `/tools?calc=lumpsum`, pure compound interest engine with real inflation purchasing power toggle, and 16 unit tests.
* **Phase 13 (Application-Wide Responsive QA & Global Mobile Optimization):** Audited 36 routes/states across 5 viewports (180 page evaluations with 0px horizontal overflow).
* **Phase 14 (Children's Future Planner Inflation Cleanup):** Standardized 6% uniform default inflation, dynamic neutral wording, and 15 additional test cases (67 total).
* **Phase 15 (REAL Financial Statement Excel-to-UI Conversion):** Built `/health-check/real-statement`, pure NetworkFP / QPFP REAL Statement calculation engine, 45 automated unit tests, 5-step guided assessment, Actual Net Worth hero, available investment surplus, and WhatsApp consultation bridge.
* **Phase 16 (Life Insurance Need Analysis Excel-to-UI Conversion):** Built `/tools/life-insurance`, pure NetworkFP / QPFP Life Insurance Need calculation engine with exact compound Fisher real return and Annuity-Due ($type = 1$) future living expense corpus, 33 automated unit tests, 5-step guided assessment, protection gap hero, and WhatsApp consultation bridge.

---

## 5. All Production Routes / Pages (24 Total)

1. `/` — **Homepage:** Hero with family image blend, Health Check teaser, 6 Goal cards, 5 Calculator teasers, 6-Step Journey, Learning teaser, Trust pillars, Founder story teaser, Consultation CTA, and Footer.
2. `/plan` — **Goal Discovery Hub:** Preconfigured goal presets (`?goal=education|home|retirement|wedding|car|wealth`) with discovery banner to `/plan/children`.
3. `/plan/children` — **Children's Future Planner:** Multi-goal planning suite for graduation, post-graduation, marriage, and custom milestones.
4. `/tools` — **Calculators Suite:** Tabbed 6-in-1 calculators (`?calc=sip|lumpsum|retirement|loan-vs-invest|insurance|net-worth`).
5. `/tools/life-insurance` — **Life Insurance Need Calculator:** 5-step guided QPFP protection gap analysis (Loans, Goals, Living Expenses, Assumptions, Resources).
6. `/health-check` — **3-Minute Financial Health Check:** 7-step diagnostic questionnaire with category breakdown, action tips, and discovery banner to REAL Statement.
7. `/health-check/real-statement` — **REAL Financial Statement:** 5-step guided assessment (Income, Expenses, Savings & Investing, Assets, Liabilities) calculating Actual Net Worth, investable surplus, and cash flow balance sheet story.
8. `/learn` — **Learning Center Hub:** Filterable library of articles with reading times, category tags, and calculator CTA bridges.
9. `/about` — **About Santhosh & Mission:** Meet Santhosh, The Story (LIC heritage, established 14 April 2023), Why AWC Exists, 5 Philosophy Cards, Verified Credentials, 5-Step Process, Soft CTA.
10. `/contact` — **Contact & Consultation:** WhatsApp, Phone, Email, Dharmapuri Office, and 4-step voluntary appointment scheduler.
11. `/privacy` — **Privacy Policy:** Data confidentiality, voluntary scheduling data handling, zero forced capture policy.
12. `/terms` — **Terms of Use:** Legal usage terms, educational simulation notices, AMFI distributor scope.
13. `/disclaimer` — **Disclaimers & Disclosures:** Official AMFI ARN: 266896 details, mutual fund risk warnings, non-RIA disclosure.
14. `/404` — **Page Not Found:** Branded recovery screen with navigation action buttons.
15. `/learn/what-is-a-mutual-fund`
16. `/learn/what-is-sip-and-how-does-it-work`
17. `/learn/sip-vs-lumpsum-what-is-the-difference`
18. `/learn/how-much-emergency-fund-should-you-have`
19. `/learn/what-is-asset-allocation`
20. `/learn/how-to-plan-for-your-childs-education`
21. `/learn/how-to-start-planning-for-retirement`
22. `/learn/why-life-insurance-is-important-for-a-family`
23. `/learn/what-is-financial-freedom`
24. `/learn/what-is-goal-based-financial-planning`

---

## 6. Calculation Engines & Purpose (`src/utils/calculations/`)

All calculation functions are strictly centralized in `src/utils/calculations/`:

* `realFinancialStatement.ts`: Validated NetworkFP/QPFP REAL Statement calculation engine. Calculates annual income source of truth, 5-category monthly living expenses, annual savings, savings rate velocity, monthly ongoing investments, surplus available for new investments, personal-use asset isolation, notional net worth, actual net worth, debt-to-asset ratio, and factual observations.
* `childrenFuturePlanner.ts`: Validated NetworkFP/QPFP multi-goal calculation engine, effective monthly compounding Ordinary Annuity PMT, geometric annual step-up increment solver, horizon-based return defaults, and consumer asset projection.
* `lumpsum.ts`: Compound interest for one-time investments ($FV = P \times (1+r)^n$) with optional inflation purchasing power.
* `sip.ts`: Standard SIP formula ($FV = P \times \frac{(1+r)^n - 1}{r} \times (1+r)$), Step-Up SIP (annual percentage increment compounding), and Required Monthly SIP solver.
* `goalPlanner.ts`: Combines inflation-adjusted future goal cost calculation with existing savings compounding and computes the required monthly SIP.
* `retirement.ts`: Projects inflation-adjusted monthly expenses at retirement, computes life-expectancy post-retirement corpus using annuity formulas, and solves for required pre-retirement monthly SIP.
* `loanVsInvestment.ts`: Computes monthly EMI, amortization schedule, interest saved through loan prepayments vs wealth created by investing equivalent surplus into mutual fund SIP.
* `insurance.ts`: Human Life Value (HLV) income replacement method calculating cover needed based on income replacement multiplier, liabilities, and milestone obligations.
* `financialHealth.ts`: 7-category weighted scoring matrix (Emergency Fund 15%, Life/Health Insurance 20%, Long-Term Investments 20%, Retirement Planning 15%, Debt Management 15%, Financial Discipline 10%, Tax Planning 5%).

---

## 7. Design System & Visual Rules

* **Color Palette:**
  - **Deep Navy:** `#00182A` (Primary headings, dark sections, footer, authority)
  - **Growth Teal:** `#00AB96` (Primary accent, CTAs, growth indicators, active tabs)
  - **Warm Gold:** `#FFC107` (Milestones, highlights, stars, badges)
  - **Slate Grey:** `#334155` (Body text, subtext)
  - **Light Background:** `#F8FAFC` (Section backgrounds, card backgrounds)
  - **Clean White:** `#FFFFFF` (Card surfaces, hero base)
* **Typography:**
  - **Headings:** `'Outfit', sans-serif` (Modern, clean, friendly, geometric)
  - **Body / Numbers:** `'Inter', sans-serif` (Highly legible for financial data and tables)
* **Visual Treatment Rules:**
  - **Hero Image:** Must visually merge into the white background using smooth gradients/masking. **Never** place the hero image in a rectangular bordered card.
  - **Cards:** Rounded (`border-radius: 12px` to `16px`), subtle borders (`1.5px solid #E2E8F0`), soft box-shadow on hover (`0 10px 25px -5px rgba(0,0,0,0.06)`).
  - **Zero Dark Patterns:** Zero popups, zero forced lead capture modals, zero countdown timers.

---

## 8. Business Information & Compliance Details

All business details are centralized in `src/data/siteConfig.ts`:

* **Trade Name:** Ant Wealth Creation
* **Founder Name:** `C. Santhosh Sathriyan, B.E.`
* **Professional Certification:** `QPFP Certified` (Qualified Personal Finance Professional)
* **Regulatory Registration:** `AMFI-Registered Mutual Fund Distributor`
* **AMFI Registration Number (ARN):** `ARN: 266896`
* **Industry Experience:** Mutual fund market experience since `2012`
* **Firm Established Date:** `14 April 2023`
* **Office Location:** `Dharmapuri, Tamil Nadu, India`
* **Contact Phone:** `+91 80879 71566`
* **Contact Email:** `santhosh@antwealth.in`
* **Website Domain:** `https://antwealth.in`
* **Statutory Compliance Rules:**
  - **Do NOT call Santhosh:** "SEBI Registered Investment Adviser", "SEBI RIA", "Investment Adviser", or "Financial Advisor" (unless explicitly in a negative disclaimer).
  - **Prohibited Claims:** Never use "Guaranteed Returns", "Assured Returns", "Risk Free", or "Guaranteed Wealth".
  - **Mandatory Disclaimer:** *"Mutual Fund investments are subject to market risks, read all scheme related documents carefully."*

---

## 9. Current Image Assets & Usage

* `public/assets/homeScreenimage.png` (1.77 MB) — Homepage hero financial journey visual.
* `public/assets/SANTHOSH .jpg` / `santhosh_photo.jpg` (936 KB) — Founder portrait on `/about` and homepage founder section.
* `public/assets/logo with tagline.png` (156 KB) — Header and footer brand logo.
* `public/assets/logo awc.png` (19.6 KB) — Favicon and square brand mark.
* `public/assets/Visiting Card Front.png` (185 KB) — Universal Open Graph social sharing image.
* `public/assets/Visiting Card back.png` (94.9 KB) — Social sharing secondary asset.
* `public/assets/Ant Wealth Creation Website Blueprint.png` (1.73 MB) — Reference design blueprint.

---

## 10. SEO & WhatsApp Configuration

* **SEO Meta Tags:** Dynamic `<title>`, `<meta name="description">`, `<link rel="canonical">`, Open Graph tags (`og:title`, `og:image`, `og:url`), and Twitter Cards on all pages.
* **Structured Data (JSON-LD):**
  - Global `FinancialService` / `Organization` schema in `BaseLayout.astro`.
  - `Article` schema with author credentials on every guide in `ArticleLayout.astro`.
* **Sitemap:** Dynamic XML sitemap at `/sitemap.xml` generated by `src/pages/sitemap.xml.ts`.
* **Robots Directives:** Configured in `public/robots.txt`.
* **WhatsApp Deep Link:** `https://wa.me/918087971566?text=...` with auto-formatted appointment requests generated by `ConsultationBooking.tsx`.

---

## 11. How to Run Locally & Build

Prepend the Node and MinGit paths in PowerShell:

```powershell
# Set Node and Git paths in PowerShell session
$env:Path = "C:\Users\SANTHOSH\.mingit\cmd;C:\Program Files\nodejs;" + $env:Path

# Install dependencies (if needed in new environment)
npm install

# Start local development server (runs on http://localhost:4321)
npm run dev

# Run production build (compiles all 23 static pages)
npm run build

# Preview production build locally
npm run preview
```

---

## 12. Git Status & Remote Repository

* **Repository URL:** [https://github.com/santhosh144awc/AntWealth_2026_08.git](https://github.com/santhosh144awc/AntWealth_2026_08.git)
* **Active Branches:** `main` (default production), `AntWealth_2026_08`
* **Latest Production Commit:** `20909c2` (*feat(real-statement): implement REAL Financial Statement Excel-to-UI conversion (Phase 15)*)
* **Current Working Tree:** Clean (all commits pushed to GitHub).

---

## 13. Critical Change Control Rules (Do NOT Modify Without User Approval)

1. **Do NOT Redesign the Homepage:** The layout, 2-column hero structure, and section hierarchy are approved.
2. **Do NOT Box or Border the Hero Image:** `homeScreenimage.png` must blend seamlessly into the white background.
3. **Do NOT Introduce Forced Lead Capture:** All calculators, health checks, and articles must remain 100% un-gated.
4. **Do NOT Alter Compliance Designations:** Always display `C. Santhosh Sathriyan, B.E., QPFP Certified, AMFI-Registered Mutual Fund Distributor (ARN: 266896)`.
5. **Do NOT Split Calculation Logic:** Any calculator UI must import from `src/utils/calculations/`.

---

---

## 14. Phase 10.1 — Production Image Optimization (Completed)

* **Objective:** Optimize production raster assets to high-efficiency modern WebP formats while preserving 100% pixel-perfect visual fidelity, gradients, masks, and exact dimensions.
* **Optimization Details:**
  * `homeScreenimage.webp` (1672 × 941): Converted with Quality 92 for extreme gradient feathering and sunrise edge fidelity. File size reduced from **1,770.66 KB to 217.60 KB (87.71% reduction)**.
  * `santhosh_photo.webp` (1291 × 1659): Converted with Quality 90 for razor-sharp portrait detail. File size reduced from **936.34 KB to 305.10 KB (67.42% reduction)**.
  * `logo_with_tagline.webp` (1348 × 298): Converted with Lossless WebP for pixel-perfect typography and ant icon crispness. File size reduced from **156.06 KB to 78.74 KB (49.55% reduction)**.
  * **Original Assets Retained:** `homeScreenimage.png`, `SANTHOSH .jpg`, `logo with tagline.png`, and concept assets remain preserved in `public/assets/` as rollback copies.
  * **Intentionally Unchanged Assets:** `Visiting Card Front.png` (Open Graph / Twitter Card social scrapers prefer PNG/JPEG for maximum third-party compatibility), `logo awc.png` (Favicon 19.58 KB).
* **Visual QA Verification:**
  * Tested across 6 target viewports: `375×812`, `390×844`, `768×1024`, `1024×768`, `1440×900`, `1920×1080`.
  * Results: Zero horizontal overflow, zero layout shift, seamless gradient blending on homepage hero, crisp founder portrait on `/about`, and sharp navbar logo rendering.
* **Build Verification:** `npm run build` generates all 21 static routes with 0 errors and 0 warnings.

---

## 15. Phase 10.2 — Production Bug Fix: Calculator Deep-Link Routing (Completed)

* **Issue Identified:** Visiting `/tools?calc=...` deep links (e.g. `/tools?calc=insurance`, `/tools?calc=retirement`, `/tools?calc=net-worth`) on static/live deployments resolved to the default SIP calculator tab due to static state initialization and lack of popstate history listener.
* **Root Cause:**
  1. `CalculatorsHub.tsx` initialized `useState<CalculatorTab>('sip')` with a hardcoded static string instead of lazily parsing `window.location.search` during client initialization.
  2. The `useEffect` hook only ran once on mount and lacked a `popstate` event listener, causing browser Back/Forward navigation to get out of sync with the active calculator.
  3. `CalculatorCards.astro` had an ID check mismatch (`loan-vs-investment` instead of `loan-vs-invest`).
* **Files Changed:**
  * `src/components/calculators/CalculatorsHub.tsx`: Added `normalizeTab`, `getTabFromUrl`, lazy state initializer `useState<CalculatorTab>(getTabFromUrl)`, `popstate` listener in `useEffect`, and `window.history.pushState` URL sync.
  * `src/components/CalculatorCards.astro`: Aligned icon check for `loan-vs-invest`.
* **Verification & QA:**
  * **URLs Tested:** `/tools`, `/tools?calc=sip`, `/tools?calc=retirement`, `/tools?calc=goal`, `/tools?calc=loan-vs-invest`, `/tools?calc=insurance`, `/tools?calc=net-worth`.
  * **Interactive Flows:** Direct navigation, browser refresh, manual tab clicking with URL updating, and browser Back/Forward navigation tested with 100% pass rate.
  * **Responsive QA:** Tested at `375×812`, `390×844`, `768×1024`, `1440×900` with 0 horizontal overflow and 0 console errors.
  * **Build Result:** `npm run build` generated 21 static routes with 0 errors and 0 warnings.

---

## 16. Phase 11 — Children's Future Planner (Completed)

* **Objective:** Implement a multi-goal **Children's Future Planner** at `/plan/children` based on the validated NetworkFP / QPFP methodology adapted for consumer UX.
* **Calculation Engine (`src/utils/calculations/childrenFuturePlanner.ts`):**
  * Effective monthly compounding for Ordinary Annuity PMT ($r_{\text{eff}} = (1 + r)^{1/12} - 1$, $\text{PMT} = \text{FV} \times \frac{r_{\text{eff}}}{(1+r_{\text{eff}})^n - 1}$).
  * Geometric annual step-up compounding ($\text{PMT}_{\text{start}} = \text{FV} / \sum_{y=1}^Y (1+g)^{y-1} \cdot \frac{(1+r_{\text{eff}})^{12}-1}{r_{\text{eff}}} \cdot (1+r)^{Y-y}$).
  * Dynamic expected return defaults: $<5$ yrs = 7%, $5$–$10$ yrs = 9%, $\ge 10$ yrs = 12% (with custom override).
  * Consumer-friendly asset valuation: Earmarked assets entered as **Current Value (Today)** and projected forward at goal return rate.
  * Investment timing offsets: Supports start delay ($D$) and stop-before-goal ($S$).
* **React 19 Island (`src/components/calculators/ChildrenFuturePlanner.tsx`):**
  * Child profile with name, dynamic planning year (`new Date().getFullYear()`), and age slider.
  * Multi-goal builder with 7 milestone presets (Graduation, Post-Graduation, Marriage, Schooling, Overseas Masters, Dream Venture, Custom).
  * Add, edit, remove, and rename goals.
  * Optional earmarked assets accordion (Mutual Funds, FDs, Gold, Stocks, Endowment).
  * Master Results Dashboard: Total future cost, projected assets, net funding gap, visual progress bar.
  * 3-Way Funding Strategies Comparison: Lump Sum today, Fixed Monthly SIP, Step-Up SIP (Recommended).
  * Milestone-by-milestone breakdown cards.
  * Pre-populated advisory WhatsApp CTA and consultation bridge.
  * Statutory AMFI ARN: 266896, QPFP Certified, and educational illustration disclaimers.
* **Testing & Verification:**
  * Automated regression test suite (`src/utils/calculations/childrenFuturePlanner.test.ts`): 46 passed, 0 failed.
  * Exact match with NetworkFP reference cases:
    * Graduation: ₹9,910 Fixed SIP / ₹6,027 Step-Up SIP
    * Post-Graduation: ₹8,238 Fixed SIP / ₹4,509 Step-Up SIP
    * Marriage: ₹20,429 Fixed SIP / ₹9,808 Step-Up SIP
  * Production Build: `npm run build` compiled all 22 static routes with 0 errors.

---

## 17. Phase 12 — Dedicated Lumpsum Calculator (Completed)

* **Objective:** Implement a dedicated, professional **Lumpsum Calculator** (`/tools?calc=lumpsum`) within the Ant Wealth Creation calculator suite.
* **Calculation Engine (`src/utils/calculations/lumpsum.ts`):**
  * Reused centralized pure function `calculateLumpsum(principal, expectedReturnRate, timePeriodYears)`.
  * Formula: $FV = PV \times (1 + r)^t$, where $PV$ is initial investment, $r$ is annual return rate, and $t$ is duration in years.
  * Optional inflation purchasing power formula: $PV_{\text{real}} = \frac{FV}{(1 + \text{inflation})^t}$.
* **React 19 Component (`src/components/calculators/LumpsumCalculator.tsx`):**
  * **Initial Investment:** Direct numeric input up to ₹10 Crore with ₹1,000 to ₹25 Lakh slider (Default: ₹1,00,000).
  * **Investment Duration:** 1 to 40 years input and slider (Default: 10 years).
  * **Expected Annual Return:** 1% to 30% input and slider (Default: 12% p.a.).
  * **Optional Real Value Toggle:** "What could this amount be worth in today's money?" with inflation slider.
  * **Hero Result Box:** Prominent Estimated Future Value display with Lakhs/Crores helper wording.
  * **Metrics Grid:** Total Invested vs Estimated Growth.
  * **Visual Proportion Bar:** Principal % vs Compounded Gain %.
  * **Action CTAs:** Pre-populated advisory WhatsApp message link + `/contact` free consultation booking.
  * **Educational Explanation:** "How it works" compounding explanation with formula breakdown.
  * **Compliance & Disclaimers:** Official AMFI ARN: 266896, QPFP factual credentials, and market risk disclaimers.
* **Suite & Hub Integration:**
  * Added `lumpsum` tab under "Build Wealth" in `src/components/calculators/CalculatorsHub.tsx`.
  * Deep-link support: `/tools?calc=lumpsum` directly activates the Lumpsum Calculator.
  * Added Lumpsum Calculator card to `siteConfig.calculators` and homepage `CalculatorCards.astro`.
* **Testing & Build Verification:**
  * Created unit test suite `src/utils/calculations/lumpsum.test.ts` (16 passed, 0 failed).
  * Combined test suite `npm test` (62 passed, 0 failed).
  * Static build `npm run build` compiled 22 static routes in 7.08s with 0 errors and 0 warnings.

---

## 18. Phase 13 — Application-Wide Responsive QA & Global Mobile Optimization (Completed)

* **Objective:** Comprehensive responsive audit and mobile layout hardening across all public routes, query parameter states, interactive calculators, goal planners, consultation scheduler, health questionnaire, articles, header, and footer.
* **Scope & Route Inventory Audited:**
  * **Core Pages:** `/`, `/plan`, `/plan/children`, `/tools`, `/health-check`, `/learn`, `/about`, `/contact`, `/privacy`, `/terms`, `/disclaimer`, `/404`.
  * **Interactive Calculator States:** `?calc=sip`, `?calc=lumpsum`, `?calc=retirement`, `?calc=loan-vs-invest`, `?calc=insurance`, `?calc=net-worth`, `?calc=goal`.
  * **Goal Planner States:** `?goal=home`, `?goal=education`, `?goal=retirement`, `?goal=wedding`, `?goal=car`, `?goal=wealth`, `?goal=custom`.
  * **Educational Articles (10):** All `/learn/*` markdown and astro articles.
* **Viewports Validated (Automated Puppeteer Matrix):**
  * **Mobile:** `375×812`, `390×844`, `412×915`
  * **Tablet:** `768×1024`, `1024×768`
  * **Desktop:** `1440×900`, `1920×1080`
* **Components Hardened for Mobile:**
  1. **Global Styles (`src/styles/global.css`):**
     * Mobile container padding adjusted from `1.5rem` to `1rem` on `max-width: 640px`.
     * Button wrapping made fluid with `white-space: normal` on mobile.
  2. **Header (`src/components/Header.astro`):**
     * Header container padding reduced to `1rem` on mobile.
     * Logo image scaled cleanly to `max-width: 210px`.
     * Mobile hamburger button touch target enlarged to `min-width: 44px; min-height: 44px`.
     * Mobile drawer nav items enlarged with `min-height: 44px` touch targets.
  3. **Calculator Suite (`SIPCalculator.tsx`, `RetirementCalculator.tsx`, `GoalPlannerCalculator.tsx`, `LoanVsInvestmentCalculator.tsx`, `InsuranceCalculator.tsx`, `NetWorthCalculator.tsx`, `LumpsumCalculator.tsx`):**
     * Implemented fluid mobile stacking (`flex-direction: column; align-items: stretch`) on `.label-row` and `.asset-liability-row`.
     * Full-width mobile input wrappers (`width: 100%`) with currency prefix on the left and right-aligned numeric values.
     * Adjusted mobile card padding to `1.25rem 0.875rem` for optimal breathing room.
     * Configured responsive 1-column collapse for result hero boxes, metrics grids, and sub-metrics rows.
  4. **Children's Future Planner (`ChildrenFuturePlanner.tsx`):**
     * Profile grid, milestones row, and earmarked assets inputs collapsed to clean single-column layout on mobile.
  5. **Consultation Scheduler (`ConsultationBooking.tsx`):**
     * Booking card padding reduced to `1.25rem 1rem`.
     * Form fields, date pills, slot pills, and action buttons made full-width and touch-friendly.
  6. **Financial Health Check (`HealthQuestionnaire.tsx`):**
     * Questionnaire card and result cards enhanced with fluid mobile padding and stacked action buttons.
* **Verification & Measurement Results:**
  * **Automated Overflow Tests:** 36 routes/states $\times$ 5 viewports = **180 automated page evaluations completed with 0px horizontal overflow**.
  * **Calculators Unit Tests:** **62 passed, 0 failed**.
  * **Static Build:** `npm run build` compiled 22 static routes with 0 errors and 0 warnings.
  * **Console & Runtime Errors:** 0 unhandled runtime errors.

---

## 19. Phase 14 — Children's Future Planner Category-Specific Inflation Wording & Default Cleanup (Completed)

* **Objective:** Refine the Children's Future Planner (`/plan/children`) with 6% uniform default inflation across all goal categories, goal-specific neutral explanatory wording, dynamic inflation updates, and clean consumer terminology.
* **Inflation Defaults Standardized to 6%:**
  * **Graduation:** 6% default, range: `6–10%`.
  * **Post-Graduation:** 6% default, range: `6–10%`.
  * **Marriage:** 6% default (reconciled from 10%), range: `6–10%`. Renamed preset from *"Child Marriage & Life Milestone"* to *"Marriage"*.
  * **Schooling:** 6% default, range: `6–10%`.
  * **Overseas Education:** 6% default (reconciled from 8%), range: `6–10%+` (with currency movement cited separately).
  * **Dream Venture:** 6% default, range: `5–8%`.
  * **Custom Goal:** 6% default, range: *"No standard range — choose based on your goal."*
* **Dynamic Wording & UI Cleanups:**
  * Updated input label from *"Expected Inflation"* to *"Expected Cost Inflation"*.
  * Replaced static claims with goal-specific explanations independent of the selected percentage value.
  * Added range helper with disclaimer qualifier: *"Planning range only — actual costs may vary."*
  * Updated hero headline from *"discover your exact required Step-Up or Fixed SIP"* to *"estimate the Step-Up or Fixed SIP needed for your goals."*
  * Updated metric label from *"Total in Today Money"* to *"Total Goal Cost in Today's Money"*.
  * Updated assets presentation when ₹0: shows *"Existing Assets: None added yet"*.
  * Updated milestone roadmap to display each goal's actual independent inflation (`{res.inflationRate}% / yr`).
* **Automated Tests & Regression Suite:**
  * Added 15 new automated regression tests in `src/utils/calculations/childrenFuturePlanner.test.ts` (total 67 passed in Children's Future Planner, 83 passed across repository test suite).
  * Full static compilation `npm run build` succeeded with 0 errors.
  * Puppeteer headless audit confirmed 0px horizontal overflow and accurate dynamic rendering.

---

## 20. Phase 15 — REAL Financial Statement Excel-to-UI Conversion (Completed)

* **Objective:** Convert the validated NetworkFP / QPFP REAL Statement methodology (`ProTool_04_-_REAL_Statement.xlsx`) into a guided, mobile-first 5-step financial assessment tool at `/health-check/real-statement`.
* **Methodology & Mathematical Engine (`src/utils/calculations/realFinancialStatement.ts`):**
  * **Income (Annual Source of Truth):** Gross salary (primary + spouse), bonus, business, rental, and investment income. Monthly equivalent is dynamically derived as $\text{Annual} / 12$.
  * **Expenses (Monthly Inputs):** 5 consumer categories (Household, Lifestyle, Family & Dependents, Insurance, Loan EMIs) converted to annual expenses via $\text{Monthly} \times 12$.
  * **Savings & Savings Rate:** $\text{Annual Savings} = \text{Annual Income} - \text{Annual Expenses}$. $\text{Savings Rate} = (\text{Annual Savings} / \text{Annual Income}) \times 100$. Safe division-by-zero protection.
  * **Ongoing Investments & Surplus Available for New Investments:** Monthly SIPs, RDs/Policies, and ongoing commitments $\times 12$. $\text{Surplus Available} = \text{Annual Savings} - \text{Annual Ongoing Investments}$ (displayed prominently as ₹/month and ₹/year).
  * **Asset Categories & Personal-Use Isolation:** 6 categories (Liquid, Debt, Equity, Gold, Real Estate, Personal). Explicitly isolates **Personal-Use Assets** ($\text{Primary Residence} + \text{Vehicles} + \text{Jewellery} + \text{Personal Effects}$) from Productive/Financial Investment Assets.
  * **Notional vs Actual Net Worth:**
    * $\text{Notional Net Worth} = \text{Total Assets} - \text{Total Liabilities}$.
    * $\text{Actual Net Worth (Primary Hero Result)} = \text{Total Assets} - \text{Personal-Use Assets} - \text{Total Liabilities} = \text{Productive Assets} - \text{Total Liabilities}$.
  * **Factual Observations:** Automated data-driven factual insights across savings velocity, available surplus capacity, leverage ratio, and asset composition.
* **React 19 Island (`src/components/calculators/REALFinancialStatement.tsx`):**
  * 5-Step Stepper: Step 1 (Income), Step 2 (Expenses), Step 3 (Savings & Investing), Step 4 (Assets), Step 5 (Liabilities), and Results (Financial Snapshot Dashboard).
  * Expandable accordion groups per category with live subtotals.
  * Interactive Hero Results card with Actual Net Worth prominent display.
  * Key Financial Metrics Grid (Savings Rate, Investment Rate, Surplus for New Goals, Debt-to-Asset Ratio).
  * Complete Cash Flow & Balance Sheet story track (Earn $\to$ Spend $\to$ Save $\to$ Invest $\to$ Surplus $\to$ Own $\to$ Owe $\to$ Net Worth).
  * Visual stacked asset allocation bar and distribution table.
  * Pre-populated advisory WhatsApp bridge + `/contact` free consultation booking.
  * Cross-discovery links to `/health-check`, `/plan/children`, and `/tools?calc=retirement`.
  * Official statutory AMFI ARN: 266896 and QPFP Certified disclosures.
* **Astro Page & Cross-Discovery:**
  * Route: `/health-check/real-statement` in `src/pages/health-check/real-statement.astro`.
  * Contextual discovery callout banner added to `/health-check` in `src/pages/health-check.astro`.
  * Route added to dynamic XML sitemap in `src/pages/sitemap.xml.ts`.
* **Testing & Quality Assurance:**
  * Created unit test suite `src/utils/calculations/realFinancialStatement.test.ts` (45 passed, 0 failed).
  * Combined repository test suite: **128 passed, 0 failed** (16 Lumpsum + 67 Children's Planner + 45 REAL Statement).
  * Production static compilation `npm run build`: **23 static routes compiled in 3.61s with 0 errors and 0 warnings**.
  * Puppeteer headless responsive audit: Verified **0px horizontal overflow across 5 viewports** (`375×812`, `390×844`, `412×915`, `768×1024`, `1440×900`).

---

## 21. Phase 16 — Life Insurance Need Analysis Excel-to-UI Conversion (Completed)

* **Objective:** Convert the validated NetworkFP / QPFP Life Insurance Need methodology (`ProTool_15_-_Life_Insurance_Calculator.xlsx`) into a guided, mobile-first 5-step financial assessment tool at `/tools/life-insurance`.
* **Methodology & Mathematical Engine (`src/utils/calculations/lifeInsuranceNeed.ts`):**
  * **Component A — Outstanding Liabilities:** Current principal balances across Home Loan, Vehicle Loan, Personal Loan, Education Loan, and Other Loans.
  * **Component B — Family Goals & Commitments:** Present-value estimates for Higher Education & Marriage, Primary Education, Contribution to Dependent Parents, and First House Purchase (entered in today's money without artificial independent inflation).
  * **Component C — Future Living Expense Corpus (Annuity Due):**
    * Annual family expenses after personal consumption discount: $\text{Annual Expenses} \times (1 - \text{Personal Discount})$.
    * Tax-adjusted investment return: $r_{\text{tax}} = r_{\text{gross}} \times (1 - \text{Tax Rate})$.
    * Exact Fisher compound real return: $r_{\text{real}} = \frac{1 + r_{\text{tax}}}{1 + \text{Inflation}} - 1$.
    * Present value of expenses using **Annuity Due ($type = 1$, beginning-of-period withdrawals)**: $PV_{\text{due}} = E \times \frac{1 - (1 + r)^{-n}}{r} \times (1 + r)$ (with $r = 0$ fallback $E \times n$).
  * **Total Life Insurance Requirement:** $\text{Total Requirement} = A + B + C$.
  * **Existing Resources:** Sum of existing life insurance sum assured, liquid/financial investment assets, and present value of spouse's future earnings.
  * **Additional Cover Required:** $\max(0, \text{Total Requirement} - \text{Total Resources})$.
* **React 19 Island (`src/components/calculators/LifeInsuranceNeedCalculator.tsx`):**
  * 5-Step Guided Stepper: Step 1 (Loans), Step 2 (Goals), Step 3 (Living Expenses & Personal Discount slider), Step 4 (Advanced Assumptions with live real-return breakdown), Step 5 (Existing Resources), and Results (Family Protection Snapshot).
  * Prominent Additional Cover Required Hero Card with crisp white inner card (`#FFFFFF`), growth teal eyebrow (`#00AB96`), white heading (`#FFFFFF`), and deep navy result amount (`#00182A`).
  * Reassuring overfunded state handling (zero gap message).
  * 3-Component Requirement Breakdown (A + B + C) and Visual Comparison Progress Bar.
  * Transparent "How was my result calculated?" accordion with mathematical breakdown.
  * Pre-populated advisory WhatsApp consultation bridge + `/contact` booking.
  * Active Results stepper tab styled with vibrant Growth Teal (`#00AB96`) and white icon.
  * Statutory AMFI ARN: 266896, QPFP Certified, and non-guarantee educational disclaimers.
* **Astro Page & Branding Separation:**
  * Dedicated route `/tools/life-insurance` in `src/pages/tools/life-insurance.astro`.
  * Consumer-facing methodology descriptor: `Needs-Based Family Protection Planning` (rendered exactly once on page hero).
  * Professional qualifications (`QPFP Certified | AMFI-Registered MFD`) strictly preserved across site footer, About page, and statutory disclosures.
  * Contextual discovery callout banner added to `/tools?calc=insurance` in `src/components/calculators/InsuranceCalculator.tsx`.
  * Goal and calculator entry added in `src/data/siteConfig.ts`.
  * Route registered in dynamic XML sitemap in `src/pages/sitemap.xml.ts`.
* **Testing & Quality Assurance:**
  * Created unit test suite `src/utils/calculations/lifeInsuranceNeed.test.ts` (33 passed, 0 failed).
  * Total repository test suite: **161 passed, 0 failed** (16 Lumpsum + 67 Children's Planner + 45 REAL Statement + 33 Life Insurance Need).
  * Production static compilation `npm run build`: **24 static routes compiled with 0 errors and 0 warnings**.
  * Puppeteer headless responsive audit: Verified **0px horizontal overflow and WCAG contrast across 5 viewports** (`375×812`, `390×844`, `412×915`, `768×1024`, `1440×900`).

---

## 22. Phase 17 — Home Purchase Planner Candidates Sheet Conversion (Completed)

* **Objective:** Implement the validated Candidates Sheet methodology for property acquisition, down payment planning, acquisition cost separation, 8% compounding projected income, loan EMI calculations, and 3-way funding options (Lumpsum, Fixed SIP, and Step-Up SIP) at `/tools/home-purchase`.
* **Methodology & Mathematical Engine (`src/utils/calculations/housePurchasePlanner.ts`):**
  * **Property Appreciation:** $\text{Future Property Value} = \text{Current Value} \times (1 + r_{\text{property}})^t$.
  * **Acquisition Costs:** $\text{Additional Costs} = \text{Future Property Value} \times \text{Cost\%}$ (e.g. 10% for stamp duty, registration, taxes, interiors).
  * **Loan-to-Value Base Distinction:** Home loan is calculated strictly on base $\text{Future Property Value}$ ($\text{Loan} = \text{Future Property Value} \times \text{LTV\%}$), while acquisition costs are accumulated separately by the buyer.
  * **Total Accumulation Target:** $\text{Target} = \text{Down Payment} + \text{Additional Acquisition Costs}$.
  * **Projected Income & EMI Limit:** Compounded at 8% annual growth ($\text{Projected Income} = \text{Current Income} \times (1 + 0.08)^t$) with 40% ideal debt-to-income limit.
  * **Monthly Home Loan EMI:** Periodic monthly compounding rate $r/12$, $n = \text{tenure} \times 12$.
  * **Dynamic Earmarked Assets & Deficit:** $\text{Deficit} = \max(0, \text{Target} - \text{Total Assets})$.
  * **3 Funding Options:**
    * Lumpsum Today: $PV = \text{Deficit} / (1 + r_{\text{invest}})^t$.
    * Fixed Monthly SIP: $-\text{PMT}(r/12, t \times 12, 0, \text{Deficit}, 0)$.
    * Step-Up SIP (Candidates Sheet Formula): $-\text{PMT}\left(\frac{r}{12}, 12, 0, \frac{\text{Deficit} \times (r - g)}{(1+r)^t - (1+g)^t}, 0\right)$.
* **React 19 Island (`src/components/calculators/HousePurchasePlannerCalculator.tsx`):**
  * 6-Step Guided Stepper: Goal, Future Cost, Loan & Down Payment, EMI Affordability, Existing Funds (dynamic add/remove), and Funding Plan.
  * Results Hero Card with crisp white inner container, growth teal eyebrow, pure white heading on navy hero, and deep navy result amount.
  * 3 Prominent Funding Options Grid (Lumpsum, Fixed Monthly SIP, Step-Up SIP starting amount).
  * EMI Affordability Card with projected income, planned limit, and factual status.
  * Goal Funding Progress Bar with already earmarked vs remaining need.
  * Transparent "How was this calculated?" mathematical breakdown accordion.
  * Pre-populated advisory WhatsApp consultation bridge + `/contact` booking.
  * "Try Sample Scenario" (Indore 3 BHK ₹1 Cr in 6 yrs) and "Reset" buttons.
* **Astro Page & Integration:**
  * Dedicated route `/tools/home-purchase` in `src/pages/tools/home-purchase.astro`.
  * Added `home-purchase` calculator item and updated `home` goal link in `src/data/siteConfig.ts`.
  * Route registered in dynamic XML sitemap in `src/pages/sitemap.xml.ts`.
* **Testing & Quality Assurance:**
  * Created unit test suite `src/utils/calculations/housePurchasePlanner.test.ts`.
  * Total repository test suite: **186 passed, 0 failed** (16 Lumpsum + 67 Children's Planner + 45 REAL Statement + 33 Life Insurance Need + 25 Home Purchase Planner).
  * Production static compilation `npm run build`: **25 static routes compiled with 0 errors and 0 warnings**.
  * Puppeteer headless responsive audit: Verified **0px horizontal overflow, WCAG contrast, dynamic asset add/remove, and 0 training branding** across all 5 viewports (`375×812`, `390×844`, `412×915`, `768×1024`, `1440×900`).

---

### Phase 18 — Retirement Accumulation Planner (Candidate Sheet Methodology Conversion)
* **Pure TypeScript Calculation Engine (`src/utils/calculations/retirementAccumulationPlanner.ts`):**
  * **Current Expense Aggregation:** $\text{Total Current Annual Expenses} = \text{Household} + \text{Lifestyle} + \text{Other}$, $\text{Monthly} = \text{Total} / 12$.
  * **Retirement Timeline & Future Inflation:** $\text{Years to Retire} = \text{Retirement Age} - \text{Current Age}$. $\text{Future Annual Expenses} = \text{Current Annual} \times (1 + r_{\text{inf\_pre}})^t \times (1 - \text{Reduction\%})$.
  * **Tax-Adjusted Return & Compound Fisher Real Return:**
    $$r_{\text{tax}} = r_{\text{gross}} \times (1 - \text{Tax Rate}), \quad r_{\text{real}} = \frac{1 + r_{\text{tax}}}{1 + r_{\text{inf\_post}}} - 1$$
  * **Annuity-Due Living Expense Capitalization ($type = 1$):**
    $$PV_{\text{due}} = PMT \times \frac{1 - (1 + r_{\text{real}})^{-n}}{r_{\text{real}}} \times (1 + r_{\text{real}})$$
    With $n = \text{Life Expectancy} - \text{Retirement Age}$ and $r = 0$ fallback ($PMT \times n$).
  * **Discounted Legacy Corpus:** Optional children/charity corpus discounted using real return framework: $PV_{\text{legacy}} = C / (1 + r_{\text{real}})^n$.
  * **Total Required Corpus:** $\text{Total} = PV_{\text{due}} + PV_{\text{legacy}}$.
  * **Existing Resources at Retirement (No Double Compounding):** Aggregated expected maturity values across Employment Benefits (EPF/NPS, Gratuity, Superannuation) and Personal Assets (FD, Insurance, Mutual Funds).
  * **Funding Deficit & Progress:** $\text{Deficit} = \max(0, \text{Total Corpus} - \text{Total Assets})$, $\text{Progress} = \min\left(100, \frac{\text{Total Assets}}{\text{Total Corpus}} \times 100\right)$.
  * **3-Way Funding Plan:**
    * **Lump Sum Today:** $PV = \text{Deficit} / (1 + r_{\text{invest}})^t$.
    * **Fixed Monthly SIP:** $\text{Deficit} \times \frac{(1 + r)^{1/12} - 1}{(1 + r)^t - 1}$.
    * **Step-Up Monthly SIP:** $P_0 = \frac{\text{Deficit} \times (r - g)}{(1+r)^t - (1+g)^t} \times \frac{(1 + r)^{1/12} - 1}{r}$.
* **React 19 Island (`src/components/calculators/RetirementAccumulationPlanner.tsx`):**
  * 5-Step Guided Stepper: Current Expenses, Timeline & Inflation, Required Corpus, Existing Resources, and Funding Plan.
  * Results Hero Card with dark navy gradient, Growth Teal eyebrow, pure white heading, and white inner result container with deep navy amount.
  * Goal Funding Progress Bar with already earmarked vs remaining funding gap.
  * 3 Prominent Funding Options Grid (Lump Sum, Fixed Monthly SIP, Step-Up SIP starting amount).
  * Capital Flow Journey: Today's Expenses $\to$ Expenses at Retirement $\to$ Required Corpus $\to$ Existing Assets $\to$ Funding Gap.
  * Transparent "How was this calculated?" accordion detailing exact formulas and intermediate values.
  * Pre-populated advisory WhatsApp consultation bridge + `/contact` booking.
  * "Try Sample Scenario" (Age 50 to 60, ₹12L expenses, ₹2 Cr assets) and "Reset" buttons.
* **Astro Page & Site Integration:**
  * Dedicated route `/tools/retirement` in `src/pages/tools/retirement.astro`.
  * Updated `retirement` goal and calculator links in `src/data/siteConfig.ts`.
  * Added `/tools/retirement` to XML sitemap in `src/pages/sitemap.xml.ts`.
  * Integrated `/tools/retirement` into `CalculatorsHub.tsx` featured suites and `Footer.astro`.
* **Testing & Quality Assurance:**
  * Created unit test suite `src/utils/calculations/retirementAccumulationPlanner.test.ts`.
  * Total repository test suite: **218 passed, 0 failed** (16 Lumpsum + 67 Children's Planner + 45 REAL Statement + 33 Life Insurance Need + 25 Home Purchase Planner + 32 Retirement Accumulation Planner).
  * Production static compilation `npm run build`: **26 static routes compiled with 0 errors and 0 warnings**.
  * Puppeteer headless responsive audit: Verified **0px horizontal overflow, WCAG contrast, sample scenario execution, and 0 training branding** across all 5 viewports (`375×812`, `390×844`, `412×915`, `768×1024`, `1440×900`).

---

### Phase 19 — Retirement Distribution Planner (Three-Bucket Decumulation Methodology)
* **Pure TypeScript Calculation Engine (`src/utils/calculations/retirementDistributionPlanner.ts`):**
  * **Distribution Horizon & Three-Bucket Partitioning:**
    * $\text{Distribution Years} = \max(0, \text{Life Expectancy} - \text{Retirement Age})$.
    * $B_1 = \min(3, \text{Distribution Years})$ (Liquidity).
    * $B_2 = \min(4, \max(0, \text{Distribution Years} - B_1))$ (Safety).
    * $B_3 = \max(0, \text{Distribution Years} - B_1 - B_2)$ (Wealth Creation).
  * **Inflation-Adjusted Starting Expense per Bucket:** $\text{Expense}_k = \text{Annual Expense} \times (1 + \text{Inflation})^{\text{Start Year Offset}}$.
  * **Compound Fisher Real Return per Bucket:** $r_{\text{real}, k} = \frac{1 + r_{\text{post-tax}, k}}{1 + \text{Inflation}} - 1$.
  * **Annuity-Due Living Expense Capitalization ($type = 1$):**
    $$PV_{\text{due}} = PMT \times \frac{1 - (1 + r_{\text{real}})^{-n}}{r_{\text{real}}} \times (1 + r_{\text{real}})$$
  * **Present Value Discounting to Today:**
    $$\text{InvestmentToday}_1 = PV_{\text{due}, 1}$$
    $$\text{InvestmentToday}_2 = \frac{PV_{\text{due}, 2}}{(1 + R_2)^{B_1}}$$
    $$\text{InvestmentToday}_3 = \frac{PV_{\text{due}, 3}}{(1 + R_3)^{B_1 + B_2}}$$
  * **Weighted Post-Tax Return & Overall Real Return:**
    $$\bar{R} = \frac{\sum (B_k \times R_k)}{\sum B_k}, \quad r_{\text{overall, real}} = \frac{1 + \bar{R}}{1 + \text{Inflation}} - 1$$
* **React 19 Island (`src/components/calculators/RetirementDistributionPlanner.tsx`):**
  * 3-Step Guided Stepper: Retirement Details (Age 60, Exp ₹1L/mo, Life Exp 90), Return & Inflation Assumptions (6/8/10% returns, 6% inflation), and Three Buckets Strategy.
  * Results Dashboard: Dark navy hero with Growth Teal eyebrow, pure white heading, crisp white inner card, bold deep navy result amount (`₹2.26 Cr`), horizontal responsive allocation bar, 3 bucket cards, capital flow journey, "Why does timing matter?" & "How was this calculated?" accordions, advisory WhatsApp bridge, and "Try Sample Scenario" / "Reset" buttons.
* **Astro Page & Site Integration:**
  * Dedicated route `/tools/retirement-distribution` in `src/pages/tools/retirement-distribution.astro`.
  * Added `retirement-distribution` to `calculators` and updated `income` goal in `src/data/siteConfig.ts`.
  * Added `/tools/retirement-distribution` to XML sitemap in `src/pages/sitemap.xml.ts`.
  * Integrated `/tools/retirement-distribution` into `CalculatorsHub.tsx` featured suites and `Footer.astro`.
* **Testing & Quality Assurance:**
  * Created unit test suite `src/utils/calculations/retirementDistributionPlanner.test.ts`.
  * Total repository test suite: **250 passed, 0 failed** (16 Lumpsum + 67 Children's Planner + 45 REAL Statement + 33 Life Insurance Need + 25 Home Purchase Planner + 32 Retirement Accumulation Planner + 32 Retirement Distribution Planner).
  * Production static compilation `npm run build`: **27 static routes compiled with 0 errors and 0 warnings**.
  * Puppeteer headless responsive audit: Verified **0px horizontal overflow, WCAG contrast, sample scenario execution, and 0 training branding** across all 5 viewports (`375×812`, `390×844`, `412×915`, `768×1024`, `1440×900`).

---

## NEXT SESSION — START HERE


> **ATTENTION NEXT AGENT / DEVELOPER:**  
> **Before writing any code or modifying any file, YOU MUST READ THIS FILE (`PROJECT_STATUS.md`) ENTIRELY.**

### Recommended Next Steps for the Next Session:

1. **Production Deployment Setup (Hosting & DNS):**
   - Connect GitHub repository `https://github.com/santhosh144awc/AntWealth_2026_08` to **Cloudflare Pages**, **Vercel**, or **Netlify**.
   - Build settings: Build command: `npm run build`, Output directory: `dist`.
   - Configure custom domain `https://antwealth.in` and verify SSL certificates.
2. **Analytics Integration:**
   - When provided by Santhosh, insert the Google Analytics 4 (GA4) measurement tag into `src/layouts/BaseLayout.astro`.
3. **Calendar Integration (Optional):**
   - If an automated calendar scheduling URL (e.g. Cal.com or Calendly) is provided, insert it into `siteConfig.contact.consultationBookingUrl` in `src/data/siteConfig.ts`.
