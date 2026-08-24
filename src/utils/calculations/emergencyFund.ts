export function calculateEmergencyFund(monthlyExpenses: number, monthsNeeded = 6) {
  return {
    recommendedFund: Math.round(monthlyExpenses * monthsNeeded),
    monthsCovered: monthsNeeded,
  };
}
