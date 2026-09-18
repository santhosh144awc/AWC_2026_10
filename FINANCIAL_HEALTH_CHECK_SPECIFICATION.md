# Ant Wealth Creation — Financial Health Check Specification v4.0

**Document Type:** Technical & Methodology Specification  
**Application Route:** `/health-check`  
**Engine Implementation:** `src/utils/calculations/financialHealth.ts`  
**User Interface Component:** `src/components/health/HealthQuestionnaire.tsx`  
**Version:** `v4.0.0`  
**Last Updated:** September 18, 2026  

---

## 1. Executive Summary & Financial Philosophy

The **Financial Health Check v4.0** is an educational, product-neutral personal finance self-assessment designed for Indian families to evaluate their financial foundation in approximately 2 minutes.

### Core Principles of v4.0:
1. **Financial health is broader than investment returns:** A high savings rate or portfolio return cannot compensate for missing emergency liquidity, high-cost revolving debt, or unprotected family risk.
2. **Product Neutrality:** Financial health is defined by sound habits, resilience, and goal alignment—not by specific financial products. The tool does not favor mutual funds, SIPs, or equity over fixed deposits, PPF, or gold automatically.
3. **No Universal Insurance Multipliers:** The outdated "15–20x income" rule has been eliminated from scoring. Protection adequacy depends on family dependants, liabilities, income stability, and existing assets.
4. **Holistic Debt Evaluation:** Debt is evaluated by loan comfort, repayment pressure, and cost structure (distinguishing high-cost revolving debt from manageable home/education loans), rather than raw EMI-to-income ratios alone.
5. **Sustainable Surplus:** Savings are evaluated on consistency and sustainability without branding moderate savings (e.g., 10–20%) as unhealthy.
6. **Dependency-Aware Action Engine:** Recommended next steps follow a rational hierarchy:  
   $$\text{Foundation (Debt \& Emergency)} \longrightarrow \text{Protection} \longrightarrow \text{Cash Flow Surplus} \longrightarrow \text{Goal Planning} \longrightarrow \text{Long-Term Compounding}$$
   Recommendations are capped at **maximum 3 steps** and prioritize the most critical vulnerabilities first.
7. **Educational Snapshot, Not a Financial Plan:** Communicates clearly that a 7-question diagnostic is a starting point, not formal investment advice or a comprehensive financial plan.
8. **Zero Forced Lead Capture:** Completely open and un-gated. Users receive their full score, status breakdown, and recommendations without entering personal details (name, email, phone, or PAN).

---

## 2. The 7 Pillars & Weight Distribution

The framework evaluates 7 distinct personal finance pillars totaling **100%**:

| Pillar ID | Pillar Name | Short Title | Weight | Core Focus |
| :--- | :--- | :--- | :---: | :--- |
| `cashFlow` | Cash Flow & Saving | Cash Flow | **15%** (`0.15`) | Consistent, sustainable surplus after household expenses |
| `emergencyFund` | Emergency Reserve | Emergency | **15%** (`0.15`) | Readily available living expense coverage for unforeseen shocks |
| `debt` | Debt Management | Debt | **15%** (`0.15`) | Comfort of repayments, elimination of high-cost revolving debt |
| `protection` | Protection | Protection | **15%** (`0.15`) | Adequate life and health protection against family income interruption |
| `investments` | Investing | Investing | **15%** (`0.15`) | Matching savings to goals, time horizons, liquidity, and risk level |
| `goals` | Goal Planning | Goals | **10%** (`0.10`) | Clarity on milestones, timelines, and required resources |
| `retirement` | Retirement | Retirement | **15%** (`0.15`) | Clarity on future post-work living expenses, inflation, and longevity |

$$\sum_{i=1}^{7} \text{Weight}_i = 0.15 + 0.15 + 0.15 + 0.15 + 0.15 + 0.10 + 0.15 = 1.00\ (100\%)$$

---

## 3. Questionnaire & Scoring Rubric

Every pillar contains exactly **4 mutually exclusive options**. All option scores range between **20 and 100**.

