export interface AssetsBreakdown {
  bankSavings: number;
  mutualFunds: number;
  stocks: number;
  epfPpf: number;
  gold: number;
  realEstate: number;
  otherAssets: number;
}

export interface LiabilitiesBreakdown {
  homeLoan: number;
  personalLoan: number;
  carLoan: number;
  creditCardDebt: number;
  otherLiabilities: number;
}

export interface NetWorthInput {
  assets: AssetsBreakdown;
  liabilities: LiabilitiesBreakdown;
}

export interface NetWorthResult {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  liquidAssets: number;
  liquidPercentage: number;
  debtToAssetRatio: number;
  assetPercentages: Record<keyof AssetsBreakdown, number>;
}

export function calculateNetWorth(input: NetWorthInput): NetWorthResult {
  const { assets, liabilities } = input;

  const totalAssets = Math.round(
    (assets.bankSavings || 0) +
    (assets.mutualFunds || 0) +
    (assets.stocks || 0) +
    (assets.epfPpf || 0) +
    (assets.gold || 0) +
    (assets.realEstate || 0) +
    (assets.otherAssets || 0)
  );

  const totalLiabilities = Math.round(
    (liabilities.homeLoan || 0) +
    (liabilities.personalLoan || 0) +
    (liabilities.carLoan || 0) +
    (liabilities.creditCardDebt || 0) +
    (liabilities.otherLiabilities || 0)
  );

  const netWorth = totalAssets - totalLiabilities;

  // Liquid assets = Bank + Mutual Funds + Stocks
  const liquidAssets = Math.round(
    (assets.bankSavings || 0) + 
    (assets.mutualFunds || 0) + 
    (assets.stocks || 0)
  );

  const liquidPercentage = totalAssets > 0 
    ? Math.round((liquidAssets / totalAssets) * 100) 
    : 0;

  const debtToAssetRatio = totalAssets > 0 
    ? Math.round((totalLiabilities / totalAssets) * 100) 
    : 0;

  const assetPercentages: Record<keyof AssetsBreakdown, number> = {
    bankSavings: totalAssets > 0 ? Math.round(((assets.bankSavings || 0) / totalAssets) * 100) : 0,
    mutualFunds: totalAssets > 0 ? Math.round(((assets.mutualFunds || 0) / totalAssets) * 100) : 0,
    stocks: totalAssets > 0 ? Math.round(((assets.stocks || 0) / totalAssets) * 100) : 0,
    epfPpf: totalAssets > 0 ? Math.round(((assets.epfPpf || 0) / totalAssets) * 100) : 0,
    gold: totalAssets > 0 ? Math.round(((assets.gold || 0) / totalAssets) * 100) : 0,
    realEstate: totalAssets > 0 ? Math.round(((assets.realEstate || 0) / totalAssets) * 100) : 0,
    otherAssets: totalAssets > 0 ? Math.round(((assets.otherAssets || 0) / totalAssets) * 100) : 0
  };

  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    liquidAssets,
    liquidPercentage,
    debtToAssetRatio,
    assetPercentages
  };
}

