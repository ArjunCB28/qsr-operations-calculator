const calculateMonthlyCost = () => {
  const noOfEmployees = parseFloat(
    document.getElementById("noOfEmployees").value
  );
  const noOfHoursOfOperation = parseFloat(
    document.getElementById("noOfHoursOfOperation").value
  );
  const dailySales = parseFloat(document.getElementById("dailySales").value);
  const rentMonthly = parseFloat(document.getElementById("rentMonthly").value);
  const utilityMonthly = parseFloat(
    document.getElementById("utilityMonthly").value
  );
  const mortgage = parseFloat(document.getElementById("mortgage").value);
  const permit = parseFloat(document.getElementById("permit").value);
  const insurance = parseFloat(document.getElementById("insurance").value);

  const calcPermitLicenceMonthly = () => {
    return (permit + insurance) / 12;
  };

  const calcEmploymentCostAMonth = (noOfHoursADay, noOfPeople) => {
    return noOfHoursADay * noOfPeople * 18 * 30;
  };

  const calcInventoryAMonth = (monthlySales) => {
    return monthlySales * 0.35;
  };

  const calcMonthlyProfit = (monthlySales, operationCost) => {
    return monthlySales - operationCost;
  };

  const calcMonthlyOperationCost = () => {
    return (
      calcEmploymentCostAMonth(noOfHoursOfOperation, noOfEmployees) +
      calcInventoryAMonth(dailySales * 30) +
      utilityMonthly +
      rentMonthly +
      calcPermitLicenceMonthly() +
      mortgage
    );
  };

  const operationCost = calcMonthlyOperationCost();
  const profit = calcMonthlyProfit(dailySales * 30, operationCost);
  document.getElementById(
    "operationCost"
  ).textContent = `Monthly operation cost: $${operationCost.toFixed(2)}`;
  document.getElementById(
    "monthlyProfit"
  ).textContent = `Monthly estimated profit: $${profit.toFixed(2)}`;
};