### Pillar 1: Cash Flow & Saving (`cashFlow` — 15%)
* **Question:** *"After your regular household expenses, how consistently do you have money left to save or invest?"*
* **Helper Text:** *"Your ideal saving level depends on your income, responsibilities and financial goals. The important first step is having a sustainable surplus."*

| Option ID | Option Label | Score |
| :--- | :--- | :---: |
| `cf_1` | Little or nothing is left most months. | **20** |
| `cf_2` | Usually less than 10% of my income is left. | **45** |
| `cf_3` | Usually around 10–20% is left. | **80** |
| `cf_4` | More than 20% is consistently left. | **100** |

---

### Pillar 2: Emergency Reserve (`emergencyFund` — 15%)
* **Question:** *"If your income stopped unexpectedly, how long could your readily available emergency savings cover essential expenses?"*
* **Helper Text:** *"The right emergency reserve depends on income stability, dependants, health needs, debt and household responsibilities."*

| Option ID | Option Label | Score |
| :--- | :--- | :---: |
| `ef_1` | Less than 1 month | **20** |
| `ef_2` | 1–3 months | **50** |
| `ef_3` | 3–6 months | **85** |
| `ef_4` | More than 6 months | **100** |

---

### Pillar 3: Debt Management (`debt` — 15%)
* **Question:** *"How comfortable are your current loan and debt repayments?"*
* **Helper Text:** *"Debt health depends on both the size and cost of your debt. High-cost revolving debt deserves attention even when the EMI appears manageable."*

| Option ID | Option Label | Score |
| :--- | :--- | :---: |
| `db_1` | High-cost debt or repayments regularly put pressure on my budget. | **20** |
| `db_2` | I have significant EMIs, but they are currently manageable. | **50** |
| `db_3` | My repayments are manageable and I have no high-cost revolving debt. | **85** |
| `db_4` | I have very little manageable debt and strong repayment flexibility. | **100** |

---

### Pillar 4: Protection (`protection` — 15%)
* **Question:** *"How well is your family protected against major health costs and loss of income?"*
* **Helper Text:** *"Protection needs vary with dependants, income, liabilities, existing assets and other family responsibilities. A simple income multiple cannot determine the right cover for everyone."*

| Option ID | Option Label | Score |
| :--- | :--- | :---: |
| `pr_1` | I mainly depend on employer cover or have little personal protection. | **20** |
| `pr_2` | I have some protection, but I am unsure whether it is enough. | **50** |
| `pr_3` | I have personal health protection and life protection where my family depends on my income. | **80** |
| `pr_4` | I have reviewed my health and life protection against my family's needs, liabilities and important goals. | **100** |

---

### Pillar 5: Investing (`investments` — 15%)
* **Question:** *"How well do your savings and investments match your goals, time horizons and risk level?"*
* **Helper Text:** *"Good investing is not about choosing one particular product. It is about matching money to your goals, time horizon, liquidity needs and ability to handle risk."*

| Option ID | Option Label | Score |
| :--- | :--- | :---: |
| `inv_1` | Most of my money is saved without a clear long-term plan. | **30** |
| `inv_2` | I invest or save irregularly, but it is not clearly linked to my goals. | **55** |
| `inv_3` | I invest regularly and broadly match my investments to my goals and time horizons. | **85** |
| `inv_4` | I have a diversified approach that is reviewed as my goals, time horizons or circumstances change. | **100** |

---

### Pillar 6: Goal Planning (`goals` — 10%)
* **Question:** *"How clearly have you identified your important financial goals and what they may require?"*
* **Helper Text:** *"Clear goals help you decide how much to save, when you need the money and how much investment risk may be appropriate."*

| Option ID | Option Label | Score |
| :--- | :--- | :---: |
| `gl_1` | My important goals are mostly informal or unplanned. | **25** |
| `gl_2` | I know my major goals and have approximate timelines. | **55** |
| `gl_3` | I have estimated costs, timelines and a savings or investment approach for my important goals. | **85** |
| `gl_4` | I regularly review my goal progress and adjust my plan when circumstances change. | **100** |

