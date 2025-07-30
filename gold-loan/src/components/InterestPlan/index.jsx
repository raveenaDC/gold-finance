import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  TextField,
  Typography,
  MenuItem,
  Grid,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const plans = ['Daily', 'Weekly', 'Quarterly', 'Monthly', 'Half-Yearly', 'Yearly'];
const types = ['Simple', 'compound'];

const InterestPlansModal = () => {
  const [open, setOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [interestRates, setInterestRates] = useState({});
  const [interestPlanName, setInterestPlaneName] = useState('');
  const [interestType, setInterestType] = useState('');
  const [interest, setInterest] = useState('');
  const [formData, setFormData] = useState({
    minimumDays: '',
    minimumAmount: '',

  });

  // Other Details
  const [planName, setPlanName] = useState('');
  const [customPlans, setCustomPlans] = useState([]);
  const [customDays, setCustomDays] = useState('');
  const [customAmount, SetCustomAmount] = useState('');


  const [customRows, setCustomRows] = useState([
    { from: '', to: '', percentage: '' }
  ]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  // const handleRateChange = (e) => {
  //   const rate = e.target.value;
  //   setInterestRates((prev) => ({
  //     ...prev,
  //     [selectedPlan]: rate
  //   }));
  // };

  const handleInterestSubmit = () => {
    console.log("Submitted Interest Rates:", interestRates);
    alert("Interest rates submitted successfully!");
  };

  const handleCustomChange = (index, field, value) => {
    const updatedRows = [...customRows];
    updatedRows[index][field] = value;
    setCustomRows(updatedRows);
  };

  const addCustomRow = () => {
    setCustomRows([...customRows, { from: '', to: '', percentage: '' }]);
  };

  const removeCustomRow = (index) => {
    const updatedRows = customRows.filter((_, i) => i !== index);
    setCustomRows(updatedRows);
  };

  const handleCustomSubmit = () => {
    if (!planName) {
      alert("Please enter a plan name.");
      return;
    }
    const newEntry = { name: planName, details: customRows, days: customDays, amount: customAmount };
    setCustomPlans([...customPlans, newEntry]);
    console.log("Custom Plans Saved:", [...customPlans, newEntry]);
    setPlanName('');
    SetCustomAmount('');
    setCustomDays('');
    setCustomRows([{ from: '', to: '', percentage: '' }]);
    alert("Custom plan saved successfully!");
  };

  return (
    <div>

      <Typography variant="body2" onClick={handleOpen}>
        Interest Plans
      </Typography>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>INTEREST PLANS</DialogTitle>
        <DialogContent>
          <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Basic Plans" />
            <Tab label="Advanced Plans" />
          </Tabs>

          {tabIndex === 0 && (
            <Box>
              <Typography>Select Interest Plan:</Typography>
              <TextField
                fullWidth
                label="Plan Name"
                value={interestPlanName}
                onChange={(e) => setInterestPlaneName(e.target.value)}
                sx={{ mt: 2, width: 400, mr: 2 }}
                size='small'
              />
              {/* <TextField
                fullWidth
                label={"Interest Rate "}
                value={interestRates[selectedPlan] || ''}
                onChange={handleRateChange}
                size='small'
                sx={{ mt: 2, width: 400 }}
              /> */}
              <TextField
                fullWidth
                label="Interest Rate"
                type="number"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                sx={{ mt: 2, width: 400, mr: 2 }}
                size='small'
              />

              <TextField
                select
                fullWidth
                label="Interest Plan"
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                sx={{ mt: 2, width: 400, mr: 2 }}
                size='small'
              >
                {plans.map((plan) => (
                  <MenuItem key={plan} value={plan}  >
                    {plan}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                label="Interest Type"
                value={interestType}
                onChange={(e) => setInterestType(e.target.value)}
                sx={{ mt: 2, width: 400 }}
                size='small'
              >
                {types.map((type) => (
                  <MenuItem key={type} value={type}  >
                    {type}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Minimum Days"
                type="number"
                value={formData.minimumDays}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, minimumDays: e.target.value }))
                }
                sx={{ mt: 2, width: 400, mr: 2 }}
                size='small'
              />

              <TextField
                fullWidth
                label="Minimum Amount"
                type="number"
                value={formData.minimumAmount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, minimumAmount: e.target.value }))
                }
                sx={{ mt: 2, width: 400, }}
                size='small'
              />





              {/* Display The Basic Plan */}

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6">Saved Interest Rates:</Typography>
                {interestPlanName && (
                  <Box>
                    <Box display="flex" mb={0}>
                      <Typography sx={{ width: 130, }}>Plan Name</Typography>
                      <Typography>: {interestPlanName}</Typography>
                    </Box>
                    <Box display="flex">
                      <Typography sx={{ width: 130, }}>Interest Rates</Typography>
                      <Typography> : {interest && !String(interest).includes('%') ? `${interest}%` : interest}  </Typography>
                    </Box>
                    <Box display="flex">
                      <Typography sx={{ width: 130, }}>Interest Plan</Typography>
                      <Typography>: {selectedPlan}</Typography>
                    </Box>
                    <Box display="flex">
                      <Typography sx={{ width: 130, }}>Interest Type</Typography>
                      <Typography>: {interestType}</Typography>
                    </Box>
                    <Box display="flex">
                      <Typography sx={{ width: 130, }}>Minimum Days</Typography>
                      <Typography>: {formData.minimumDays}</Typography>
                    </Box>
                    <Box display="flex">
                      <Typography sx={{ width: 130, }}>Minimum Amount</Typography>
                      <Typography>: {formData.minimumAmount}</Typography>
                    </Box>
                  </Box>

                )}

                {/* <ul>

                  {Object.entries(interestRates).map(([plan, rate]) => (
                    <li key={plan}>
                      {plan}: {rate}%
                    </li>
                  ))}
                </ul> */}

              </Box>

              <Button
                variant="contained"
                color="success"
                onClick={handleInterestSubmit}
                sx={{ mt: 2 }}
                size='small'
              >
                Submit Interest Rates
              </Button>
            </Box>
          )}

          {tabIndex === 1 && (
            <Box>
              <Typography variant="h6">Create New Interest Plan</Typography>

              <TextField
                fullWidth
                label="Plan Name"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                size='small'
                sx={{ mt: 2, mb: 0, width: 250 }}
              />

              {customRows.map((row, index) => (
                <Grid container spacing={2} key={index} alignItems="center" sx={{ mt: index !== 0 ? 0 : 0 }}>
                  <Grid item xs={3}>
                    <TextField
                      label="From Days"
                      type="number"
                      fullWidth
                      value={row.from}
                      size='small'
                      onChange={(e) =>
                        handleCustomChange(index, 'from', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="To Days"
                      type="number"
                      fullWidth
                      size='small'
                      value={row.to}
                      onChange={(e) =>
                        handleCustomChange(index, 'to', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Percentage (%)"
                      type="number"
                      fullWidth
                      size='small'
                      value={row.percentage}
                      onChange={(e) =>
                        handleCustomChange(index, 'percentage', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={2}>

                    <IconButton onClick={() => removeCustomRow(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Box sx={{ mt: 1 }}>
                <Button onClick={addCustomRow} variant="outlined" sx={{ mt: 2 }} size='small'>
                  Add Row
                </Button>
              </Box>


              <TextField
                fullWidth
                label="minimum days"
                type="number"
                value={customDays}
                onChange={(e) => setCustomDays(e.target.value)}
                size='small'
                sx={{ mt: 2, mb: 2, mr: 2, width: 200 }}
              />

              <TextField
                fullWidth
                label="minimum Amount"
                type="number"
                value={customAmount}
                onChange={(e) => SetCustomAmount(e.target.value)}
                size='small'
                sx={{ mt: 2, mb: 2, width: 200 }}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCustomSubmit}
                sx={{ mt: 2.5, ml: 2 }}
                size='small'
              >
                Submit Custom Plan
              </Button>

              {/* Display Saved Plans */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6">Saved Custom Plans:</Typography>
                {customPlans.map((plan, index) => (
                  <Box key={index} sx={{ mb: 2, pl: 2 }}>
                    <Typography fontWeight="bold">{plan.name}</Typography>

                    <ul>
                      {plan.details.map((d, i) => (
                        <li key={i}>
                          {d.from} to {d.to} days: {d.percentage}%
                        </li>
                      ))}
                    </ul>

                    <Box display="flex" mb={0}>
                      <Typography sx={{ width: 80, }}>Days</Typography>
                      <Typography>: {plan.days}</Typography>
                    </Box>
                    <Box display="flex" mb={0}>
                      <Typography sx={{ width: 80, }}>Amount</Typography>
                      <Typography>: {plan.amount}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InterestPlansModal;
