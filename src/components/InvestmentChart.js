import React, { useState } from 'react';
import styled from 'styled-components';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';

const ChartContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const ChartTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: #1f2937;
`;

const ChartOptions = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ToggleButton = styled.button`
  background-color: ${props => props.active ? '#3b82f6' : '#e5e7eb'};
  color: ${props => props.active ? 'white' : '#4b5563'};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.active ? '#2563eb' : '#d1d5db'};
  }
`;

const formatCurrency = (value) => {
  return `£${value.toLocaleString()}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '0.75rem',
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
      }}>
        <p style={{ margin: '0 0 0.5rem', fontWeight: 'bold' }}>{`Year ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ margin: '0.25rem 0', color: entry.color }}>
            {`${entry.name}: ${formatCurrency(entry.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const InvestmentChart = ({ data }) => {
  const [showRealValues, setShowRealValues] = useState(false);

  // Format data for the chart
  const chartData = data.map(item => ({
    year: item.year,
    "Net Worth": item.netWorth,
    "Real Net Worth": item.realNetWorth,
    "Investments": item.investmentValue,
    "Debt": item.debt,
    "Contributions": item.contributions,
    "Returns": item.returns
  }));

  return (
    <ChartContainer>
      <ChartTitle>Wealth Growth Projection</ChartTitle>

      <ChartOptions>
        <ToggleButton
          active={!showRealValues}
          onClick={() => setShowRealValues(false)}
        >
          Nominal Values
        </ToggleButton>
        <ToggleButton
          active={showRealValues}
          onClick={() => setShowRealValues(true)}
        >
          Inflation Adjusted
        </ToggleButton>
      </ChartOptions>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="year"
            label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }}
          />
          <YAxis
            tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
            label={{ value: 'Amount (£)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <ReferenceLine y={0} stroke="#64748b" />

          {showRealValues ? (
            <Line
              type="monotone"
              dataKey="Real Net Worth"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8 }}
            />
          ) : (
            <Line
              type="monotone"
              dataKey="Net Worth"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8 }}
            />
          )}

          <Line
            type="monotone"
            dataKey="Investments"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="Debt"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default InvestmentChart; 