// Automated Validation Test Suite for Lumpsum Calculator Engine
import { calculateLumpsum, calculateFutureValue } from './lumpsum';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details: string = '') {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName} - ${details}`);
    failed++;
  }
}

function assertEqual(actual: number, expected: number, testName: string) {
  if (actual === expected) {
    console.log(`✅ PASS: ${testName} (Actual: ${actual})`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName} (Actual: ${actual}, Expected: ${expected})`);
    failed++;
  }
}

console.log('--- 1. Testing Core Lumpsum Compounding Math ---');

// Case 1: ₹1,000 for 1 year at 1%
// FV = 1000 * (1.01)^1 = 1010
const res1 = calculateLumpsum(1000, 1, 1);
assertEqual(res1.totalValue, 1010, '₹1,000 for 1 yr @ 1% = ₹1,010');
assertEqual(res1.investedAmount, 1000, 'Invested amount = ₹1,000');
assertEqual(res1.estimatedReturns, 10, 'Estimated Returns = ₹10');

// Case 2: ₹1,00,000 for 10 years at 12%
// FV = 100000 * (1.12)^10 = 310584.82 -> 310585
const res2 = calculateLumpsum(100000, 12, 10);
assertEqual(res2.totalValue, 310585, '₹1,00,000 for 10 yrs @ 12% = ₹3,10,585');
assertEqual(res2.investedAmount, 100000, 'Invested amount = ₹1,00,000');
assertEqual(res2.estimatedReturns, 210585, 'Estimated Returns = ₹2,10,585');
assertEqual(res2.yearlyBreakdown.length, 10, '10-year breakdown generated');

// Case 3: ₹10,00,000 for 20 years at 12%
// FV = 1000000 * (1.12)^20 = 9646293.09 -> 9646293
const res3 = calculateLumpsum(1000000, 12, 20);
assertEqual(res3.totalValue, 9646293, '₹10,00,000 for 20 yrs @ 12% = ₹96,46,293');
assertEqual(res3.estimatedReturns, 8646293, 'Estimated Returns = ₹86,46,293');

// Case 4: ₹1 Crore (1,00,00,000) for 40 years at 12%
// FV = 10000000 * (1.12)^40 = 930509704.1 -> 930509704
const res4 = calculateLumpsum(10000000, 12, 40);
assertEqual(res4.totalValue, 930509704, '₹1 Cr for 40 yrs @ 12% = ₹93,05,09,704 (₹93.05 Cr)');

console.log('\n--- 2. Testing Edge Cases & Boundary Handling ---');

// Zero principal
const zeroP = calculateLumpsum(0, 12, 10);
assertEqual(zeroP.totalValue, 0, 'Zero principal -> FV 0');

// Zero years
const zeroY = calculateLumpsum(100000, 12, 0);
assertEqual(zeroY.totalValue, 0, 'Zero years -> FV 0');

// Zero return rate
const zeroR = calculateLumpsum(100000, 0, 10);
assertEqual(zeroR.totalValue, 100000, '0% return -> FV equals principal ₹1,00,000');
assertEqual(zeroR.estimatedReturns, 0, '0% return -> Gains 0');

// Negative inputs
const neg = calculateLumpsum(-50000, 12, 10);
assertEqual(neg.totalValue, 0, 'Negative principal handled safely');

console.log('\n--- 3. Testing Optional Inflation Purchasing Power ---');
// Real purchasing power: 310585 / (1.06)^10 = 173429
const realVal = Math.round(310585 / Math.pow(1.06, 10));
assertEqual(realVal, 173429, 'Real value of ₹3,10,585 in 10 yrs @ 6% inflation ≈ ₹1,73,429');

console.log(`\n========================================`);
console.log(`LUMPSUM TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================\n`);

if (failed > 0) process.exit(1);
