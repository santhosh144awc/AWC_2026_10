# Ant Wealth Creation — Project Status & Architecture Guide

**Current Version:** `v4.0.0 (Phase 17 — Financial Health Check v4.0 Methodology & UX Implementation)`  
**Current Date:** September 18, 2026  
**Repository Branch:** `main` | `AntWealth_2026_08`  
**Total Pages Compiled:** **33 Static Pages** (`npm run build` output)  
**Total Unit Tests:** **565+ Automated Unit Tests Across 12 Suites** (`npm test` all passing)  
**Automated QA Audit:** **100% Passing** (`src/utils/verification_audit.test.mjs`)  
**Automated Link Audit:** **100% Passing** (`src/utils/check_all_links.mjs` - 132/132 links valid)

> **Last Updated:** September 18, 2026  
> **Project Root:** `c:\WORK\Software\Antigravity\AWC_2026_08_23`  
> **Repository:** [https://github.com/santhosh144awc/AntWealth_2026_08](https://github.com/santhosh144awc/AntWealth_2026_08)  
> **Live Deployment:** [https://antwealth.vercel.app](https://antwealth.vercel.app)  
> **Target Production Domain:** [https://antwealth.in](https://antwealth.in)  
> **Status:** Phase 17 Complete • Financial Health Check v4.0 Complete Methodology and UX Implemented • Product-neutral 7-pillar architecture (Cash Flow 15%, Emergency Reserve 15%, Debt Management 15%, Protection 15%, Investing 15%, Goal Planning 10%, Retirement 15% = 100%) • Removed product bias and arbitrary multipliers • Replaced v3.x results view with 8-section "Your Financial Health Snapshot" • Dependency-aware recommendation engine prioritizing Foundation → Protection → Cash Flow → Planning → Long-Term Growth (capped at max 3 steps) • 130 unit tests in `financialHealth.test.ts` (100% pass) • 145 E2E checks in `test-health-check-results-qa.js` (100% pass) • 33/33 static pages building cleanly in 6.04s.






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
    │   │   ├── LoanSIPRecoveryPlanner.tsx    # 4-step Loan + SIP wealth recovery opportunity planner
    │   │   ├── HomeLoanForeclosurePlanner.tsx # Month-by-month parallel amortization & SIP foreclosure planner
    │   │   ├── SWPCalculator.tsx             # Monthly sequential SWP simulation with step-up & lump sum milestones
    │   │   ├── SIPGrowthPlanner.tsx          # Annual Step-Up SIP with effective monthly compounding & multi-lump sums
    │   │   ├── RetirementDistributionPlanner.tsx # Three-Bucket decumulation planner with Fisher real returns
    │   │   ├── RetirementAccumulationPlanner.tsx # Annuity-Due retirement corpus & 3-way SIP roadmap
    │   │   ├── HousePurchasePlannerCalculator.tsx # 4-step home purchase planner with property inflation & loan EMI
    │   │   ├── LifeInsuranceNeedCalculator.tsx # 5-step Life Insurance Need Analysis calculator
    │   │   ├── REALFinancialStatement.tsx    # 5-step REAL Financial Statement assessment & snapshot
    │   │   ├── ChildrenFuturePlanner.tsx     # Multi-goal Children's Future Planner with asset projection
    │   │   ├── CalculatorsHub.tsx            # Tabbed 5-in-1 calculator hub with URL query sync
    │   │   ├── SIPCalculator.tsx             # Quick Monthly SIP and Step-Up SIP calculator
    │   │   ├── LumpsumCalculator.tsx         # Dedicated one-time compounding calculator
    │   │   ├── GoalPlannerCalculator.tsx     # Inflation-adjusted milestone goal planner
    │   │   ├── LoanVsInvestmentCalculator.tsx # Prepayment vs mutual fund SIP simulator
    │   │   ├── InsuranceCalculator.tsx       # Income replacement human life value tool
    │   │   └── NetWorthCalculator.tsx        # Liquid/Fixed assets vs liabilities balance calculator
    │   ├── consultation/
    │   │   └── ConsultationBooking.tsx       # 4-step voluntary scheduler with direct WhatsApp bridge
    │   ├── health/
    │   │   ├── HealthCheckIntro.astro        # Financial Health Check introduction hero
    │   │   ├── HealthQuestionnaire.tsx       # 7-step weighted financial health diagnostic
    │   │   └── HealthScoreGauge.tsx          # SVG interactive radial gauge
    │   └── learning/
    │       ├── ArticleCard.astro             # Card item for educational articles
    │       ├── CategoryCard.astro            # Category selector card
    │       └── RelatedArticles.astro         # Related reading suggestions
    ├── content/
    │   ├── config.ts                         # Zod schema for article content collections
    │   └── articles/                         # 10 foundational financial guides (Markdown)
    ├── data/
    │   └── siteConfig.ts                     # Single source of truth for business data, phone, email, disclaimers
    ├── layouts/
    │   ├── BaseLayout.astro                  # Global layout with SEO meta tags & FinancialService JSON-LD
    │   └── ArticleLayout.astro               # Long-form article layout with Breadcrumbs & Article JSON-LD
    ├── pages/
    │   ├── index.astro                       # Homepage
    │   ├── plan.astro                        # Goal Discovery & Planning Hub
    │   ├── plan/
    │   │   └── children.astro                # Children's Future Planner (Multi-Goal Milestone Hub)
    │   ├── tools.astro                       # Calculators Toolbox (?calc= query support)
    │   ├── tools/
    │   │   ├── loan-sip-recovery.astro       # Loan + SIP Recovery Planner (/tools/loan-sip-recovery)
    │   │   ├── home-loan-foreclosure.astro   # Home Loan Foreclosure Planner (/tools/home-loan-foreclosure)
    │   │   ├── swp.astro                     # SWP Calculator (/tools/swp)
    │   │   ├── sip-growth.astro              # SIP Growth Planner (/tools/sip-growth)
    │   │   ├── retirement-distribution.astro # Retirement Distribution Planner (/tools/retirement-distribution)
    │   │   ├── retirement.astro              # Retirement Accumulation Planner (/tools/retirement)
    │   │   ├── home-purchase.astro           # Home Purchase Planner (/tools/home-purchase)
    │   │   └── life-insurance.astro          # Life Insurance Need Analysis (/tools/life-insurance)
    │   ├── health-check.astro                # 3-Minute Financial Health Check
    │   ├── health-check/
    │   │   └── real-statement.astro          # REAL Financial Statement Assessment
    │   ├── learn.astro                       # Financial Education Hub
    │   ├── learn/
    │   │   └── [...slug].astro               # Dynamic Article Template
    │   ├── about.astro                       # About Santhosh & AMFI MFD Disclosures
    │   ├── contact.astro                     # Contact, Office Address & Consultation Scheduler
    │   ├── disclaimer.astro                  # Regulatory, SEBI/AMFI Disclosures & Mutual Fund Risk Warnings
    │   ├── privacy.astro                     # Privacy Policy
    │   ├── terms.astro                       # Terms of Service
    │   ├── 404.astro                         # Custom 404 Error Page
    │   └── sitemap.xml.ts                    # Dynamic XML Sitemap (31 routes)
    └── utils/
        └── calculations/
            ├── loanSipRecoveryPlanner.ts     # Loan + SIP Recovery Planner Engine & Types
            ├── loanSipRecoveryPlanner.test.ts # 45 Unit Tests for Loan + SIP Recovery
            ├── homeLoanForeclosurePlanner.ts # Home Loan Foreclosure Engine & Types
            ├── homeLoanForeclosurePlanner.test.ts # 45 Unit Tests for Foreclosure Planner
            ├── swpCalculator.ts              # SWP Calculator Engine & Types
            ├── swpCalculator.test.ts         # 38 Unit Tests for SWP Calculator
            ├── sipGrowthPlanner.ts           # SIP Growth Planner Engine & Types
            ├── sipGrowthPlanner.test.ts      # 37 Unit Tests for SIP Growth Planner
            ├── retirementDistributionPlanner.ts # Retirement Distribution Engine & Types
            ├── retirementDistributionPlanner.test.ts # 32 Unit Tests for Retirement Distribution
            ├── retirementAccumulationPlanner.ts # Retirement Accumulation Engine & Types
            ├── retirementAccumulationPlanner.test.ts # 32 Unit Tests for Retirement Accumulation
            ├── housePurchasePlanner.ts       # Home Purchase Engine & Types
            ├── housePurchasePlanner.test.ts  # 25 Unit Tests for Home Purchase
            ├── lifeInsuranceNeed.ts          # Life Insurance Need Engine & Types
            ├── lifeInsuranceNeed.test.ts     # 33 Unit Tests for Life Insurance Need
            ├── realFinancialStatement.ts     # REAL Financial Statement Engine & Types
            ├── realFinancialStatement.test.ts # 45 Unit Tests for REAL Statement
            ├── childrenFuturePlanner.ts      # Children's Planner Engine & Types
            ├── lumpsum.ts                    # Lumpsum Engine
            ├── lumpsum.test.ts               # 16 Unit Tests for Lumpsum Engine
            ├── emergencyFund.ts              # Emergency Fund Engine
            ├── financialHealth.ts            # Financial Health Diagnostic Engine
            ├── goalPlanner.ts                # Milestone Goal Planner Engine
.ts   # Home Purchase Engine & Types
            ├── housePurchasePlanner.test.ts # 25 Unit Tests for Home Purchase
            ├── lifeInsuranceNeed.ts      # Life Insurance Need Engine & Types
            ├── lifeInsuranceNeed.test.ts # 33 Unit Tests for Life Insurance Need
            ├── realFinancialStatement.ts # REAL Financial Statement Engine & Types
            ├── realFinancialStatement.test.ts # 45 Unit Tests for REAL Statement
            ├── childrenFuturePlanner.ts  # Children's Planner Engine & Types
            ├── lumpsum.ts                # Lumpsum Engine
            ├── lumpsum.test.ts           # 16 Unit Tests for Lumpsum Engine
            ├── emergencyFund.ts          # Emergency Fund Engine
            ├── financialHealth.ts        # Financial Health Diagnostic Engine
            ├── goalPlanner.ts            # Milestone Goal Planner Engine
            ├── insurance.ts              # Quick Insurance HLV Engine
            ├── loanVsInvestment.ts       # Loan Prepay vs Investment Engine
            ├── netWorth.ts               # Net Worth Balance Engine
            ├── retirement.ts             # Quick Retirement Engine
            ├── sip.ts                    # Quick SIP Engine
            ├── swp.ts                    # Quick SWP Engine
            └── index.ts                  # Centralized Calculations Export Barrel
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

### Phase 20 — SIP Growth Planner (Annual Step-Up & Multi-Lump-Sum Methodology)
* **Pure TypeScript Calculation Engine (`src/utils/calculations/sipGrowthPlanner.ts`):**
  * **Effective Monthly Compounding Rate:** $i_{\text{monthly}} = (1 + r_{\text{annual}})^{1/12} - 1$.
  * **Annual Step-Up Progression & Duration Capping:**
    * $\text{Year } y \le \text{Step-Up Duration}$: $\text{MonthlySIP}_y = P_0 \times (1 + g)^{y-1}$.
    * $\text{Step-Up Duration} < y \le \text{SIP Duration}$: $\text{MonthlySIP}_y = P_0 \times (1 + g)^{\text{Step-Up Duration}-1}$.
    * $y > \text{SIP Duration}$: $\text{MonthlySIP}_y = 0$ (post-SIP compounding).
  * **Beginning-of-Month Annuity-Due Monthly Timing ($type = 1$):**
    $$\text{FV}_{\text{SIP}} = \text{MonthlySIP}_y \times \frac{(1 + i)^{12} - 1}{i} \times (1 + i)$$
  * **Year-End Closing Base & Lump-Sum Compounding:**
    $$\text{Base}_y = \text{OpeningCorpus}_y + \text{LumpSum}_y, \quad \text{ClosingCorpus}_y = \text{Base}_y \times (1 + r_{\text{annual}}) + \text{FV}_{\text{SIP}}$$
  * **Total Investments, Wealth Created & Growth Percentage:**
    $$\text{Total Invested} = \sum (\text{MonthlySIP}_y \times 12) + \sum \text{LumpSums}$$
    $$\text{Wealth Created} = \max(0, \text{FinalCorpus} - \text{Total Invested}), \quad \text{Growth \%} = \frac{\text{Wealth Created}}{\text{Total Invested}} \times 100$$
* **React 19 Island (`src/components/calculators/SIPGrowthPlanner.tsx`):**
  * 4-Step Guided Wizard: Starting Monthly SIP & Duration, Annual Step-Up % & Duration, Expected Return & Post-SIP Horizon, Dynamic Multi-Lump-Sum Investments (add/edit/delete).
  * Results Dashboard: Dark navy gradient hero card (`#00182A`), Growth Teal eyebrow, bold Deep Navy estimated corpus (`₹3.45 Cr`), 4-metric grid (Total Invested, Estimated Corpus, Wealth Created, Growth %), Invested vs Growth horizontal stacked bar, interactive responsive SVG growth area chart with hover/touch tooltips and milestone pins, milestone progression table (expandable to all years), compounding journey flow, "How was this calculated?" accordion, WhatsApp advisory consultation bridge, and "Try Sample Scenario" / "Reset" buttons.
* **Astro Page & Site Integration:**
  * Dedicated route `/tools/sip-growth` in `src/pages/tools/sip-growth.astro`.
  * Added `sip-growth` to `calculators` in `src/data/siteConfig.ts`.
  * Added `/tools/sip-growth` to XML sitemap in `src/pages/sitemap.xml.ts`.
  * Integrated `/tools/sip-growth` into `CalculatorsHub.tsx` featured suites and `Footer.astro`.
* **Testing & Quality Assurance:**
  * Created unit test suite `src/utils/calculations/sipGrowthPlanner.test.ts`.
  * Total repository test suite: **287 passed, 0 failed** (16 Lumpsum + 67 Children's Planner + 45 REAL Statement + 33 Life Insurance Need + 25 Home Purchase Planner + 32 Retirement Accumulation Planner + 32 Retirement Distribution Planner + 37 SIP Growth Planner).
  * Production static compilation `npm run build`: **28 static routes compiled with 0 errors and 0 warnings**.
  * Puppeteer headless responsive audit: Verified **0px horizontal overflow, WCAG contrast, sample scenario execution, and 0 training branding** across all 5 viewports (`375×812`, `390×844`, `412×915`, `768×1024`, `1440×900`).

---

### Phase 21 — SWP Calculator (Monthly Sequential Simulation & Step-Up Longevity)
* **Pure TypeScript Calculation Engine (`src/utils/calculations/swpCalculator.ts`):**
  * **Effective Monthly Compounding Rate:** $i_{\text{monthly}} = (1 + r_{\text{annual}})^{1/12} - 1$.
  * **Annual Step-Up Timing:** Planned monthly SWP increases every 12 months at Months 1, 13, 25, 37, 49... ($\text{plannedSWP} = P_0 \times (1 + g)^{\lfloor (m-1)/12 \rfloor}$).
  * **Beginning-of-Month Withdrawal & Safety Capping:**
    * $\text{actualSWP} = \min(\text{plannedSWP}, \text{beginningCorpus})$.
    * $\text{actualLumpSum} = \min(\text{scheduledLumpSum}, \max(0, \text{beginningCorpus} - \text{actualSWP}))$.
    * $\text{preReturnCorpus} = \text{beginningCorpus} - \text{actualSWP} - \text{actualLumpSum}$.
    * $\text{closingCorpus} = \max(0, \text{preReturnCorpus} \times (1 + i_{\text{monthly}}))$.
  * **Depletion & 600-Month Simulation:**
    * Automatically detects depletion month ($T_{\text{months}}$) and fractional longevity ($T_{\text{years}} = T_{\text{months}} / 12$).
    * Detects 50-year survival ($T_{\text{months}} = 600$) with surplus ending corpus.
  * **Deterministic Regression Scenarios:**
    * Scenario A (Candidates Benchmark): ₹20L corpus, ₹20k/mo, 8% return, 0% step-up $\to$ 159 months (13.25 years), ₹31.80 Lakh total withdrawals, ₹0 final corpus.
    * Scenario B (Trainers Benchmark): ₹1 Cr corpus, ₹50k/mo, 9% return, 6% step-up, ₹1L lump sum at Yrs 1–5 $\to$ 264 months (22.00 years), ₹2.65 Cr total withdrawals, ₹0 final corpus.
* **React 19 Island (`src/components/calculators/SWPCalculator.tsx`):**
  * 4-Step Guided Wizard: Retirement Corpus & Age, Monthly SWP Withdrawal, Return & Annual Step-Up, Dynamic Milestone Lump-Sum Withdrawals (add/edit/delete).
  * Results Dashboard: Dark navy gradient hero card (`#00182A`), Growth Teal eyebrow, bold Deep Navy duration (`22.0 Years` / `13.25 Years`), 4-metric grid (Starting Corpus, Total Withdrawals Delivered, SWP Duration, Remaining Corpus), interactive responsive SVG corpus depletion chart with hover/touch tooltips and milestone pins, milestone yearly progression table (expandable to all years), compounding journey flow, "How was this calculated?" accordion, WhatsApp advisory consultation bridge, and "Try Sample Scenario" / "Reset" buttons.
* **Astro Page & Site Integration:**
  * Dedicated route `/tools/swp` in `src/pages/tools/swp.astro`.
  * Updated `swp` entry in `calculators` in `src/data/siteConfig.ts`.
  * Added `/tools/swp` to XML sitemap in `src/pages/sitemap.xml.ts`.
  * Integrated `/tools/swp` into `CalculatorsHub.tsx` featured suites and `Footer.astro`.
* **Testing & Quality Assurance:**
  * Created unit test suite `src/utils/calculations/swpCalculator.test.ts`.
  * Total repository test suite: **325 passed, 0 failed** (16 Lumpsum + 67 Children's Planner + 45 REAL Statement + 33 Life Insurance Need + 25 Home Purchase Planner + 32 Retirement Accumulation Planner + 32 Retirement Distribution Planner + 37 SIP Growth Planner + 38 SWP Calculator).
  * Production static compilation `npm run build`: **29 static routes compiled with 0 errors and 0 warnings**.
  * Puppeteer headless responsive audit: Verified **0px horizontal overflow, WCAG contrast, sample scenario execution, and 0 training branding** across all 5 viewports (`375×812`, `390×844`, `412×915`, `768×1024`, `1440×900`).

---

### Phase 22 — Home Loan Foreclosure Planner (Parallel Amortization & SIP Accumulation)
* **Pure TypeScript Calculation Engine (`src/utils/calculations/homeLoanForeclosurePlanner.ts`):**
  * **Loan Amortization Model:** Standard monthly reducing balance loan amortization ($\text{EMI} = P \times \frac{i(1+i)^n}{(1+i)^n - 1}$), tracking opening principal, interest component ($P_m \times i_{\text{loan}}$), principal component ($\text{EMI} - \text{Interest}_m$), and closing loan balance across the full contractual loan tenure.
  * **Effective Monthly SIP Compounding Rate:** Mutual fund growth uses true geometric compounding: $i_{\text{SIP}} = (1 + r_{\text{annual}})^{1/12} - 1$ (e.g. $12\% \text{ p.a.} \to 0.94888\%/\text{month}$).
  * **Beginning-of-Period Annuity Due Timing:** $\text{ClosingCorpus}_m = (\text{OpeningCorpus}_m + \text{MonthlySIP}) \times (1 + i_{\text{SIP}})$.
  * **Option 1 (Target Earlier Closure Horizon):**
    * Calculates outstanding loan principal after target months $n$ ($P_n$).
    * Solves for required monthly Annuity Due: $\text{RequiredSIP} = \frac{P_n}{\frac{(1 + i_{\text{SIP}})^n - 1}{i_{\text{SIP}}} \times (1 + i_{\text{SIP}})}$.
  * **Option 2 (Fixed Affordable Monthly SIP Budget):**
    * Simulates 240+ monthly amortization and parallel SIP accumulation rows.
    * Identifies the earliest crossover month where $\text{ClosingSIPCorpus} \ge \text{ClosingPrincipal}$.
  * **Deterministic Regression Benchmarks:**
    * Baseline: ₹50L loan, 20-year tenure, 8% interest $\to$ EMI = ₹41,822.01/mo.
    * Option 1 (10-Yr Target @ 12% SIP return): Outstanding Principal = ₹34,47,030.56, Required Monthly SIP = ₹15,386.07/mo, Total SIP Investment = ₹18,46,328.21, SIP Wealth Created = ₹16,00,702.35.
    * Option 2 (Fixed SIP ₹10,000/mo @ 12%): Crossover at Month 142 (11.83 years / 11 yrs 10 mos), Loan Principal = ₹30,34,801.46, SIP Corpus = ₹30,03,402.64 $\to$ covered at Month 142.
* **React 19 Interactive Island (`src/components/calculators/HomeLoanForeclosurePlanner.tsx`):**
  * 4-Step Guided Wizard: Home Loan Details, SIP Return Assumptions, Choose Strategy (Option A vs Option B), Results Dashboard.
  * Results Dashboard: Dark navy hero card (`#00182A`), Growth Teal eyebrow, White primary result container, 4-Metric Grid (Monthly EMI, Outstanding Principal at Milestone, Projected SIP Corpus, Potential Surplus / Gap), interactive responsive SVG dual-curve crossover chart with **"★ Potential Loan Coverage Point"** badge and hover tooltips, visual investment journey track, collapsible milestone & full year-by-year table, responsible educational disclaimer, "How was this calculated?" accordion, "Scenario A" / "Scenario B" / "Reset" presets, and pre-populated WhatsApp consultation bridge.
* **Astro Page & Site Integration:**
  * Dedicated route `/tools/home-loan-foreclosure` in `src/pages/tools/home-loan-foreclosure.astro`.
  * Updated `home-loan-foreclosure` entry in `calculators` in `src/data/siteConfig.ts`.
  * Added `/tools/home-loan-foreclosure` to XML sitemap in `src/pages/sitemap.xml.ts`.
  * Integrated `/tools/home-loan-foreclosure` into `CalculatorsHub.tsx` featured suites and `Footer.astro`.
* **Testing & Quality Assurance:**
  * Created unit test suite `src/utils/calculations/homeLoanForeclosurePlanner.test.ts`.
  * Total repository test suite: **370 passed, 0 failed**.
  * Production static compilation `npm run build`: **30 static routes compiled with 0 errors and 0 warnings**.
  * Puppeteer headless responsive audit: Verified **0px horizontal overflow, WCAG contrast, sample scenario execution, and 0 training branding** across all 5 viewports.

---

### Phase 23 — Loan + SIP Recovery Planner (Wealth Creation Opportunity Alongside EMI)
* **Objective:** Build a consumer-facing, wealth-creation opportunity planner at `/tools/loan-sip-recovery` illustrating how parallel mutual fund SIP investing can potentially offset total loan interest or complete loan cost (Principal + Total Interest) over time without altering standard EMI payments.
* **Pure TypeScript Calculation Engine (`src/utils/calculations/loanSipRecoveryPlanner.ts`):**
  * **Reducing Balance Loan Amortization:** $\text{EMI} = P \times \frac{i(1+i)^n}{(1+i)^n - 1}$, $\text{TotalCost} = \text{EMI} \times n$, $\text{TotalInterest} = \text{TotalCost} - P$.
  * **Two Primary Recovery Targets:**
    * *Target 1 (Total Interest Offset):* $\text{Target}_{\text{interest}} = \text{TotalInterest}$.
    * *Target 2 (Complete Loan Cost Offset):* $\text{Target}_{\text{complete}} = P + \text{TotalInterest} = \text{TotalCost}$.
  * **Effective Monthly SIP Compounding:** $i_{\text{SIP}} = (1 + r_{\text{annual}})^{1/12} - 1$ (beginning-of-month Annuity Due timing).
  * **Required SIP Solvers:**
    * $\text{RequiredSIP}_{\text{target}} = \frac{\text{Target}}{\frac{(1 + i_{\text{SIP}})^n - 1}{i_{\text{SIP}}} \times (1 + i_{\text{SIP}})}$.
    * $\text{SIPPercentageOfEMI} = \frac{\text{RequiredSIP}}{\text{EMI}} \times 100$.
  * **Custom Monthly SIP Time-to-Recovery Simulation:**
    * Simulates month-by-month parallel accumulation to identify earliest months $m_{\text{interest}}$ and $m_{\text{complete}}$ where $\text{Corpus} \ge \text{Target}$.
    * Evaluates recovery vs loan tenure (Early, Late, Exact match, or Unreached within 50-year horizon).
  * **Adaptive Default Return Logic:**
    * Initial SIP duration = Loan tenure.
    * Duration $\le 10$ years $\to 10\%$ default return; Duration $> 10$ years $\to 12\%$ default return. User manual override (6%–18%) preserved.
  * **Deterministic Regression Benchmark:**
    * ₹50L loan @ 9% for 20 years $\to$ EMI = ₹44,986.30/mo, Total Interest = ₹57,96,712.44, Complete Cost = ₹1,07,96,712.44.
    * Over 20 years @ 12% return: Target 1 Required SIP = ₹6,301.60/mo (14.01% of EMI); Target 2 Required SIP = ₹11,737.09/mo (26.09% of EMI).
    * Custom SIP ₹9,000/mo (20.0% of EMI): Interest recovered in 17y 3m (Month 207); Complete cost recovered in 22y 2m (Month 266).
    * Custom SIP ₹15,000/mo (33.3% of EMI): Complete cost recovered early in 18y 2m (Month 218, 1y 10m early).
* **React 19 Interactive Island (`src/components/calculators/LoanSIPRecoveryPlanner.tsx`):**
  * 4-Step Guided Wizard: Step 1 (Your Loan Details with live EMI preview), Step 2 (Your SIP Recovery Targets with 2 visual cards and opportunity flow graphic), Step 3 (What can you invest every month? with % of EMI badge and adaptive return slider), Step 4 (Results Dashboard).
  * Results Dashboard: Dark navy hero card (`#00182A`), Growth Teal eyebrow (`#2DD4BF`), Primary result box, 4-Metric Grid, 2 Milestone summary boxes, Interactive responsive SVG dual-target & SIP growth chart with **"★ Potential Recovery Point"** markers and hover tooltips, visual horizontal milestones journey, mathematical breakdown accordion, "Sample Scenario" / "Accelerated Preset" / "Reset" buttons, and pre-populated WhatsApp consultation bridge.
* **Astro Page & Site Integration:**
  * Dedicated route `/tools/loan-sip-recovery` in `src/pages/tools/loan-sip-recovery.astro`.
  * Added `loan-sip-recovery` to `calculators` in `src/data/siteConfig.ts`.
  * Added `/tools/loan-sip-recovery` to XML sitemap in `src/pages/sitemap.xml.ts`.
  * Integrated `/tools/loan-sip-recovery` into `CalculatorsHub.tsx` featured suites and `Footer.astro`.
* **Testing & Quality Assurance:**
  * Created unit test suite `src/utils/calculations/loanSipRecoveryPlanner.test.ts` (45 passed, 0 failed).
  * Total repository test suite: **415+ passed, 0 failed** across 11 test suites.
  * Production static compilation `npm run build`: **31 static routes compiled in 3.61s with 0 errors and 0 warnings**.
  * Puppeteer headless responsive audit: Verified **0px horizontal overflow across all 5 viewports** (`375×812`, `390×844`, `412×915`, `768×1024`, `1440×900`), 0 console errors, and 0 prohibited training terms.

---

## 4. Phase 11 — Product Consistency, Calculator Integration & Full Functional QA

### Completed Objectives:
1. **Centralized Tool Registry (`src/data/toolsRegistry.ts` & `src/data/siteConfig.ts`):**
   * Created single source of truth `TOOLS_REGISTRY` with strongly typed metadata (`id`, `title`, `description`, `category`, `icon`, `route`, `queryParam`, `componentKey`, `visibility`, `homepageVisibility`, `primaryCTA`, `relatedArticles`).
   * Categorized strictly under **Build Wealth**, **Plan for Goals**, **Protect Your Family**, **Manage Your Money**.
   * Re-exported from `siteConfig.ts` to power homepage cards, navigation, and tools hub without duplicate metadata.
2. **Lumpsum Calculator as First-Class Tool & Deep Linking:**
   * Fully exposed at `/tools?calc=lumpsum` and connected to homepage, calculators hub, and learning articles.
   * Preserves mathematical calculations using `src/utils/calculations/lumpsum.ts`.
3. **Calculator Hub Deep Linking & Hydration Synchronization:**
   * Standardized query parameter handling in `CalculatorsHub.tsx` (`/tools?calc=sip`, `lumpsum`, `retirement`, `insurance`, `loan-vs-invest`, `net-worth`, `goal`).
   * Added `popstate` event listeners and `history.pushState` integration for seamless tab switching with browser back/forward buttons.
   * Eliminated React 19 hydration mismatch (#418) by initializing state with default SSR tree and synchronizing cleanly on client mount.
4. **Goal Planner Preset Synchronization:**
   * Synchronized `/plan?goal=home`, `education`, `retirement`, `wedding`, `car`, `wealth`, `custom` in `GoalPlannerCalculator.tsx`.
   * Added browser back/forward history navigation for presets and eliminated initial flash.
5. **Terminology & Compliance Standardization:**
   * Standardized to `"2-Minute Financial Health Check"` and `"Financial Health Check"` throughout the codebase.
   * Replaced definitive phrasing (*"exact monthly SIP"*) with responsible illustrative wording (*"Estimated monthly SIP requirement based on the assumptions entered"*).
   * Verified 0 positive claims of *"Guaranteed Returns"*, *"Assured Returns"*, *"Risk Free"*, *"SEBI Registered Advisor"*, or *"RIA"*.
   * Removed all internal training/proprietary references from source comments.
6. **Insurance Calculator Conceptual Experience:**
   * Implemented visual equation card in `InsuranceCalculator.tsx`:
     $$\text{Income Replacement} + \text{Debts} + \text{Goals} - \text{Cover} - \text{Assets} = \text{Estimated Protection Gap}$$
   * Labeled result as `"Estimated Protection Gap"` with standard non-guaranteed statutory disclaimers.
7. **Consultation 4-Step Alignment:**
   * Standardized step progression in `ConsultationBooking.tsx` to `Step 1 of 4` through `Step 4 of 4`.
   * Updated Step 4 status to `"Request Ready"`, heading to `"Consultation Request Ready!"`, and CTA to `"💬 Send Request on WhatsApp"`.
8. **Automated QA & Multi-Viewport Verification:**
   * Created `scratch/test-phase11-consistency-qa.js` test runner.
   * **32/32 End-to-End Tests Passed (100%)**:
     * 7/7 Calculator Hub deep links verified.
     * 7/7 Goal Planner presets verified.
     * Browser history (back/forward) verified.
     * 4-Step consultation flow verified.
     * 0px horizontal overflow verified across 7 viewports (`375×812`, `390×844`, `412×915`, `768×1024`, `1024×768`, `1440×900`, `1920×1080`).
     * 0 runtime JavaScript page errors.
    * All 11 calculation unit test suites passing (435+ assertions).
    * All 31 static pages building cleanly (`npm run build` in 4.64s).

---

## 5. Phase 12 — Production Readiness, Tool Visibility Audit & Live QA

### Key Findings & Architecture State:
1. **Complete 31-Route Inventory:**
   * **Core Public Lead-Generation (6 routes):** `/` (Home), `/plan` (Goal Planner), `/tools` (Calculator Hub), `/health-check` (2-Min Health Check), `/about` (Founder Trust), `/contact` (4-Step Consultation Scheduler).
   * **Knowledge Center (11 routes):** `/learn` (Knowledge Base) + 10 SEO Educational Articles (`/learn/what-is-a-mutual-fund`, `/learn/what-is-sip-and-how-does-it-work`, `/learn/sip-vs-lumpsum-what-is-the-difference`, `/learn/how-much-emergency-fund-should-you-have`, `/learn/what-is-asset-allocation`, `/learn/how-to-plan-for-your-childs-education`, `/learn/how-to-start-planning-for-retirement`, `/learn/why-life-insurance-is-important-for-a-family`, `/learn/what-is-financial-freedom`, `/learn/what-is-goal-based-financial-planning`).
   * **Specialized Deep-Dive Planning Suites (10 routes):** `/tools/loan-sip-recovery`, `/tools/home-loan-foreclosure`, `/tools/swp`, `/tools/sip-growth`, `/tools/retirement-distribution`, `/tools/retirement`, `/tools/home-purchase`, `/tools/life-insurance`, `/plan/children`, `/health-check/real-statement`.
   * **Legal & Regulatory (3 routes):** `/privacy`, `/terms`, `/disclaimer`.
   * **Utility (1 route):** `/404` (Custom Not Found).
   * **Feed:** `/sitemap.xml` (Automated XML sitemap).
2. **Tool Visibility Classification:**
   * **Group A (Public Lead-Gen Tools):** SIP, Lumpsum, Goal Planner, Retirement, Insurance Needs, Loan vs Investment, Net Worth, 2-Minute Health Check.
   * **Group B (Specialized Planning Suites):** Loan + SIP Recovery, Home Loan Foreclosure, SWP Longevity, SIP Growth, Retirement Distribution, Retirement Accumulation, Home Purchase, Life Insurance Need Analysis, Children's Future, REAL Statement.
   * **Group C (Internal / Dev Tools):** 0 routes exposed publicly.
3. **Compliance & Brand Language:**
   * 0 positive claims of *"Guaranteed Returns"*, *"Assured Returns"*, *"Risk Free"*, *"SEBI Registered Advisor"*, or *"RIA"*.
   * 0 proprietary/internal training references in code or UI comments.
4. **Testing & QA Verification:**
   * All 11 unit test suites passing (435+ assertions).
   * All 31 static pages building in 7.77s.
   * 32/32 End-to-End Puppeteer tests passing with 0 errors across 7 mobile and desktop viewports.

---

## 6. Phase 13 — Production Deployment Preparation & Live Business Validation

### Verification & Validation Highlights:
1. **Absolute Open Graph Production Metadata:**
   * Updated `og:image` and `twitter:image` in `src/layouts/BaseLayout.astro` to absolute production URL: `https://antwealth.in/assets/Visiting%20Card%20Front.png`.
   * Verified canonical URLs standardize across all pages to `https://antwealth.in`.
2. **Comprehensive Live Smoke Test (72/72 Passed):**
   * Script: `scratch/test-phase13-live-qa.js`.
   * All 31 static HTML routes + `/sitemap.xml` + `/robots.txt` returned HTTP 200.
   * All 7 public calculator tabs (`sip`, `lumpsum`, `retirement`, `insurance`, `loan-vs-invest`, `net-worth`, `goal`) verified for zero `NaN`, zero `Infinity`, zero `undefined`.
   * All 10 specialized planning suites verified for zero `NaN`, zero `Infinity`, zero `undefined`.
3. **End-to-End Consumer Journey Simulation:**
   * Validated 7-step consumer pathway:
     `Homepage` $\to$ `Health Check` $\to$ `Tools Hub` $\to$ `Goal Planner` $\to$ `Learning Center` $\to$ `Founder About` $\to$ `Consultation Scheduler`.
   * Consultation 4-step wizard verified from `Step 1 of 4` through `Step 4 of 4 • Request Ready`.
   * Generated WhatsApp bridge URL verified: targets AMFI distributor phone `+91 80879 71566`, includes visitor name, selected topic, and preferred date/time slot.
4. **Mobile Responsiveness Across Key Viewports:**
   * `375×812` (Mobile S / iPhone SE), `390×844` (Mobile M / iPhone 12/13/14), `412×915` (Mobile L / Pixel / Galaxy) verified with **0px horizontal overflow**.
5. **Freeze & Feature Lock:**
   * All calculation engines and UI layouts remain 100% frozen with zero scope creep.

---

## 7. Phase 14 — End-User Information Architecture & UX Redesign

### Information Architecture & Discovery Enhancements:
1. **Four-Tier Tool Hierarchy (`toolsRegistry.ts`):**
   * **Tier 1 (Start Here):** Financial Health Check, SIP Calculator, Lumpsum Calculator, Goal Planner, Life Insurance Need Calculator, Personal Net Worth Calculator.
   * **Tier 2 (Plan a Specific Goal):** Retirement Planner, Home Purchase Planner, Children's Future Planner, SIP Growth Planner.
   * **Tier 3 (Compare Financial Decisions):** Loan vs Investment, Loan + SIP Recovery Planner.
   * **Tier 4 (Advanced Planning Tools):** Home Loan Foreclosure Planner, SWP Longevity Calculator, Retirement Distribution Planner, Detailed Life Insurance Analysis, REAL Financial Statement.
2. **Homepage 4-Choice Entry Matrix:**
   * Replaced the large 10-tool grid with the 4-choice entry section (*"Start With What Matters to You"*):
     - **Check My Financial Health** (`/health-check`)
     - **Plan My Goal** (`/plan`)
     - **Grow My Money** (`/tools?calc=sip`)
     - **Protect My Family** (`/tools?calc=insurance`)
     - Subtle secondary link: *"Looking for a specific calculation? View All Calculators →"* (`/tools`).
     - Added 4-step first-time user guidance roadmap.
3. **Curated `/tools` Directory:**
   * Redesigned `/tools` into the 4 clear tiers with an interactive active calculation workspace stage.
   * Standardized tool names: *"Life Insurance Need Calculator"* (Tier 1 public tool) vs *"Detailed Life Insurance Analysis"* (Tier 4 advanced tool).
4. **Goal-First `/plan` Page:**
   * Hero: *"What are you planning for? / Choose a goal and we'll help you understand what it may take."*
   * Prominent visual goal cards for 7 presets with seamless query parameter synchronization (`?goal=home`, `?goal=education`, etc.).
5. **Standardized CTA Terminology:**
   * WhatsApp/direct contact: *"💬 Talk to Santhosh"* across all tools.
   * Consultation booking: *"Book a Free Consultation"* across all tools and wizards.
   * Replaced inconsistent phrases (*"Talk to Ant Wealth"*, *"Book a Goal Planning Session"*, etc.).
6. **Curated Footer Popular Tools:**
   * Replaced long uncurated tool dump with 6 popular tools + *"Explore Advanced Tools →"* (`/tools#advanced`).
7. **Comprehensive QA (78/78 Passed):**
   * All 31 static routes compile cleanly in 7.94s.
   * All 11 unit test suites (435+ assertions) pass 100%.
   * 0px horizontal overflow across all 7 screen resolutions (375 to 1920).
   * 0 runtime errors, 0 NaN, 0 Infinity, 0 undefined.

---

## 8. Phase 15A — Final End-User Simplification & Information Architecture Redesign

### Key Simplifications & Architecture Changes:
1. **Header & Navigation Streamlined (5 Essential Destinations):**
   * Primary Nav: `Home` (`/`), `Plan a Goal` (`/plan`), `Tools` (`/tools`), `Learn` (`/learn`), `About` (`/about`).
   * Primary Action Button: `Start Here` (`/health-check`).
   * Removed "Contact" from primary header nav (accessible through footer and consultation CTAs).

2. **Homepage Single-Track Journey (Zero Cognitive Overload):**
   * **Hero:** Clean headline *"Make Better Money Decisions. Build a Better Future."*, supporting text, `Start Here →` (`/health-check`) and `Explore Tools →` (`/tools`).
   * **Where Would You Like to Start? (Exactly 4 Cards):**
     1. *Understand My Finances* (`/health-check`, CTA: `Check My Financial Health →`)
     2. *Plan a Goal* (`/plan`, CTA: `Plan a Goal →`)
     3. *Grow My Money* (`/tools?calc=sip`, CTA: `Explore Investments →`)
     4. *Protect My Family* (`/tools?calc=insurance`, CTA: `Check Protection Need →`)
   * **Removed Duplication:** Removed redundant goal grids, 4-step "New to financial planning?" banners, and 17-tool catalog from homepage. Moved `<FinancialJourney />` (6-stage roadmap) to `/learn`.
   * **Trust & Meet Santhosh:** Clean credibility pillars + *"Need help understanding your numbers?"* consultation CTA.

3. **Dedicated Goal Planning Destination (`/plan`):**
   * Heading: *"What would you like to plan? / Choose a goal to get started."*
   * 7 goal presets with query parameters: `Buy a Home` (`?goal=home`), `Child's Education` (`?goal=education`), `Retirement` (`?goal=retirement`), `Build Long-Term Wealth` (`?goal=wealth`), `Wedding` (`?goal=wedding`), `Buy a Car` (`?goal=car`), `Something Else` (`?goal=custom`).

4. **Financial Planning Tools 4-Section Hierarchy (`/tools`):**
   * Title: *"Financial Planning Tools"* | Subtitle: *"Simple tools to understand your money, plan your goals and make better financial decisions."*
   * **Section 1: Start Here (Everyday Tools & Workspace):** Financial Health Check, SIP Calculator, Lumpsum Calculator, Goal Planner, Life Insurance Need Calculator, Net Worth Calculator.
   * **Section 2: Plan a Goal (Milestone Planners):** Retirement Planner, Home Purchase Planner, Children's Future Planner, SIP Growth Planner.
   * **Section 3: Compare a Decision (Trade-Offs):** Loan vs Investment, Loan + SIP Recovery Planner, Home Loan Foreclosure Planner.
   * **Section 4: Advanced Planning (Deeper Analysis, Visually Secondary):** SWP Longevity Calculator, Retirement Distribution Planner, Detailed Life Insurance Analysis, REAL Financial Statement.

5. **Action-Specific CTAs Across All 17 Tools:**
   * Replaced generic buttons with clear action CTAs: `Calculate My SIP →`, `Calculate Growth →`, `Plan This Goal →`, `Check My Protection Need →`, `Calculate My Net Worth →`, `Plan My Retirement →`, `Plan My Home Purchase →`, `Plan Child's Future →`, `Explore SIP Growth →`, `Compare My Options →`, `Plan Loan Recovery →`, `Plan Loan Foreclosure →`, `Plan Regular Withdrawals →`, `Plan Retirement Income →`, `Audit Protection Need →`, `View Financial Statement →`.

6. **Comprehensive Automated QA Verification:**
   * `npm test`: All 11 unit test suites (435+ unit tests) pass 100% (0 failures, 0 NaN, 0 Infinity).
   * `node src/utils/check_all_links.mjs`: All 138 internal links across 61 files audited and 100% valid.
   * `node src/utils/verification_audit.test.mjs`: All 107 source files audited with 0 prohibited jargon.
   * `npm run build`: All 31 static routes compile cleanly in 4.39s.

---

## 9. Phase 15B — Homepage Education Layer Restoration

### Restored Sections & Homepage Architecture:
1. **Clean 8-Stage Sequential Homepage Structure:**
   * **1. Hero:** Clear value proposition (*"Make Better Money Decisions. Build a Better Future."*) + `Start Here →` (`/health-check`) & `Explore Tools →` (`/tools`).
   * **2. Where would you like to start?:** Exactly 4 pathways (*Understand My Finances*, *Plan a Goal*, *Grow My Money*, *Protect My Family*).
   * **3. Check Your Financial Health (`HealthCheckTeaser.astro`):**
     - Explains *why* understanding financial health matters before making bigger decisions.
     - Covers the 6 key pillars: Savings, Emergency Fund, Protection, Investments, Goals, Retirement Readiness.
     - Includes sample score preview card and 1 clear CTA: `Check My Financial Health →` (`/health-check`).
   * **4. Your Financial Wellbeing Journey (`FinancialJourney.astro`):**
     - Visual horizontal progression on desktop, clean vertical flow on mobile.
     - 6 educational stages: *1. Starting Out*, *2. Building Stability*, *3. Growing Wealth*, *4. Protecting Family*, *5. Achieving Goals*, *6. Financial Freedom*.
     - Purely educational with zero competing calculator cards or buttons.
   * **5. Popular Tools (`PopularTools.astro`):**
     - Curated 4-tool showcase: SIP Calculator, Lumpsum Calculator, Loan vs Investment, Personal Net Worth Calculator.
     - Action link: `View All Tools →` (`/tools`).
   * **6. Why Families Choose Ant Wealth Creation (`TrustSection.astro`):**
     - 5 credibility pillars & regulatory AMFI MFD registration (ARN-266896).
   * **7. Meet Santhosh & Consultation (`MeetFounder.astro`):**
     - Personal guidance CTA: `Talk to Santhosh →` & `Book a Free Consultation →`.
   * **8. Footer (`Footer.astro`).**

2. **Automated QA & Link Verification:**
   * `npm test`: All 11 unit test suites (435+ unit tests) pass 100%.
   * `node src/utils/check_all_links.mjs`: All 139 internal links across 62 files audited and 100% valid.
   * `node src/utils/verification_audit.test.mjs`: All 108 source files audited with 0 prohibited jargon.
   * `npm run build`: All 31 static routes compile cleanly in 5.33s.

---

## 10. Phase 15C — Homepage Content Reordering, Learn Hub & Testimonial Placeholders

### Key Architecture & UX Implementations:
1. **Homepage Final 8-Stage Storyflow:**
   * **1. Hero:** *"Make Better Money Decisions. Build a Better Future."* + `Start Here →` (`/health-check`) & `Explore Tools →` (`/tools`).
   * **2. Check Your Financial Health (`HealthCheckTeaser.astro`):** 6 key pillars (Savings, Emergency Fund, Protection, Investments, Goals, Retirement) + Sample Score Gauge preview.
   * **3. Your Financial Wellbeing Journey (`FinancialJourney.astro`):** 6-Stage educational progression ($1 \rightarrow 2 \rightarrow 3 \rightarrow 4 \rightarrow 5 \rightarrow 6$).
   * **4. Where Would You Like to Start? (`CalculatorCards.astro`):** Exactly 4 canonical pathways (*Understand My Finances*, *Plan a Goal*, *Grow My Money*, *Protect My Family*).
   * **5. Learn About Money (`LearningSection.astro`):** Top 6 latest/featured articles dynamically queried from Astro content collection with `Explore All Guides →` (`/learn`).
   * **6. What Our Clients Say (`TestimonialsSection.astro`):** Reusable `Testimonial` data structure with neutral placeholder avatars and explicit `TODO` markers.
   * **7. Why Families Choose Ant Wealth Creation (`TrustSection.astro`):** 5 verified credibility pillars.
   * **8. Need Help Understanding Your Numbers? (`MeetFounder.astro`):** Direct WhatsApp bridge & Free Consultation scheduler.
   * **9. Footer (`Footer.astro`).**
2. **Popular Tools Removed from Homepage:**
   * Popular Tools 4-card preview grid completely removed from the homepage, leaving `/tools` as the dedicated calculator hub.
3. **Dynamic Weekly Article System & Enhanced Learn Hub (`/learn`):**
   * Flexible category validation in `src/content/config.ts`.
   * Interactive "Browse by Topic" filter chips (`Money Basics`, `Saving`, `Investing`, `Protection`, `Goals`, `Loans`, `Retirement`).
   * Added 2 new problem-oriented educational guides (`should-you-repay-your-loan-or-invest.md`, `how-much-should-you-save-for-a-future-goal.md`). Total 12 curated articles.

---

## 11. Phase 16A — Header Visual Alignment with Existing AWC Website

### Key Visual Refinements:
1. **Prominent Brand Logo:**
   * Desktop logo displayed height increased to `62px` (from `52px`) with `width: auto` and `object-fit: contain`, matching the visual branding weight of `antwealth.themfbox.com`.
2. **Header Height & Breathing Room:**
   * Header height adjusted to `90px` desktop (`--nav-height: 90px`) with vertical centering for logo, navigation links, and action CTA.
3. **Portfolio Login Action Button:**
   * Replaced header CTA button with **"Portfolio Login"** pointing to `https://antwealth.themfbox.com/` (`target="_blank" rel="noopener noreferrer"`).
   * Available on both desktop header and mobile slide drawer.
4. **Preserved Simplified Navigation:**
   * Maintained the 5 essential links (`Home`, `Plan a Goal`, `Tools`, `Learn`, `About`) with zero old-site menu clutter.

---

## 12. Phase 15D — Simplified Insurance Tool Restored in Financial Planning Tools

### Root Cause & Resolution:
1. **Bug Identification:**
   * Inside `InsuranceCalculator.tsx` line 284, the WhatsApp consultation template referenced `result.annualLivingExpenses.toLocaleString('en-IN')`.
   * Because `InsuranceResult` returns `annualIncome` (not `annualLivingExpenses`), this threw an uncaught runtime `TypeError` when mounting the tab, causing the React island to crash and display an empty workspace without the result panel.
2. **Resolution & Fix:**
   * Corrected property access to `result.annualIncome.toLocaleString('en-IN')`.
   * Restored full interactive input panel and right-hand side Estimated Protection Gap result panel + equation breakdown.
3. **Two Distinct Insurance Tools Preserved:**
   * **Tool A (Simplified Workspace Tool):** `/tools?calc=insurance` — Quick protection gap calculation based on income replacement, debts, goals, and existing cushion.
   * **Tool B (Detailed 5-Step Model):** `/tools/life-insurance` — Standalone 5-step detailed protection audit.

---

## 13. Phase 16B — Homepage Learn Section Single Horizontal Row Shelf & Responsive QA (Completed)

* **Objective:** Redesign the *Learn About Money* section on the homepage (`src/components/LearningSection.astro`) so that the 6 featured articles are presented as a single horizontal learning shelf on desktop (instead of a 3×2 grid), while preserving contained touch-friendly swipeable shelf behavior on mobile and tablet with 0px horizontal page overflow.
* **Layout & Visual Architecture:**
  * **Desktop (≥ 1200px / 1440px / 1920px):** Single horizontal row layout (`grid-template-columns: repeat(6, minmax(0, 1fr))`, `gap: 0.875rem`, `max-width: 1380px`). Cards have equal visual height with flex layout (`height: 100%`, `min-height: 310px`).
  * **Line Clamping & Compact Card Design:**
    * Article title: 3-line clamp (`-webkit-line-clamp: 3`) with `font-size: 0.95rem` and bold font weight.
    * Article description: 3-line clamp (`-webkit-line-clamp: 3`) with `font-size: 0.8125rem` and `#64748B` slate text.
    * Category pill & reading time: Category badge styled in Growth Teal (`rgba(0, 171, 150, 0.08)`) with `max-width: 65%` truncation safety for long category names, paired with subtle `5 min read` time.
    * Card footer: Published date and `Read Article →` CTA with meaningful `aria-label` and $\ge 44\text{px}$ touch target.
  * **Tablet & Mobile Contained Swipeable Shelf (< 1200px):**
    * Horizontal shelf container (`.learning-shelf-wrapper`) with `overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none`.
    * Mobile bleed layout with edge padding, displaying 1 card + partial next card (`flex: 0 0 78vw; min-width: 250px; max-width: 300px`) at $< 480\text{px}$.
    * Contained inside section with strictly **0px horizontal page-level overflow**.
  * **Dynamic Astro Article Collections Preserved:**
    * Automatically queries `getCollection('articles', ({ data }) => !data.draft)`, sorts featured first and latest publish date, taking the top 6.
    * New weekly `.md` articles added to `src/content/articles/` automatically appear on the homepage.
    * Full article directory remains at `/learn` with `Explore All Guides →` CTA button.
* **Automated QA & Multi-Viewport Verification:**
  * Created `scratch/test-learn-section-qa.js` testing 7 viewports (`375×812`, `390×844`, `412×915`, `768×1024`, `1024×768`, `1440×900`, `1920×1080`).
  * **60/60 QA checks passed (100%)**:
    * 0px page overflow verified across all 7 resolutions.
    * All 6 cards verified in a single horizontal row on desktop.
    * All 6 cards verified for equal visual height (0px height difference).
    * Contained swipeable shelf verified on tablet and mobile.
    * All links (`/learn`, `/learn/[slug]`) and aria-labels verified.
  * Unit tests: **435+ unit tests passing (100%)** (`npm test`).
  * Link audit: **133/133 links valid (100%)** (`node src/utils/check_all_links.mjs`).
  * Production compilation: **33/33 static routes compiling cleanly in 3.75s** (`npm run build`).

---

## 14. Phase 16C — Homepage Financial Wellbeing Journey Interactive Stepper (Completed)

* **Objective:** Upgrade the *Your Financial Wellbeing Journey* section on the homepage (`src/components/FinancialJourney.astro`) from a static timeline into an interactive stepper with a dynamic detail panel answering *"Where am I financially, what should I focus on, and what could I do next?"* for Indian families without feeling like an application dashboard.
* **Layout & Visual Architecture:**
  * **Structured Data Model (`src/data/financialJourney.ts`):** Centralized strongly-typed model `FINANCIAL_JOURNEY_STAGES` detailing all 6 stages:
    1. *Starting Out:* First salary / first investment $\to$ Cash flow, emergency buffer, protection, regular investing $\to$ CTA: `Check My Financial Health →` (`/health-check`).
    2. *Building Stability:* Emergency fund + insurance $\to$ Emergency buffer, essential insurance, debt control, monthly surplus $\to$ CTA: `Check My Financial Health →` (`/health-check`).
    3. *Growing Wealth:* SIP + long-term investments $\to$ Regular investing, compounding, horizon matching, asset allocation $\to$ CTA: `Explore Investment Tools →` (`/tools?calc=sip`).
    4. *Protecting Family:* Life + health protection $\to$ Life insurance needs, health cover, liabilities, goal protection $\to$ CTA: `Check Protection Need →` (`/tools?calc=insurance`).
    5. *Achieving Goals:* Education + home + major goals $\to$ Goal identification, cost estimation, inflation factoring, investment plan $\to$ CTA: `Plan a Goal →` (`/plan`).
    6. *Financial Freedom:* Retirement + passive income $\to$ Retirement readiness, future income needs, SWP withdrawal planning, periodic review $\to$ CTA: `Plan for Retirement →` (`/tools?calc=retirement`).
  * **Desktop Stepper (≥ 1024px):** 6 horizontal stage buttons linked by an underlying gradient connecting line. Active stage highlighted with dark navy circular badge (`#00182A`), Growth Teal ring (`#00AB96`), and teal title text.
  * **Tablet & Mobile Contained Swipeable Shelf (< 1024px):** Horizontal swipeable stage track with scroll-snap and peek affordance, strictly contained with 0px horizontal page overflow.
  * **Dynamic Detail Panel:** Clean white surface card (`#FFFFFF`, border `#E2E8F0`, rounded corners `16px`) presenting:
    - Stage badge (`Stage N of 6`) and subtitle.
    - Introductory educational text.
    - `What to focus on` checklist with 4 green checkmark items.
    - Helpful callout tip box (`💡 Tip: ...`).
    - Exactly 1 contextual action CTA button with $\ge 48\text{px}$ touch target.
  * **Accessibility & Performance:**
    - Full WAI-ARIA tab pattern (`role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, `aria-labelledby`).
    - Full keyboard arrow key navigation (ArrowLeft, ArrowRight, Home, End).
    - Reduced motion compliant (`prefers-reduced-motion: reduce`).
    - Lightweight vanilla client script without third-party runtime overhead.
* **Automated QA & Multi-Viewport Verification:**
  * Created `scratch/test-financial-journey-interactive-qa.js` testing all 6 stage transitions, click interactions, keyboard navigation, CTA routing, and 7 viewports (`375×812`, `390×844`, `412×915`, `768×1024`, `1024×768`, `1440×900`, `1920×1080`).
  * **93/93 QA checks passed (100%)** with 0 browser console errors.
  * Unit tests: **435+ unit tests passing (100%)** (`npm test`).
  * Link audit: **133/133 links valid (100%)** (`node src/utils/check_all_links.mjs`).
  * Compliance audit: **113 source files audited — 100% compliant** (`node src/utils/verification_audit.test.mjs`).
  * Production compilation: **33/33 static routes compiling cleanly in 3.78s** (`npm run build`).

---

## 15. Phase 16D — Financial Wellbeing Journey UX Simplification (Completed)

* **Objective:** Redesign the *Your Financial Wellbeing Journey* section on the homepage (`src/components/FinancialJourney.astro`) into a pure educational experience, eliminating workspace/calculator feel and removing all action CTAs.
* **Layout & Visual Architecture:**
  * **2-Column Desktop Grid (≥ 1024px):**
    - **Left Column (Navigation, 360px):** Vertical stack of the 6 selectable stage buttons. Active stage features dark navy badge (`#00182A`), Growth Teal ring (`#00AB96`), teal title text, light teal background (`rgba(0, 171, 150, 0.04)`), and right arrow icon.
    - **Right Column (Educational Detail Card):** Clean white card (`#FFFFFF`, border `#E2E8F0`, rounded `16px`, soft shadow) displaying:
      - Small stage badge (`Stage N of 6`) and subtitle.
      - Short educational introduction paragraph.
      - `What to focus on` section with 4 green checkmark items.
      - Educational takeaway tip box (`💡 Simple takeaway: ...`).
  * **Strict Pure Information Rule (Zero CTAs):**
    - Removed all action buttons (`Check My Financial Health`, `Explore Investment Tools`, `Plan a Goal`, `Plan for Retirement`, `Book a Consultation`).
    - The section functions solely to educate families on where they are and what to focus on.
  * **Tablet & Mobile Contained Swipeable Shelf (< 1024px):**
    - Horizontal swipeable stage track with scroll-snap and peek affordance.
    - Educational information panel displayed directly underneath.
    - Strictly 0px horizontal page overflow.
  * **Full Accessibility & Keyboard Navigation:**
    - Full WAI-ARIA tab semantics (`role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, `aria-labelledby`).
    - Supports `ArrowDown`, `ArrowUp`, `ArrowRight`, `ArrowLeft`, `Home`, `End`.
    - Reduced motion compliant (`prefers-reduced-motion: reduce`).
* **Automated QA & Multi-Viewport Verification:**
  * Created `scratch/test-financial-journey-simple-qa.js` auditing all 6 stage interactions, zero CTA presence, keyboard navigation, and 7 viewports (`375×812`, `390×844`, `412×915`, `768×1024`, `1024×768`, `1440×900`, `1920×1080`).
  * **80/80 QA checks passed (100%)** with 0 browser console errors.
  * Unit tests: **435+ unit tests passing (100%)** (`npm test`).
  * Link audit: **133/133 links valid (100%)** (`node src/utils/check_all_links.mjs`).
  * Compliance audit: **113 source files audited — 100% compliant** (`node src/utils/verification_audit.test.mjs`).
  * Production compilation: **33/33 static routes compiling cleanly in 4.50s** (`npm run build`).

---

## 16. Phase 16E — Horizontal 1–6 Financial Wellbeing Journey Stepper & 2-Column Educational Info Panel (Completed)

* **Objective:** Redesign the *Your Financial Wellbeing Journey* section on the homepage (`src/components/FinancialJourney.astro`) into the preferred horizontal 1–6 stepper with connecting track line, paired with a centered 2-column educational information card underneath, with strictly zero CTAs/action buttons.
* **Layout & Visual Architecture:**
  * **Primary Horizontal Stepper Track (1 → 6):**
    - Horizontal arrangement across the container width: `①────────②────────③────────④────────⑤────────⑥`.
    - Underlying linear-gradient connecting line (`height: 3px`, z-index: 1) positioned behind the numbered stage circles.
    - Numbered circles (`width: 48px`, `height: 48px`, font-size: `1.125rem`, font-weight: `800`) with stage title and short subtitle underneath.
    - **Active Stage:** Dark navy badge (`#00182A`), Growth Teal outer ring (`#00AB96`), teal title text, bold weight, elevated scale/shadow.
    - **Inactive Stage:** Crisp white circle, navy/dark number, slate title, muted subtitle, smooth hover effect (`transform: translateY(-2px)`).
  * **Two-Column Educational Information Card (Below Stepper):**
    - Centered card (`max-width: 980px`, background `#FFFFFF`, border `#E2E8F0`, rounded `16px`, subtle shadow).
    - **Left Column:** Stage pill badge (`Stage N of 6`), large stage title (`Outfit`, `1.75rem`), stage subtitle (`#64748B`), and educational overview paragraph.
    - **Right Column:** `WHAT TO FOCUS ON` section with 4 checkmark items, subtle divider, and `💡 SIMPLE TAKEAWAY` tip box.
  * **Strict Zero-CTA / Pure Information Guarantee:**
    - Zero action buttons or links inside the section. The section functions purely to answer *"Where am I in my financial journey?"* and *"What should I focus on?"*.
  * **Mobile & Tablet Contained Stepper (< 768px):**
    - Contained horizontal scroll track with smooth scroll-snap and peek affordance.
    - Information panel displayed underneath as a single-column educational card.
    - Strictly 0px horizontal page-level overflow.
  * **Full Accessibility & Keyboard Navigation:**
    - Full WAI-ARIA tab semantics (`role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, `aria-labelledby`).
    - Supports `ArrowRight`, `ArrowLeft`, `ArrowDown`, `ArrowUp`, `Home`, `End`.
    - Reduced motion compliant (`prefers-reduced-motion: reduce`).
* **Automated QA & Multi-Viewport Verification:**
  * Created `scratch/test-financial-journey-interactive-qa.js` testing all 27 requirements across 7 viewports (`375×812`, `390×844`, `412×915`, `768×1024`, `1024×768`, `1440×900`, `1920×1080`).
  * **87/87 QA checks passed (100%)** with 0 browser console errors.
  * Unit tests: **435+ unit tests passing (100%)** (`npm test`).
  * Link audit: **133/133 links valid (100%)** (`node src/utils/check_all_links.mjs`).
  * Compliance audit: **113 source files audited — 100% compliant** (`node src/utils/verification_audit.test.mjs`).
  * Production compilation: **33/33 static routes compiling cleanly in 7.65s** (`npm run build`).

---

## 18. Phase 16F — Financial Wellbeing Journey Hover Preview, Click-to-Pin & Smooth Hide (Completed)

* **Objective:** Upgrade the *Your Financial Wellbeing Journey* section on the homepage (`src/components/FinancialJourney.astro`) to support intuitive mouse hover preview (revealing the stage information immediately on hover and smoothly hiding on mouse leave), click-to-pin locking (keeping the stage open when clicked so users can comfortably read or move mouse away), a 150ms graceful cursor exit buffer, and a silky 400ms cubic-bezier hide transition without abrupt cutoffs.

---

## 19. Phase 16G — Homepage Learn Section 4-Card Spacious Showcase (Completed)

* **Objective:** Refine the *Learn About Money* section on the homepage (`src/components/LearningSection.astro`) by replacing the cramped 6-card row with a curated 4-card showcase, giving each card generous reading width, eliminating harsh category badge truncation (e.g. `PERSONAL FINANCE`, `GOAL PLANNING`), providing comfortable typography, and optimizing responsive layouts across all devices.
* **Layout & Visual Architecture:**
  * **Curated Top 4 Articles (`displayArticles = articles.slice(0, 4)`):** Queries featured articles first, then sorted by most recent publication date descending. Full library remains accessible at `/learn` via `Explore All Guides →`.
  * **Desktop (≥ 1100px):** 4 spacious columns in a single row (`grid-template-columns: repeat(4, minmax(0, 1fr))`, `gap: 1.25rem`, container max-width `1240px`). Each card has `285px+` width with generous `1.5rem 1.35rem` padding.
  * **Category Badges & Typography:** Full category badge text displayed clearly (`font-size: 0.725rem`, `font-weight: 700`, `letter-spacing: 0.04em`, `padding: 0.25rem 0.55rem`) with zero ellipses or clipping. Article titles styled with bold `1.075rem` font and descriptions with comfortable `1.5` line height.
  * **Tablet (641px to 1099px):** Responsive 2x2 grid (`grid-template-columns: repeat(2, minmax(0, 1fr))`) giving `350px–480px` width per card for exceptional tablet readability.
  * **Mobile (< 640px):** Contained swipeable shelf (`flex: 0 0 82vw; max-width: 320px`) with scroll-snap and peek affordance, strictly preserving **0px horizontal page overflow**.
* **Automated QA & Multi-Viewport Verification:**
  * Updated `scratch/test-learn-section-qa.js` testing 4-card layout, desktop row alignment, tablet 2x2 grid, mobile swipe shelf, and 7 viewports (`375×812`, `390×844`, `412×915`, `768×1024`, `1024×768`, `1440×900`, `1920×1080`).
  * **60/60 QA checks passed (100%)** with 0 browser console errors.
  * Unit tests: **435+ unit tests passing (100%)** across 11 test suites (`npm test`).
  * Link audit: **133/133 links valid (100%)** (`node src/utils/check_all_links.mjs`).
  * Compliance audit: **113 source files audited — 100% compliant** (`node src/utils/verification_audit.test.mjs`).
  * Production compilation: **33/33 static routes compiling cleanly in 7.48s** (`npm run build`).
* **Key Visual & Interaction Enhancements:**
  1. **Hover to Preview:**
     - Moving the mouse over any stage circle (1–6) instantly and smoothly expands the disclosure panel underneath.
     - Hovering from one circle to another smoothly crossfades the detail content without closing/reopening.
  2. **150ms Graceful Exit Buffer:**
     - Moving the cursor off a circle initiates a 150ms grace period. If the user moves downward into the detail card to read the checklist or takeaway, the panel stays open seamlessly.
  3. **Click to Pin / Lock Open:**
     - Clicking any stage number locks/pins that stage open (`is-pinned`), so moving the mouse away anywhere on the page leaves the panel open.
     - Clicking the pinned stage again unpins and smoothly closes it.
  4. **Silky 400ms Cubic-Bezier Hide Transition:**
     - Solved the abrupt cut-out issue by eliminating instant `display: none` removal during exit animations.
     - The disclosure wrapper smoothly collapses with fluid cubic-bezier easing (`cubic-bezier(0.25, 1, 0.5, 1)` ~400ms) with gentle upward slide (`translateY(0) → translateY(-8px)`) and opacity fade-out before cleaning up layout state.
  5. **Mobile & Touchscreen Friendly:**
     - Smartphones and tablets use tap-to-pin / tap-again-to-unpin, preserving optimal usability with zero hover glitches.
  6. **Accessibility & Keyboard Navigation:**
     - Preserved WAI-ARIA tab semantics (`role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-expanded`, `aria-controls`, `aria-labelledby`, `aria-hidden`).
     - Full keyboard navigation: `ArrowRight` / `ArrowDown` (next stage), `ArrowLeft` / `ArrowUp` (prev stage), `Home` (Stage 1), `End` (Stage 6), `Enter` / `Space` (toggles pinned state).
     - Reduced motion compliant (`prefers-reduced-motion: reduce`).
* **Automated QA & Multi-Viewport Verification:**
  * Created `scratch/test-financial-journey-interaction-qa.js` testing initial hidden state, hover preview, mouse-leave exit buffer, click-to-pin, unpin toggle close, keyboard navigation, zero-CTA audit, and 7 viewports (`375×812`, `390×844`, `412×915`, `768×1024`, `1024×768`, `1440×900`, `1920×1080`).
  * **62/62 QA checks passed (100%)** with 0 browser console errors.
  * Unit tests: **435+ unit tests passing (100%)** across 11 test suites (`npm test`).
  * Link audit: **133/133 links valid (100%)** (`node src/utils/check_all_links.mjs`).
  * Compliance audit: **113 source files audited — 100% compliant** (`node src/utils/verification_audit.test.mjs`).
  * Production compilation: **33/33 static routes compiling cleanly in 8.23s** (`npm run build`).

---

## 20. Phase 16H — Financial Health Check "Calculate My Score" Transition Bug Fix (Completed)

* **Objective:** Fix production QA bug on `/health-check` where clicking "Calculate My Score →" on Step 7 of 7 failed to display the Financial Health Score / Results diagnostic screen.
* **Root Cause Analysis:**
  * In `src/components/health/HealthQuestionnaire.tsx` on line 206 (WhatsApp message URL generator in results CTA), the code evaluated `result.actionRecommendations[0]?.title`.
  * The calculation result interface `HealthCheckResult` (in `src/utils/calculations/financialHealth.ts`) provides `nextSteps: string[]` and `needsAttention: string[]`, but has no `actionRecommendations` property (evaluating to `undefined`).
  * Evaluating `[0]` on `undefined` threw an uncaught runtime `TypeError: Cannot read properties of undefined (reading '0')` during React component rendering immediately upon setting `isCompleted = true` and `result`.
  * This uncaught error caused the React 19 island to unmount/crash, preventing the results view (`.health-result-wrapper`) from rendering on screen.
* **Exact Fix Implemented:**
  1. Updated `src/components/health/HealthQuestionnaire.tsx`:
     - Replaced `result.actionRecommendations[0]?.title` with safe optional fallback `result.nextSteps?.[0] || result.needsAttention?.[0] || 'Review Plan'`.
     - In `handleNext()`, ensured `allAnswers` explicitly merges `[currentQuestion.id]: currentAnswer` to guarantee the final question is included regardless of React event batching.
     - Added safe guard `typeof window !== 'undefined'` for `window.scrollTo`.
  2. Added dedicated pure calculation unit test suite:
     - Created `src/utils/calculations/financialHealth.test.ts` covering question structure, worst-case scores (Scenario A), best-case scores (Scenario B), mixed realistic profile (Scenario C), and boundary fallback safety (55 passed, 0 failed).
     - Integrated `financialHealth.test.ts` into `package.json`'s `npm test` runner. Total test suites increased to 12 (490+ unit tests).
  3. Created end-to-end regression test suite:
     - Created `scratch/test-health-check-results-qa.js` using headless Chrome via Puppeteer.
     - Tests all 7 question transitions, button enabled states, "Calculate My Score →" click transition, score counter animation, finite numeric score, zero "undefined" / "NaN" / "Infinity", category breakdown cards, strengths & attention cards, WhatsApp message formatting, and retake functionality back to Step 1.
     - Audited 3 answer scenarios (Scenario A: first option all, Scenario B: last option all, Scenario C: mixed answers) and 6 viewports (`375×812`, `390×844`, `412×915`, `768×1024`, `1024×768`, `1440×900`).
     - **148/148 QA checks passed (100%)** with strictly 0 browser console errors and 0px horizontal page overflow.
* **Verification & Audit Results:**
  * `npm test`: **12/12 test suites passing (490+ unit tests, 100%)**.
  * `scratch/test-health-check-results-qa.js`: **148/148 checks passing (100%)**.
  * `node src/utils/check_all_links.mjs`: **133/133 internal links valid (100%)**.
  * `node src/utils/verification_audit.test.mjs`: **114 source files audited — 100% compliant**.
  * `npm run build`: **33/33 static routes compiling cleanly in 8.40s**.

---

## 21. Phase 17 — Financial Health Check v4.0 Methodology & UX Implementation (Completed)

* **Objective:** Implement the complete Financial Health Check v4.0 methodology, scoring architecture, and user experience on `/health-check`, replacing outdated v3.x assumptions with a product-neutral, dependency-aware, and educational diagnostic snapshot.
* **Methodology Changes Implemented:**
  1. **7-Pillar Architecture & Weights Totaling 100%:**
     - Cash Flow & Saving: `15%`
     - Emergency Reserve: `15%`
     - Debt Management: `15%`
     - Protection: `15%`
     - Investing: `15%`
     - Goal Planning: `10%`
     - Retirement: `15%`
  2. **Eliminated Product Bias & Arbitrary Rules:**
     - Removed automatic bias toward mutual funds/SIPs over FDs/PPF/gold.
     - Removed the universal "15–20x annual income" insurance multiplier from scoring; protection is evaluated on family dependants, liabilities, and income interruption needs.
     - Evaluated debt by repayment comfort and high-cost revolving debt pressure, not solely EMI-to-income percentages.
     - Avoided exaggerated safety terms ("rock-solid", "bulletproof", "guaranteed").
     - Lowest possible score mathematically is `22` (weighted combination of lowest options: $20 \times 0.15 \times 4 + 30 \times 0.15 + 25 \times 0.10 + 20 \times 0.15 = 22$).
     - Highest possible score is `100`.
  3. **Score Communication Bands:**
     - `80 – 100`: **Strong Foundation**
     - `65 – 79`: **Generally Healthy**
     - `50 – 64`: **Needs Strengthening**
     - `0 – 49`: **Priority Areas Identified**
  4. **Pillar Status via Centralized Function (`getPillarStatus`):**
     - `score >= 80` $\to$ `'strong'` (`Strong`)
     - `score >= 50` $\to$ `'building'` (`Building`)
     - `< 50` $\to$ `'attention'` (`Needs Attention`)
  5. **Insight Categorization:**
     - Key Strengths: Pillars with score $\ge 80$.
     - Areas to Strengthen: Pillars with $50 \le \text{score} < 80$.
     - Priority Areas: Pillars with score $< 50$ (conditionally rendered only when applicable).
  6. **Dependency-Aware Next Steps Engine:**
     - Sequenced rationally: $\text{Debt} < 50 \to \text{Emergency} < 50 \to \text{Protection} < 50 \to \text{Cash Flow} < 80 \to \text{Moderate Gaps} \to \text{Goals} < 80 \to \text{Retirement} < 80 \to \text{Investing} < 80 \to \text{Maintenance}$.
     - Strict maximum of **3 recommended steps**.
     - Fully product-neutral action text.
     - Contextual tool links to existing routes: `/health-check/real-statement`, `/tools/loan-sip-recovery`, `/tools/life-insurance`, `/plan`, `/tools/retirement`, `/tools`.
* **UI/UX & Results Screen Restructuring:**
  - Redesigned around **"Your Financial Health Snapshot"** with 8 ordered sections:
    1. Overall Score Display with animated counter
    2. Short Narrative Explanation
    3. Your Key Strengths
    4. Areas to Strengthen
    5. Priority Areas (conditional)
    6. Your Next 3 Steps (with contextual tool buttons)
    7. Important Context / Limitation Disclosure
    8. Optional Ant Wealth Creation Consultation & WhatsApp CTA
  - Retained **zero forced lead capture**: no name, email, phone, or login required.
  - Full accessibility: semantic radio groups (`role="radio"`, `aria-checked`), visible focus rings, high-contrast badges, keyboard navigation (Space/Enter), `prefers-reduced-motion` compliance.
* **Verification & Testing Results:**
  - **Unit Tests:** `src/utils/calculations/financialHealth.test.ts` expanded to **130 tests (100% passing)** covering 7 pillars, 100% weight, boundary bands, pillar status transitions, strengths threshold, contradiction tests, and dependency priority ordering.
  - **Overall Test Suite:** `npm test` passing **12/12 suites (565+ unit tests, 100%)**.
  - **E2E Puppeteer QA:** `scratch/test-health-check-results-qa.js` passing **145/145 checks (100%)** across weakest, strongest, and mixed scenarios, 6 viewports (`375px`, `390px`, `412px`, `768px`, `1024px`, `1440px`), with strictly 0 browser console errors and 0px horizontal page overflow.
  - **Link Audit:** `node src/utils/check_all_links.mjs` passing with **132/132 internal links valid (100%)**.
  - **Compliance Audit:** `node src/utils/verification_audit.test.mjs` passing with **114 source files audited — 100% compliant**.
  - **Production Build:** `npm run build` completed with **33/33 static pages generated in 6.04s**.

---

## NEXT SESSION — START HERE

> **ATTENTION NEXT AGENT / DEVELOPER:**  
> **Before writing any code or modifying any file, YOU MUST READ THIS FILE (`PROJECT_STATUS.md`) ENTIRELY.**

### Recommended Next Steps for the Next Session:

1. **Production Deployment (Hosting & Custom Domain):**
   - Connect GitHub repository `https://github.com/santhosh144awc/AntWealth_2026_08` to **Vercel** / **Cloudflare Pages**.
   - Build settings: Build command: `npm run build`, Output directory: `dist`.
   - Verify custom domain `https://antwealth.in` and SSL certificates.
2. **Analytics Integration:**
   - When provided by Santhosh, insert the Google Analytics 4 (GA4) measurement tag into `src/layouts/BaseLayout.astro`.
3. **Verified Client Testimonials:**
   - When approved by Santhosh, replace dummy entries in `src/data/testimonials.ts` with real client feedback.
4. **Calendar Integration (Optional):**
   - If an automated calendar scheduling URL (e.g. Cal.com or Calendly) is provided, insert it into `siteConfig.contact.consultationBookingUrl` in `src/data/siteConfig.ts`.





