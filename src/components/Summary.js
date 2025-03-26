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
  margin-bottom: 1.5rem;
  color: #1f2937;
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

  return (
    <SummaryContainer>
      <SummaryTitle>Investment Summary</SummaryTitle>

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
          <StatLabel>Impact of Inflation</StatLabel>
          <StatValue>
            {formatCurrency(inflationImpact)}
            <ChangeIndicator positive={false}>
              {formatPercentage(inflationImpactPercentage)}
            </ChangeIndicator>
          </StatValue>
        </StatCard>

        <StatCard color="#6366f1">
          <StatLabel>Final Real Net Worth</StatLabel>
          <StatValue>{formatCurrency(finalRealNetWorth)}</StatValue>
        </StatCard>
      </StatsGrid>
    </SummaryContainer>
  );
};

export default Summary; 