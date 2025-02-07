import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Select,
  MenuItem,
} from "@mui/material";
import "./App.css";

import Grid from "@mui/material/Grid2";

const MonthlyCostCalculator = () => {
  const [qsr, setQsr] = useState({
    noOfEmployees: 2,
    employeeSalary_Hourly: 17.2,
    hoursOfOperation_Daily: 12,
    sales_Daily: 1500,
    rent_Monthly: 5000,
    utility_Monthly: 1000,
    mortgageAmountOverall: 300000,
    mortgagePercentage: 5,
    mortgage_Months: 72,
    mortgage_Monthly: 0,
    royalty_Percentage: 5,
    ad_Percentage: 3,
    permit: 7500,
    sales_yearly: 0,
  });

  useEffect(() => {
    const savedInput = localStorage.getItem("saved_inputs");
    if (savedInput !== null) {
      setQsr(JSON.parse(savedInput));
    }
  }, []);

  const [output, setOutput] = useState({
    foodCost_Yearly: 0,
    labour_Yearly: 0,
    royalty_Yearly: 0,
    adFee_Yearly: 0,
    rent_Yearly: 0,
    utilities_Yearly: 0,
    accounting_Yearly: 5000,
    insurance_Yearly: 2500,
    wasteDisposal_Yearly: 3000,
    maintenance_Yearly: 3000,
    phoneAndInternet_Yearly: 3000,
    operationCost_Yearly: null,
    profit_Yearly: null,
    mortgage_Yearly: null,
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setQsr({
      ...qsr,
      [id]: parseFloat(value),
    });
  };

  // Mortgage calculation function
  const calculateMortgage_Monthly = () => {
    const monthlyRate = qsr.mortgagePercentage / 100 / 12;
    const mortgage_Monthly =
      (qsr.mortgageAmountOverall * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -qsr.mortgage_Months));
    return parseFloat(mortgage_Monthly.toFixed(2));
  };

  const calcEmploymentCost_Yearly = (noOfHoursADay, noOfPeople) => {
    return (
      qsr.hoursOfOperation_Daily *
      qsr.noOfEmployees *
      qsr.employeeSalary_Hourly *
      365
    );
  };

  const calcFoodCost_Yearly = (monthlySales) => {
    // 0.35 is the average cost of ingediends and wastage
    return qsr.sales_Daily * 365 * 0.35;
  };

  const calcProfit_Yearly = (operationCost) => {
    return qsr.sales_Daily * 365 - operationCost;
  };

  const calcOperationCost_Year = (yearlySales) => {
    const mortgage = calculateMortgage_Monthly() * 12;
    const utilityCost = qsr.utility_Monthly * 12;
    const rentCost = qsr.rent_Monthly * 12;
    return (
      // Food Cost
      calcFoodCost_Yearly() +
      // Labour Cost
      calcEmploymentCost_Yearly() +
      // Royalty
      (qsr.royalty_Percentage * yearlySales) / 100 +
      // Advertising Fee
      (qsr.ad_Percentage * yearlySales) / 100 +
      // Utilities
      utilityCost +
      // Rent
      rentCost +
      // Mortgage
      mortgage +
      // Insurance
      output.insurance_Yearly +
      // Accounting
      output.accounting_Yearly +
      // Waste Disposal
      output.wasteDisposal_Yearly +
      // Maintenance
      output.maintenance_Yearly +
      // Internet
      output.phoneAndInternet_Yearly
    );
  };

  const saveInput = () => {
    localStorage.setItem("saved_inputs", JSON.stringify(qsr));
  };

  const handleSelectChange = (event) => {
    setQsr((prev) => ({
      ...prev,
      mortgage_Months: event.target.value,
    }));
  };

  const handleCalculate = () => {
    const yearlySales = qsr.sales_Daily * 365;
    const operationCost = calcOperationCost_Year(yearlySales);
    const mortgage_Monthly = calculateMortgage_Monthly();
    const profit_Yearly = calcProfit_Yearly(operationCost);

    setQsr((prevOutput) => ({
      ...prevOutput,
      mortgage_Monthly: mortgage_Monthly,
      sales_yearly: yearlySales,
    }));

    setOutput((prevOutput) => ({
      ...prevOutput,
      rent_Yearly: qsr.rent_Monthly * 12,
      utilities_Yearly: qsr.utility_Monthly,
      foodCost_Yearly: calcFoodCost_Yearly(),
      labour_Yearly: calcEmploymentCost_Yearly(),
      operationCost_Yearly: operationCost,
      profit_Yearly: profit_Yearly,
      mortgage_Yearly: mortgage_Monthly * 12,
      royalty_Yearly: (qsr.royalty_Percentage * yearlySales) / 100,
      adFee_Yearly: (qsr.ad_Percentage * yearlySales) / 100,
    }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <div className="container">
      <h1>Monthly Cost Calculator</h1>
      <form>
        <Grid container spacing={2} justifyContent={"center"}>
          {/* Number of Employees */}
          <Grid size={{ xs: 6, md: 4 }}>
            <TextField
              label="Number of Employees"
              type="number"
              id="noOfEmployees"
              value={qsr.noOfEmployees}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>

          {/* Employee Salary */}
          <Grid size={{ xs: 6, md: 4 }}>
            <TextField
              label="Salary per hour"
              type="number"
              id="employeeSalary_Hourly"
              value={qsr.employeeSalary_Hourly}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>

          {/* Number of Hours of Operation */}
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              label="No of hours of operation per day"
              type="number"
              id="hoursOfOperation_Daily"
              value={qsr.hoursOfOperation_Daily}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>

          {/* Daily Sales */}
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              label="Daily Sales ($)"
              type="number"
              id="sales_Daily"
              value={qsr.sales_Daily}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>

          {/* Royalty Percentage */}
          <Grid size={{ xs: 6, md: 4 }}>
            <TextField
              label="Royalty (%)"
              type="number"
              id="royalty_Percentage"
              value={qsr.royalty_Percentage}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>

          {/* Daily Sales */}
          <Grid size={{ xs: 6, md: 4 }}>
            <TextField
              label="Ad Fee (%)"
              type="number"
              id="ad_Percentage"
              value={qsr.ad_Percentage}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>

          {/* Monthly Rent */}
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              label="Monthly Rent ($)"
              type="number"
              id="rent_Monthly"
              value={qsr.rent_Monthly}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>

          {/* Monthly Utilities */}
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              label="Monthly Utilities ($)"
              type="number"
              id="utility_Monthly"
              value={qsr.utility_Monthly}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>

          {/* Mortgage Amount */}
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              label="Overall mortgage amount ($)"
              type="number"
              id="mortgageAmountOverall"
              value={qsr.mortgageAmountOverall}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>

          {/* Mortgage Percentage */}
          <Grid size={{ xs: 6, md: 4 }}>
            <TextField
              label="Mortgage percentage (%)"
              type="number"
              id="mortgagePercentage"
              value={qsr.mortgagePercentage}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>

          {/* Mortgage Period */}
          <Grid size={{ xs: 6, md: 4 }}>
            <Select
              labelId="mortgage_Months"
              id="mortgage_Months"
              value={qsr.mortgage_Months}
              label="Mortgage period"
              onChange={handleSelectChange}
            >
              <MenuItem value={72}>72 (6 years)</MenuItem>
              <MenuItem value={84}>84 (7 years)</MenuItem>
              <MenuItem value={96}>96 (8 years)</MenuItem>
              <MenuItem value={108}>108 (9 years)</MenuItem>
              <MenuItem value={120}>120 (10 years)</MenuItem>
            </Select>
          </Grid>

          {/* Calculate Button */}
          <Grid size={{ xs: 8, md: 6 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCalculate}
              fullWidth
            >
              Calculate
            </Button>
          </Grid>

          {/* Calculate Button */}
          <Grid size={{ xs: 4, md: 2 }}>
            <Button
              variant="outlined"
              color="info"
              onClick={saveInput}
              fullWidth
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Display the results in a table after calculation */}
      {output.operationCost_Yearly !== null && (
        <TableContainer component={Paper} sx={{ marginTop: 3 }}>
          <Table>
            <TableBody>
              {/* Sales */}
              <TableRow>
                <TableCell>Sales</TableCell>
                <TableCell align="right">
                  {formatCurrency(qsr.sales_yearly)}
                </TableCell>
              </TableRow>

              {/* Food cost */}
              <TableRow>
                <TableCell>Food cost</TableCell>
                <TableCell align="right">
                  {formatCurrency(output.foodCost_Yearly)}
                </TableCell>
              </TableRow>

              {/* Labour cost */}
              <TableRow>
                <TableCell>Labour cost</TableCell>
                <TableCell align="right">
                  {formatCurrency(output.labour_Yearly)}
                </TableCell>
              </TableRow>

              {/* Mortgage */}
              <TableRow>
                <TableCell>Mortgage</TableCell>
                <TableCell align="right">
                  {formatCurrency(output.mortgage_Yearly)}
                </TableCell>
              </TableRow>

              {/* Royalty */}
              <TableRow>
                <TableCell>Royalty</TableCell>
                <TableCell align="right">
                  {formatCurrency(output.royalty_Yearly)}
                </TableCell>
              </TableRow>

              {/* Ad Fee */}
              <TableRow>
                <TableCell>Advertising fee</TableCell>
                <TableCell align="right">
                  {formatCurrency(output.adFee_Yearly)}
                </TableCell>
              </TableRow>

              {/* Rent */}
              <TableRow>
                <TableCell>Rent</TableCell>
                <TableCell align="right">
                  {formatCurrency(output.rent_Yearly)}
                </TableCell>
              </TableRow>

              {/* Utilities */}
              <TableRow>
                <TableCell>Utilities</TableCell>
                <TableCell align="right">
                  {formatCurrency(output.utilities_Yearly)}
                </TableCell>
              </TableRow>

              {/* Accounting */}
              <TableRow>
                <TableCell>Accounting</TableCell>
                <TableCell align="right">
                  {formatCurrency(output.accounting_Yearly)}
                </TableCell>
              </TableRow>

              {/* Insurance */}
              <TableRow>
                <TableCell>Insurance</TableCell>
                <TableCell align="right">
                  {formatCurrency(output.insurance_Yearly)}
                </TableCell>
              </TableRow>

              {/* Waste Disposal */}
              <TableRow>
                <TableCell>Waste disposal</TableCell>
                <TableCell align="right">
                  {formatCurrency(output.wasteDisposal_Yearly)}
                </TableCell>
              </TableRow>

              {/* Maintenance */}
              <TableRow>
                <TableCell>Maintenance</TableCell>
                <TableCell align="right">
                  {formatCurrency(output.maintenance_Yearly)}
                </TableCell>
              </TableRow>

              {/* Phone and Internet */}
              <TableRow>
                <TableCell>Phone and internet</TableCell>
                <TableCell align="right">
                  {formatCurrency(output.phoneAndInternet_Yearly)}
                </TableCell>
              </TableRow>

              {/* Profit */}
              <TableRow>
                <TableCell>Estimated Profit</TableCell>
                <TableCell align="right">
                  {formatCurrency(output.profit_Yearly)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default MonthlyCostCalculator;
