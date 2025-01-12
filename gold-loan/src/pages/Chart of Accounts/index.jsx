import React, { useState } from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Grid, Typography, Paper } from '@mui/material';

const ChartsOfAccounts = () => {
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [inputs, setInputs] = useState({
        description: '',
        rate: '',
        period: ''
    });

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setSubcategory('');
    };

    const handleSubcategoryChange = (e) => {
        setSubcategory(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs({ ...inputs, [name]: value });
    };

    const subcategories = {
        Assets: ['Fixed Assets', 'Stocks', 'Sundry', 'Bank'],
        Liabilities: ['Current Capital', 'Sundry Creditors', 'Fixed Capital', 'Loan and Advances', 'Repledge', '100'],
        Income: [],
        Expense: [],
        Trading: ['Purchases', 'Purchases Return', 'Sales', 'Sales Return', 'Interest Receivable', 'Interest Payable', 'Pre-Paid']
    };

    const renderSubcategories = () => (
        <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Subcategory</InputLabel>
            <Select
                value={subcategory}
                onChange={handleSubcategoryChange}
                label="Subcategory"
                size="small"
            >
                <MenuItem value="">Select Subcategory</MenuItem>
                {subcategories[category]?.map((item, index) => (
                    <MenuItem key={index} value={item}>{item}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );

    const renderInputData = () => (
        <>
            <Typography variant="h6" style={{ marginTop: '20px' }}>Input Data</Typography>
            <table style={{ width: '100%' }}>
                <tbody>
                    <tr>
                        <td><Typography>Description</Typography></td>
                        <td>
                            <TextField
                                variant="outlined"
                                fullWidth
                                size="small"
                                name="description"
                                value={inputs.description}
                                onChange={handleInputChange}
                                style={{ marginBottom: '10px' }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td><Typography>Rate</Typography></td>
                        <td>
                            <TextField
                                variant="outlined"
                                fullWidth
                                type="number"
                                size="small"
                                name="rate"
                                value={inputs.rate}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    {subcategory === 'Fixed Assets' && (
                        <tr>
                            <td><Typography>Period</Typography></td>
                            <td>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="period"
                                    value={inputs.period}
                                    onChange={handleInputChange}
                                />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <Paper elevation={3} style={{ width: '600px', padding: '20px', borderRadius: '8px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" align="center">Choose Category</Typography>
                        <FormControl fullWidth variant="outlined" margin="normal">
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={category}
                                onChange={handleCategoryChange}
                                label="Category"
                                size="small"
                            >
                                <MenuItem value="">Select Category</MenuItem>
                                <MenuItem value="Assets">Assets</MenuItem>
                                <MenuItem value="Liabilities">Liabilities</MenuItem>
                                <MenuItem value="Income">Income</MenuItem>
                                <MenuItem value="Expense">Expense</MenuItem>
                                <MenuItem value="Trading">Trading</MenuItem>
                            </Select>
                        </FormControl>

                        {(category === 'Income' || category === 'Expense') && renderInputData()}
                        {(category && category !== 'Income' && category !== 'Expense') && renderSubcategories()}

                        {subcategory && category !== 'Income' && category !== 'Expense' && renderInputData()}
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper elevation={1} style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#f5f5f5' }}>
                            <Typography variant="h6" align="center">Entered Data</Typography>
                            <p><strong>Category:</strong> {category}</p>
                            <p><strong>Subcategory:</strong> {subcategory}</p>
                            <p><strong>Description:</strong> {inputs.description}</p>
                            <p><strong>Rate:</strong> {inputs.rate}</p>
                            {subcategory === 'Fixed Assets' && <p><strong>Period:</strong> {inputs.period}</p>}
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
};

export default ChartsOfAccounts;