---

### Pillar 7: Retirement (`retirement` — 15%)
* **Question:** *"How clearly have you planned for the income and expenses you may need after you stop working?"*
* **Helper Text:** *"Retirement planning should consider future living costs, inflation, expected income, longevity and the time available to build resources."*

| Option ID | Option Label | Score |
| :--- | :--- | :---: |
| `rt_1` | I have not estimated what I may need for retirement. | **20** |
| `rt_2` | I save for retirement, but I have not estimated my future needs clearly. | **50** |
| `rt_3` | I have estimated my future needs and regularly save towards them. | **85** |
| `rt_4` | My retirement plan considers inflation, future income needs and is reviewed as circumstances change. | **100** |

---

## 4. Overall Score Calculation & Score Bands

### Mathematical Formulation
$$\text{Overall Score} = \text{round}\left( \sum_{i=1}^{7} \left( \text{PillarScore}_i \times \text{Weight}_i \right) \right)$$

* **Minimum Possible Score (all lowest options):**  
  $$20(0.15) + 20(0.15) + 20(0.15) + 20(0.15) + 30(0.15) + 25(0.10) + 20(0.15) = 3 + 3 + 3 + 3 + 4.5 + 2.5 + 3 = \mathbf{22}$$
* **Maximum Possible Score (all highest options):**  
  $$100(1.00) = \mathbf{100}$$

### Overall Score Communication Bands

| Score Range | Classification Title | Theme Color | Short Explanation |
| :---: | :--- | :---: | :--- |
| **80 – 100** | **Strong Foundation** | `#00AB96`<br>(Growth Teal) | Your answers show a strong financial foundation with healthy habits, good resilience and forward-looking planning. |
| **65 – 79** | **Generally Healthy** | `#2563EB`<br>(Royal Blue) | Your answers show a reasonable financial foundation, with a few areas that could be strengthened. |
| **50 – 64** | **Needs Strengthening** | `#D97706`<br>(Warm Amber) | You have started taking several right steps, but key foundational gaps need attention to improve financial security. |
| **0 – 49** | **Priority Areas Identified** | `#DC2626`<br>(Coral Red) | Your answers indicate important vulnerabilities in liquidity, protection or debt that should be addressed first. |

---

## 5. Granular Pillar Status & Category Classification

Every pillar's score is evaluated via a centralized pure function:
```typescript
function getPillarStatus(score: number): 'strong' | 'building' | 'attention' {
  if (score >= 80) return 'strong';
  if (score >= 50) return 'building';
  return 'attention';
}
```

### Classification Breakdown:
* **Key Strengths ($\ge 80$):** Highlighted with green badge `✓ Strong`. Only rendered if at least one pillar qualifies.
* **Areas to Strengthen ($50 \le \text{score} < 80$):** Highlighted with amber badge `↗ Building`. Identifies functional areas ready for optimization.
* **Priority Areas ($< 50$):** Highlighted with red badge `! Needs Attention`. Only rendered if one or more pillars score $< 50$.
* **Non-Contradiction Guarantee:** A pillar score strictly maps to exactly one of the three buckets. It is mathematically impossible for a pillar to appear as both a strength and an attention area.

---

## 6. Dependency-Aware Next Steps Engine

Rather than sorting raw scores blindly, recommendations are generated through a dependency-aware financial hierarchy:

1. **High-Cost Debt / Heavy Pressure (`debt` < 50):**  
   *Action:* Review your outstanding loans and identify any high-cost or repayment-heavy debt that should be addressed first.  
   *Contextual Route:* `/tools/loan-sip-recovery`
2. **Emergency Reserve Vulnerability (`emergencyFund` < 50):**  
   *Action:* Estimate your essential monthly expenses and build an emergency reserve that reflects your income stability and family responsibilities.  
   *Contextual Route:* `/health-check/real-statement`
