const calculateCost = (loanAmount, interest, loanTermYears) => {
  // Assuming compounded monthly
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const monthlyInterestRate = (interest * 0.01) / 12;
  const numberOfPayments = loanTermYears * 12;
  const monthlyPayment =
    (loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  const totalCost = monthlyPayment * numberOfPayments;

  return formatter.format(totalCost);
};

export default calculateCost;
