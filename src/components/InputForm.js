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

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const InputPrefix = styled.div`
  position: relative;
  
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
  }
`;

const InputSuffix = styled.div`
  position: relative;
  
  &::after {
    content: "${props => props.suffix}";
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
    z-index: 1;
  }
  
  input {
    padding-right: ${props => props.suffix ? '1.75rem' : '0.75rem'};
  }
`;

const InputForm = ({ values, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: parseFloat(value) || 0 });
  };

  return (
    <Form>
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
        <Label htmlFor="currentDebts">Current Debts</Label>
        <InputPrefix prefix="£">
          <Input
            type="number"
            id="currentDebts"
            name="currentDebts"
            value={values.currentDebts}
            onChange={handleChange}
            min="0"
            step="100"
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
    </Form>
  );
};

export default InputForm; 