3. **Protection Gap (`protection` < 50):**  
   *Action:* Review your personal health and life protection against dependants, liabilities, income and important family responsibilities.  
   *Contextual Route:* `/tools/life-insurance`
4. **Cash Flow Surplus Deficit (`cashFlow` < 80):**  
   *Action:* Track your income and essential expenses for one month and identify a realistic amount you can consistently save or invest.  
   *Contextual Route:* `/health-check/real-statement`
5. **Moderate Debt / Reserve / Protection Gap (50 to 79):**  
   Sequenced before long-term risk asset expansion.
6. **Goal Planning Clarity (`goals` < 80):**  
   *Action:* List your three most important financial goals, their target dates and approximate future costs.  
   *Contextual Route:* `/plan`
7. **Retirement Planning Horizon (`retirement` < 80):**  
   *Action:* Estimate your future retirement spending and income needs, then check whether your current savings plan is keeping pace.  
   *Contextual Route:* `/tools/retirement`
8. **Investment Alignment (`investments` < 80):**  
   *Action:* Review whether your investments match your goals, time horizons, liquidity needs and risk level.  
   *Contextual Route:* `/tools`
9. **Annual Review Maintenance (All $\ge 80$):**  
   Rebalance asset allocation and update coverage annually.

* **Constraint:** **Maximum 3 recommendations** displayed at all times.
* **Product Neutrality:** Zero mentions of specific commercial products, insurers, or funds.

---

## 7. Results Screen Architecture & UX Hierarchy

The results screen is organized into 8 ordered sections:

1. **Overall Score:** Prominent circular display with animated numerical counter (`score / 100`).
2. **Short Explanation:** Band badge with accessible text and narrative guidance.
3. **Key Strengths:** Conditional list of pillars $\ge 80$.
4. **Areas to Strengthen:** Conditional list of pillars $50 \le \text{score} < 80$.
5. **Priority Areas:** Conditional section; rendered only if any pillar $< 50$.
6. **Your Next 3 Steps:** Sequenced, dependency-aware action cards with contextual tool routes.
7. **Important Context / Scope Disclosure:**
   > *"This is an educational self-assessment designed to give you a quick view of areas of financial strength and areas that may need attention. It is not a complete financial plan or a personalised investment recommendation. Insurance, retirement, investment and other financial needs require additional information to assess properly."*
8. **Optional Ant Wealth Creation CTA & WhatsApp Bridge:**
   Pre-filled WhatsApp message targeted to C. Santhosh Sathriyan (`+91 80879 71566`) summarizing the user's score and priority areas without exposing sensitive personal data.

---

## 8. Automated Test Coverage Matrix

The v4.0 implementation is validated by a 130-assertion unit test suite (`src/utils/calculations/financialHealth.test.ts`) and headless browser E2E test suite (`scratch/test-health-check-results-qa.js`):

1. **Structure & Weight Verification:** 7 pillars, exact 100% total weight, 4 options per question, scores in $[20, 100]$.
2. **Extreme Scenarios:** All highest options = 100 (Strong Foundation); all lowest options = 22 (Priority Areas Identified).
3. **Boundary Score Bands:** 49 (Priority Areas), 50 (Needs Strengthening), 64 (Needs Strengthening), 65 (Generally Healthy), 79 (Generally Healthy), 80 (Strong Foundation).
4. **Pillar Status Transitions:** 49 (Needs Attention), 50 (Building), 79 (Building), 80 (Strong).
5. **Strengths Threshold:** 79 excluded; 80 included.
6. **Contradiction Verification:** Every discrete score from 20 to 100 belongs to exactly one category bucket.
7. **Dependency Prioritization:** Debt $< 50$ prioritized over weak investments; Emergency $< 50$ prioritized over long-term goals; max 3 next steps; zero duplicate pillars.
8. **Product Neutrality Verifications:** Regexp assertions confirming no "start a sip" or insurer endorsement in recommendations.
9. **Multi-Viewport Responsiveness & 0px Overflow:** Headless Chrome verification across 375px, 390px, 412px, 768px, 1024px, 1440px.
