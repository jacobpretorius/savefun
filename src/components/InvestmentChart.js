import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Area,
  Bar
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

const ChartSubtitle = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
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

const CustomTooltip = ({ active, payload, label, startYear }) => {
  if (active && payload && payload.length) {
    const calendarYear = startYear + parseInt(label);

    return (
      <div style={{
        backgroundColor: 'white',
        padding: '0.75rem',
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
      }}>
        <p style={{ margin: '0 0 0.5rem', fontWeight: 'bold' }}>
          {`Year ${label} (${calendarYear})`}
        </p>
        {payload.map((entry, index) => {
          // Special handling for inflation impact
          if (entry.name === "Inflation Impact") {
            const isNegative = entry.value < 0;
            return (
              <p key={`item-${index}`} style={{ margin: '0.25rem 0', color: isNegative ? '#10b981' : entry.color }}>
                {`${entry.name}: ${formatCurrency(Math.abs(entry.value))} ${isNegative ? '(benefit)' : '(loss)'}`}
              </p>
            );
          }

          return (
            <p key={`item-${index}`} style={{ margin: '0.25rem 0', color: entry.color }}>
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

const InvestmentChart = ({ data, startYear }) => {
  // Get the initial view from URL or default to 'wealth'
  const getInitialView = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('view') === 'mortgage' ? 'mortgage' : 'wealth';
  };

  const [chartView, setChartView] = useState(getInitialView());

  // Update URL when chart view changes
  useEffect(() => {
    const url = new URL(window.location);
    url.searchParams.set('view', chartView);
    window.history.pushState({}, '', url);
  }, [chartView]);

  // Format data for the chart
  const chartData = data.map(item => ({
    year: item.year,
    // Wealth data
    "Net Worth": item.netWorth,
    "Real Net Worth": item.realNetWorth,
    "Inflation Impact": item.inflationImpact,
    "Investments": item.investmentValue,
    // Mortgage data
    "Mortgage Remaining": item.mortgageRemaining,
    "Mortgage Payment": item.mortgagePayment,
    "Interest Paid": item.year > 0 ? item.mortgageInterestPaid - (data[item.year - 1]?.mortgageInterestPaid || 0) : 0,
    "Principal Paid": item.year > 0 ? item.mortgagePrincipalPaid - (data[item.year - 1]?.mortgagePrincipalPaid || 0) : 0,
    "Total Interest Paid": item.mortgageInterestPaid,
    "Total Principal Paid": item.mortgagePrincipalPaid
  }));

  return (
    <ChartContainer>
      <ChartTitle>Financial Projection</ChartTitle>
      <ChartSubtitle>
        See how your investments grow over time and the impact of your mortgage
      </ChartSubtitle>

      <ChartOptions>
        <ToggleButton
          active={chartView === 'wealth'}
          onClick={() => setChartView('wealth')}
        >
          Wealth Growth
        </ToggleButton>
        <ToggleButton
          active={chartView === 'mortgage'}
          onClick={() => setChartView('mortgage')}
        >
          Mortgage Breakdown
        </ToggleButton>
      </ChartOptions>

      <ResponsiveContainer width="100%" height={400}>
        {chartView === 'wealth' ? (
          <ComposedChart
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
            <Tooltip content={<CustomTooltip startYear={startYear} />} />
            <Legend />
            <ReferenceLine y={0} stroke="#64748b" />

            <Line
              type="monotone"
              dataKey="Net Worth"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8 }}
              name="Net Worth (Nominal)"
            />

            <Line
              type="monotone"
              dataKey="Real Net Worth"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8 }}
              name="Real Net Worth (Today's Money)"
            />

            {/* Use defs and pattern to create different styles for positive/negative values */}
            <defs>
              <linearGradient id="inflationLossGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#fca5a5" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="inflationBenefitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#a7f3d0" stopOpacity={0.3} />
              </linearGradient>
            </defs>

            {/* Use two areas to show loss and benefit with different colors */}
            <Area
              type="monotone"
              dataKey={(dataPoint) => dataPoint["Inflation Impact"] > 0 ? dataPoint["Inflation Impact"] : 0}
              fill="url(#inflationLossGradient)"
              stroke="#ef4444"
              fillOpacity={0.3}
              name="Inflation Loss"
            />

            <Area
              type="monotone"
              dataKey={(dataPoint) => dataPoint["Inflation Impact"] < 0 ? -dataPoint["Inflation Impact"] : 0}
              fill="url(#inflationBenefitGradient)"
              stroke="#10b981"
              fillOpacity={0.3}
              name="Inflation Benefit"
            />

            <Line
              type="monotone"
              dataKey="Investments"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="Mortgage Remaining"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        ) : (
          <ComposedChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="year"
              label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis
              yAxisId="left"
              tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
              label={{ value: 'Amount (£)', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(value) => `£${value.toLocaleString()}`}
              label={{ value: 'Monthly Payment (£)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip content={<CustomTooltip startYear={startYear} />} />
            <Legend />

            <Area
              yAxisId="left"
              type="monotone"
              dataKey="Mortgage Remaining"
              fill="#fca5a5"
              stroke="#ef4444"
              fillOpacity={0.3}
              name="Mortgage Balance"
            />

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Mortgage Payment"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
              name="Monthly Payment"
            />

            <Bar
              yAxisId="left"
              dataKey="Interest Paid"
              barSize={20}
              fill="#fcd34d"
              name="Yearly Interest"
              stackId="a"
            />

            <Bar
              yAxisId="left"
              dataKey="Principal Paid"
              barSize={20}
              fill="#4ade80"
              name="Yearly Principal"
              stackId="a"
            />
          </ComposedChart>
        )}
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default InvestmentChart; 