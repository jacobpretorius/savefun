import React from 'react';
import styled from 'styled-components';

const Form = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  background-color: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FormSection = styled.div`
  grid-column: 1 / -1;
  margin-top: ${props => props.first ? '0' : '1.5rem'};
  margin-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #4b5563;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const InputPrefix = styled.div`
  position: relative;
  width: 100%;
  
  &::before {
    content: "${props => props.prefix}";
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
    z-index: 1;
  }
  
  input {
    padding-left: ${props => props.prefix ? '1.75rem' : '0.75rem'};
    width: 100%;
  }
`;

const InputSuffix = styled.div`
  position: relative;
  width: 100%;
  
  &::after {
    content: "${props => props.suffix}";
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
    z-index: 1;
    pointer-events: none;
  }
  
  input {
    padding-right: ${props => props.suffix ? '1.75rem' : '0.75rem'};
    width: 100%;
  }
`;

const MortgageCalculation = styled.div`
  grid-column: 1 / -1;
  background-color: #f0f9ff;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 0.5rem;
  border-left: 4px solid #3b82f6;
`;

const MortgagePayment = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
`;

const InputForm = ({ values, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: parseFloat(value) || 0 });
  };

  // Calculate monthly mortgage payment
  const calculateMonthlyMortgagePayment = () => {
    const P = values.mortgageBalance; // Principal
    const r = (values.mortgageInterestRate / 100) / 12; // Monthly interest rate
    const n = values.mortgageTerm * 12; // Total number of payments

    if (r === 0 || n === 0) return 0;

    // Monthly payment formula: P * (r * (1 + r)^n) / ((1 + r)^n - 1)
    const monthlyPayment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(monthlyPayment);
  };

  const monthlyMortgagePayment = calculateMonthlyMortgagePayment();

  return (
    <Form>
      <FormSection first>
        <SectionTitle>Investments</SectionTitle>
      </FormSection>

      <InputGroup>
        <Label htmlFor="currentInvestments">Current Investments</Label>
        <InputPrefix prefix="£">
          <Input
            type="number"
            id="currentInvestments"
            name="currentInvestments"
            value={values.currentInvestments}
            onChange={handleChange}
            min="0"
            step="100"
          />
        </InputPrefix>
      </InputGroup>

      <InputGroup>
        <Label htmlFor="monthlySavings">Monthly Savings</Label>
        <InputPrefix prefix="£">
          <Input
            type="number"
            id="monthlySavings"
            name="monthlySavings"
            value={values.monthlySavings}
            onChange={handleChange}
            min="0"
            step="10"
          />
        </InputPrefix>
      </InputGroup>

      <InputGroup>
        <Label htmlFor="returnRate">Annual Return Rate</Label>
        <InputSuffix suffix="%">
          <Input
            type="number"
            id="returnRate"
            name="returnRate"
            value={values.returnRate}
            onChange={handleChange}
            min="0"
            max="30"
            step="0.1"
          />
        </InputSuffix>
      </InputGroup>

      <FormSection>
        <SectionTitle>Mortgage</SectionTitle>
      </FormSection>

      <InputGroup>
        <Label htmlFor="mortgageBalance">Mortgage Balance</Label>
        <InputPrefix prefix="£">
          <Input
            type="number"
            id="mortgageBalance"
            name="mortgageBalance"
            value={values.mortgageBalance}
            onChange={handleChange}
            min="0"
            step="1000"
          />
        </InputPrefix>
      </InputGroup>

      <InputGroup>
        <Label htmlFor="mortgageInterestRate">Mortgage Interest Rate</Label>
        <InputSuffix suffix="%">
          <Input
            type="number"
            id="mortgageInterestRate"
            name="mortgageInterestRate"
            value={values.mortgageInterestRate}
            onChange={handleChange}
            min="0"
            max="20"
            step="0.1"
          />
        </InputSuffix>
      </InputGroup>

      <InputGroup>
        <Label htmlFor="mortgageTerm">Mortgage Term (Years)</Label>
        <Input
          type="number"
          id="mortgageTerm"
          name="mortgageTerm"
          value={values.mortgageTerm}
          onChange={handleChange}
          min="1"
          max="40"
          step="1"
        />
      </InputGroup>

      <MortgageCalculation>
        <Label>Monthly Mortgage Payment</Label>
        <MortgagePayment>£{monthlyMortgagePayment.toLocaleString()}</MortgagePayment>
      </MortgageCalculation>

      <FormSection>
        <SectionTitle>Economic Factors</SectionTitle>
      </FormSection>

      <InputGroup>
        <Label htmlFor="inflationRate">Inflation Rate</Label>
        <InputSuffix suffix="%">
          <Input
            type="number"
            id="inflationRate"
            name="inflationRate"
            value={values.inflationRate}
            onChange={handleChange}
            min="0"
            max="20"
            step="0.1"
          />
        </InputSuffix>
      </InputGroup>

      <InputGroup>
        <Label htmlFor="years">Years to Project</Label>
        <Input
          type="number"
          id="years"
          name="years"
          value={values.years}
          onChange={handleChange}
          min="1"
          max="50"
          step="1"
        />
      </InputGroup>

      <InputGroup>
        <Label htmlFor="startYear">Starting Year</Label>
        <Input
          type="number"
          id="startYear"
          name="startYear"
          value={values.startYear}
          onChange={handleChange}
          min="2000"
          max="2999"
          step="1"
        />
      </InputGroup>
    </Form>
  );
};

export default InputForm; 