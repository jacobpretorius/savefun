import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import InputForm from './components/InputForm';
import InvestmentChart from './components/InvestmentChart';
import Summary from './components/Summary';
import { calculateInvestmentGrowth } from './utils/calculations';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #6b7280;
`;

function App() {
  const [formValues, setFormValues] = useState({
    currentInvestments: 10000,
    monthlySavings: 500,
    currentDebts: 5000,
    returnRate: 7,
    inflationRate: 2,
    years: 15
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const data = calculateInvestmentGrowth(formValues);
    setChartData(data);
  }, [formValues]);

  const handleInputChange = (newValues) => {
    setFormValues({
      ...formValues,
      ...newValues
    });
  };

  return (
    <AppContainer>
      <Header>
        <Title>SaveFun</Title>
        <Subtitle>Visualize your wealth growth over time</Subtitle>
      </Header>

      <InputForm values={formValues} onChange={handleInputChange} />

      <InvestmentChart data={chartData} />

      <Summary data={chartData} formValues={formValues} />
    </AppContainer>
  );
}

export default App; 