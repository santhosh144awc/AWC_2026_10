export interface SIPInput {
  monthlyInvestment: number;
  expectedReturnRate: number;
  timePeriodYears: number;
  stepUpPercentage?: number;
}

export interface SIPResult {
  totalInvested: number;
  estimatedReturns: number;
  totalValue: number;
  breakdown: Array<{ year: number; invested: number; value: number }>;
}

export interface RequiredSIPResult {
  requiredMonthlySIP: number;
  totalInvested: number;
  estimatedReturns: number;
  targetAmount: number;
}

export function calculateSIP(input: SIPInput): SIPResult {
  const { 
    monthlyInvestment = 0, 
    expectedReturnRate = 0, 
    timePeriodYears = 0, 
    stepUpPercentage = 0 
  } = input;

  if (monthlyInvestment <= 0 || timePeriodYears <= 0) {
    return {
      totalInvested: 0,
      estimatedReturns: 0,
      totalValue: 0,
      breakdown: []
    };
  }

  const monthlyRate = (expectedReturnRate > 0) ? expectedReturnRate / 12 / 100 : 0;
  const totalMonths = Math.max(1, Math.round(timePeriodYears * 12));
  
  let totalInvested = 0;
  let totalValue = 0;
  const breakdown = [];
  let currentMonthly = monthlyInvestment;

  for (let month = 1; month <= totalMonths; month++) {
    if (stepUpPercentage > 0 && month > 1 && (month - 1) % 12 === 0) {
      currentMonthly += (currentMonthly * stepUpPercentage) / 100;
    }
    totalInvested += currentMonthly;
    totalValue = (totalValue + currentMonthly) * (1 + monthlyRate);
    
    if (month % 12 === 0 || month === totalMonths) {
      breakdown.push({
        year: Math.round((month / 12) * 10) / 10,
        invested: Math.round(totalInvested),
        value: Math.round(totalValue),
      });
    }
  }

  return {
    totalInvested: Math.round(totalInvested),
    estimatedReturns: Math.max(0, Math.round(totalValue - totalInvested)),
    totalValue: Math.round(totalValue),
    breakdown,
  };
}

export function calculateRequiredSIP(
  targetAmount: number,
  years: number,
  expectedReturnRate: number,
  stepUpPercentage: number = 0
): RequiredSIPResult {
  if (targetAmount <= 0 || years <= 0) {
    return {
      requiredMonthlySIP: 0,
      totalInvested: 0,
      estimatedReturns: 0,
      targetAmount: 0
    };
  }

  // Without step-up: Standard Annuity Formula
  if (!stepUpPercentage || stepUpPercentage <= 0) {
    const monthlyRate = (expectedReturnRate > 0) ? expectedReturnRate / 12 / 100 : 0;
    const totalMonths = years * 12;

    if (monthlyRate === 0) {
      const requiredMonthlySIP = Math.round(targetAmount / totalMonths);
      return {
        requiredMonthlySIP,
        totalInvested: targetAmount,
        estimatedReturns: 0,
        targetAmount
      };
    }

    // FV = P * [((1 + r)^n - 1) / r] * (1 + r)
    const factor = ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
    const requiredMonthlySIP = Math.max(1, Math.round(targetAmount / factor));
    const totalInvested = requiredMonthlySIP * totalMonths;
    const estimatedReturns = Math.max(0, targetAmount - totalInvested);

    return {
      requiredMonthlySIP,
      totalInvested,
      estimatedReturns,
      targetAmount
    };
  }

  // With step-up: binary search for starting monthly investment
  let low = 1;
  let high = targetAmount;
  let optimalMonthly = low;

  for (let i = 0; i < 30; i++) {
    const mid = (low + high) / 2;
    const res = calculateSIP({
      monthlyInvestment: mid,
      expectedReturnRate,
      timePeriodYears: years,
      stepUpPercentage
    });

    if (res.totalValue >= targetAmount) {
      optimalMonthly = mid;
      high = mid;
    } else {
      low = mid;
    }
  }

  const finalRes = calculateSIP({
    monthlyInvestment: Math.max(1, Math.round(optimalMonthly)),
    expectedReturnRate,
    timePeriodYears: years,
    stepUpPercentage
  });

  return {
    requiredMonthlySIP: Math.max(1, Math.round(optimalMonthly)),
    totalInvested: finalRes.totalInvested,
    estimatedReturns: Math.max(0, Math.round(targetAmount - finalRes.totalInvested)),
    targetAmount
  };
}

