/**
 * Calculate investment growth over time with mortgage amortization
 */
export const calculateInvestmentGrowth = (values) => {
  const {
    currentInvestments,
    monthlySavings,
    mortgageBalance,
    mortgageInterestRate,
    mortgageTerm,
    returnRate,
    inflationRate,
    years
  } = values;

  const monthlyReturnRate = (returnRate / 100) / 12;
  const monthlyInflationRate = (inflationRate / 100) / 12;
  const monthlyMortgageRate = (mortgageInterestRate / 100) / 12;
  const totalMonths = years * 12;
  const mortgageMonths = mortgageTerm * 12;

  // Calculate monthly mortgage payment
  const calculateMonthlyMortgagePayment = () => {
    const P = mortgageBalance; // Principal
    const r = monthlyMortgageRate; // Monthly interest rate
    const n = mortgageMonths; // Total number of payments

    if (r === 0 || n === 0) return 0;

    // Monthly payment formula: P * (r * (1 + r)^n) / ((1 + r)^n - 1)
    return P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  const monthlyMortgagePayment = calculateMonthlyMortgagePayment();

  let investmentValue = currentInvestments;
  let mortgageRemaining = mortgageBalance;
  let netWorth = investmentValue - mortgageRemaining;

  const data = [];

  // Add starting point
  data.push({
    month: 0,
    year: 0,
    netWorth: netWorth,
    investmentValue: investmentValue,
    mortgageRemaining: mortgageRemaining,
    mortgagePayment: monthlyMortgagePayment,
    realNetWorth: netWorth, // Adjusted for inflation
    inflationImpact: 0, // Impact of inflation (can be positive or negative)
    contributions: 0, // Total contributions over time
    returns: 0, // Total returns over time
    mortgageInterestPaid: 0, // Total mortgage interest paid
    mortgagePrincipalPaid: 0 // Total mortgage principal paid
  });

  let totalContributions = 0;
  let totalReturns = 0;
  let totalMortgageInterest = 0;
  let totalMortgagePrincipal = 0;
  let inflationFactor = 1;

  for (let month = 1; month <= totalMonths; month++) {
    // Calculate investment returns for the month
    const monthlyReturn = investmentValue * monthlyReturnRate;
    totalReturns += monthlyReturn;

    // Add monthly savings and returns to investments
    investmentValue += monthlySavings + monthlyReturn;
    totalContributions += monthlySavings;

    // Handle mortgage payment for the month
    let mortgageInterestPayment = 0;
    let mortgagePrincipalPayment = 0;

    if (mortgageRemaining > 0 && month <= mortgageMonths) {
      // Calculate interest portion of payment
      mortgageInterestPayment = mortgageRemaining * monthlyMortgageRate;

      // Calculate principal portion of payment
      mortgagePrincipalPayment = Math.min(
        monthlyMortgagePayment - mortgageInterestPayment,
        mortgageRemaining
      );

      // Update mortgage balance
      mortgageRemaining -= mortgagePrincipalPayment;

      // Track total interest and principal paid
      totalMortgageInterest += mortgageInterestPayment;
      totalMortgagePrincipal += mortgagePrincipalPayment;
    }

    // Update inflation factor
    inflationFactor *= (1 + monthlyInflationRate);

    // Calculate net worth
    netWorth = investmentValue - mortgageRemaining;

    // Real values adjusted for inflation
    const realNetWorth = netWorth / inflationFactor;

    // Calculate inflation impact (can be positive or negative)
    // When net worth is positive, inflation erodes value (positive impact/loss)
    // When net worth is negative, inflation reduces debt burden (negative impact/gain)
    const inflationImpact = netWorth - realNetWorth;

    // Add to data array only at year marks or at the final month
    if (month % 12 === 0 || month === totalMonths) {
      const year = Math.floor(month / 12);
      data.push({
        month,
        year,
        netWorth: Math.round(netWorth),
        investmentValue: Math.round(investmentValue),
        mortgageRemaining: Math.round(mortgageRemaining),
        mortgagePayment: Math.round(monthlyMortgagePayment),
        realNetWorth: Math.round(realNetWorth),
        inflationImpact: Math.round(inflationImpact),
        contributions: Math.round(totalContributions),
        returns: Math.round(totalReturns),
        mortgageInterestPaid: Math.round(totalMortgageInterest),
        mortgagePrincipalPaid: Math.round(totalMortgagePrincipal)
      });
    }
  }

  return data;
}; 