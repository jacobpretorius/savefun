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

const ShareButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  margin: 1rem auto;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #2563eb;
  }
`;

const CopyConfirmation = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  background-color: #10b981;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  opacity: ${props => props.show ? '1' : '0'};
  transform: translateY(${props => props.show ? '0' : '-1rem'});
  transition: all 0.3s ease;
  z-index: 100;
`;

const defaultValues = {
  currentInvestments: 10000,
  monthlySavings: 500,
  mortgageBalance: 250000,
  mortgageInterestRate: 4.5,
  mortgageTerm: 25,
  returnRate: 7,
  inflationRate: 2,
  years: 30,
  startYear: new Date().getFullYear() // Current year as default
};

// Helper to parse URL parameters
const parseUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  const parsedValues = {};

  // Parse each parameter if it exists
  for (const key of Object.keys(defaultValues)) {
    if (params.has(key)) {
      parsedValues[key] = parseFloat(params.get(key));
    }
  }

  return parsedValues;
};

// Helper to update URL with current values
const updateUrlWithParams = (values) => {
  const url = new URL(window.location);

  // Add each parameter to the URL
  for (const [key, value] of Object.entries(values)) {
    url.searchParams.set(key, value);
  }

  // Update the URL without refreshing the page
  window.history.pushState({}, '', url);
};

function App() {
  // Get initial values from URL params or defaults
  const initialValues = { ...defaultValues, ...parseUrlParams() };

  const [formValues, setFormValues] = useState(initialValues);
  const [chartData, setChartData] = useState([]);
  const [showCopyConfirmation, setShowCopyConfirmation] = useState(false);

  // Calculate chart data when form values change
  useEffect(() => {
    const data = calculateInvestmentGrowth(formValues);
    setChartData(data);

    // Update URL when values change
    updateUrlWithParams(formValues);
  }, [formValues]);

  const handleInputChange = (newValues) => {
    setFormValues({
      ...formValues,
      ...newValues
    });
  };

  const handleShare = () => {
    // Copy the current URL to clipboard
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setShowCopyConfirmation(true);
        setTimeout(() => setShowCopyConfirmation(false), 3000);
      })
      .catch(err => {
        console.error('Failed to copy URL: ', err);
      });
  };

  return (
    <AppContainer>
      <CopyConfirmation show={showCopyConfirmation}>
        Link copied to clipboard!
      </CopyConfirmation>

      <Header>
        <Title>SaveFun</Title>
        <Subtitle>Visualize your wealth growth over time with mortgage impact</Subtitle>
      </Header>

      <InputForm values={formValues} onChange={handleInputChange} />

      <ShareButton onClick={handleShare}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
        </svg>
        Share Current Settings
      </ShareButton>

      <InvestmentChart data={chartData} startYear={formValues.startYear} />

      <Summary data={chartData} formValues={formValues} />
    </AppContainer>
  );
}

export default App; 