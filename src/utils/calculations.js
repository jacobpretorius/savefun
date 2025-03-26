/**
 * Calculate investment growth over time
 */
export const calculateInvestmentGrowth = (values) => {
  const {
    currentInvestments,
    monthlySavings,
    currentDebts,
    returnRate,
    inflationRate,
    years
  } = values;

  const monthlyReturnRate = (returnRate / 100) / 12;
  const monthlyInflationRate = (inflationRate / 100) / 12;
  const totalMonths = years * 12;

  let netWorth = currentInvestments - currentDebts;
  let investmentValue = currentInvestments;
  let debt = currentDebts;

  const data = [];

  // Add starting point
  data.push({
    month: 0,
    year: 0,
    netWorth: netWorth,
    investmentValue: investmentValue,
    debt: debt,
    realNetWorth: netWorth, // Adjusted for inflation
    contributions: 0, // Total contributions over time
    returns: 0 // Total returns over time
  });

  let totalContributions = 0;
  let totalReturns = 0;
  let inflationFactor = 1;

  for (let month = 1; month <= totalMonths; month++) {
    // Calculate returns for the month
    const monthlyReturn = investmentValue * monthlyReturnRate;
    totalReturns += monthlyReturn;

    // Add monthly savings
    investmentValue += monthlySavings + monthlyReturn;
    totalContributions += monthlySavings;

    // Update inflation factor
    inflationFactor *= (1 + monthlyInflationRate);

    // Calculate net worth
    netWorth = investmentValue - debt;

    // Real values adjusted for inflation
    const realNetWorth = netWorth / inflationFactor;

    // Add to data array only at year marks or at the final month
    if (month % 12 === 0 || month === totalMonths) {
      const year = Math.floor(month / 12);
      data.push({
        month,
        year,
        netWorth: Math.round(netWorth),
        investmentValue: Math.round(investmentValue),
        debt: Math.round(debt),
        realNetWorth: Math.round(realNetWorth),
        contributions: Math.round(totalContributions),
        returns: Math.round(totalReturns)
      });
    }
  }

  return data;
}; 