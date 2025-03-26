import React from 'react';
import styled from 'styled-components';

const SummaryContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const SummaryTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #1f2937;
`;

const BattleContainer = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 8px;
`;

const BattleTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #4b5563;
`;

const BattleVisual = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const BattleSide = styled.div`
  flex: 1;
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
  background-color: ${props => props.color || '#f3f4f6'};
  color: white;
  font-weight: 600;
`;

const BattleVs = styled.div`
  padding: 0 1rem;
  font-weight: 700;
  color: #6b7280;
`;

const BattleResult = styled.div`
  padding: 0.75rem;
  border-radius: 6px;
  text-align: center;
  background-color: ${props => props.winner === 'investments' ? '#dcfce7' : props.winner === 'inflation' ? '#fee2e2' : '#f3f4f6'};
  color: ${props => props.winner === 'investments' ? '#166534' : props.winner === 'inflation' ? '#991b1b' : '#4b5563'};
  font-weight: 600;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled.div`
  padding: 1.25rem;
  background-color: ${props => props.highlight ? '#f0f9ff' : '#f8fafc'};
  border-radius: 8px;
  border-left: 4px solid ${props => props.color || '#3b82f6'};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
`;

const ChangeIndicator = styled.span`
  font-size: 0.875rem;
  color: ${props => props.positive ? '#10b981' : '#ef4444'};
  margin-left: 0.5rem;
`;

const formatCurrency = (value) => {
  return `£${value.toLocaleString()}`;
};

const formatPercentage = (value) => {
  return `${value.toFixed(2)}%`;
};

const Summary = ({ data, formValues }) => {
  if (!data || data.length < 2) return null;

  const initialData = data[0];
  const finalData = data[data.length - 1];

  const totalContributions = finalData.contributions;
  const totalReturns = finalData.returns;

  const initialNetWorth = initialData.netWorth;
  const finalNetWorth = finalData.netWorth;
  const finalRealNetWorth = finalData.realNetWorth;

  const netWorthGrowth = finalNetWorth - initialNetWorth;
  const netWorthGrowthPercentage = (netWorthGrowth / Math.abs(initialNetWorth)) * 100;

  const inflationImpact = finalNetWorth - finalRealNetWorth;
  const inflationImpactPercentage = (inflationImpact / finalNetWorth) * 100;

  const returnOnInvestment = (totalReturns / totalContributions) * 100;

  // Determine who's winning the battle
  const battleWinner = inflationImpactPercentage > returnOnInvestment
    ? 'inflation'
    : returnOnInvestment > inflationImpactPercentage
      ? 'investments'
      : 'tie';

  const battleResult = battleWinner === 'investments'
    ? `Your investments are outpacing inflation by ${formatPercentage(returnOnInvestment - inflationImpactPercentage)}`
    : battleWinner === 'inflation'
      ? `Inflation is eroding your gains by ${formatPercentage(inflationImpactPercentage - returnOnInvestment)}`
      : 'Your investments are just keeping pace with inflation';

  return (
    <SummaryContainer>
      <SummaryTitle>Investment Summary</SummaryTitle>

      <BattleContainer>
        <BattleTitle>The Battle: Investment Growth vs. Inflation</BattleTitle>
        <BattleVisual>
          <BattleSide color="#10b981">
            Investment Returns: {formatPercentage(returnOnInvestment)}
          </BattleSide>
          <BattleVs>VS</BattleVs>
          <BattleSide color="#ef4444">
            Inflation Impact: {formatPercentage(inflationImpactPercentage)}
          </BattleSide>
        </BattleVisual>
        <BattleResult winner={battleWinner}>
          {battleResult}
        </BattleResult>
      </BattleContainer>

      <StatsGrid>
        <StatCard highlight color="#3b82f6">
          <StatLabel>Final Net Worth</StatLabel>
          <StatValue>
            {formatCurrency(finalNetWorth)}
            <ChangeIndicator positive={netWorthGrowth > 0}>
              {netWorthGrowth > 0 ? '↑' : '↓'} {formatPercentage(netWorthGrowthPercentage)}
            </ChangeIndicator>
          </StatValue>
        </StatCard>

        <StatCard color="#6366f1">
          <StatLabel>Final Real Net Worth (Today's Money)</StatLabel>
          <StatValue>{formatCurrency(finalRealNetWorth)}</StatValue>
        </StatCard>

        <StatCard color="#10b981">
          <StatLabel>Total Contributions</StatLabel>
          <StatValue>{formatCurrency(totalContributions)}</StatValue>
        </StatCard>

        <StatCard color="#8b5cf6">
          <StatLabel>Total Investment Returns</StatLabel>
          <StatValue>{formatCurrency(totalReturns)}</StatValue>
        </StatCard>

        <StatCard color="#f59e0b">
          <StatLabel>Return on Investment</StatLabel>
          <StatValue>{formatPercentage(returnOnInvestment)}</StatValue>
        </StatCard>

        <StatCard color="#ef4444">
          <StatLabel>Inflation's Impact</StatLabel>
          <StatValue>
            {formatCurrency(inflationImpact)}
            <ChangeIndicator positive={false}>
              {formatPercentage(inflationImpactPercentage)}
            </ChangeIndicator>
          </StatValue>
        </StatCard>
      </StatsGrid>
    </SummaryContainer>
  );
};

export default Summary; 