import React, { useState } from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Grid, Typography, Paper, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { chart } from '../../services/accounts/account.service'
const ChartsOfAccounts = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [inputs, setInputs] = useState({
        accountName: '',
        description: '',
        credit: '0',
        debit: '0',
        depreciationRateTwo: '',
        depreciationRateOne: ''
    });
    const [openModal, setOpenModal] = useState(false);

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

    const handleModalOpen = () => {
        setOpenModal(true);
    };

    const handleModalClose = () => {
        setOpenModal(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Add your submit logic here
        console.log(subcategory);
        console.log(category);
        setLoading(true);
        setError(null);
        try {

            const response = await chart(inputs.accountName, inputs.credit, inputs.debit, inputs.depreciationRateOne, inputs.depreciationRateTwo, category, subcategory);

            if (response?.isError) {
                setError('Login failed. Please check your credentials or try again later.');
                console.log(response.message);

                return;
            }
            alert(response.message);
        } catch (error) {
            setError('Login failed. Please check your credentials or try again later.');
        } finally {
            setLoading(false);
        }
        setOpenModal(false);  // Close the modal after submit
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
            <Typography variant="h6" style={{ marginTop: '20px' }}>Balance</Typography>
            <table style={{ width: '100%' }}>
                <tbody>
                    <tr>
                        <td><Typography>Debit</Typography></td>
                        <td>
                            <TextField
                                variant="outlined"
                                fullWidth
                                size="small"
                                name="debit"
                                value={inputs.debit}
                                onChange={handleInputChange}
                                style={{ marginBottom: '10px' }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td><Typography>Credit</Typography></td>
                        <td>
                            <TextField
                                variant="outlined"
                                fullWidth
                                type="number"
                                size="small"
                                name="credit"
                                value={inputs.credit}
                                onChange={handleInputChange}
                            />
                        </td>
                    </tr>
                    {subcategory === 'Fixed Assets' && (
                        <>
                            <tr>
                                <td><Typography>Description Rate</Typography></td>
                                <td>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        name="depreciationRateOne"
                                        value={inputs.depreciationRateOne}
                                        onChange={handleInputChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td><Typography>Description Rate 2</Typography></td>
                                <td>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        name="depreciationRateTwo"
                                        value={inputs.depreciationRateTwo}
                                        onChange={handleInputChange}
                                    />
                                </td>
                            </tr>
                        </>
                    )}
                </tbody>
            </table>
        </>
    );

    return (



        <div >

            <Typography variant="body1" onClick={handleModalOpen} sx={{ fontSize: '17px', mt: 1 }}>
                Chart
            </Typography>
            <Dialog open={openModal} onClose={handleModalClose} fullWidth maxWidth="md">
                <DialogTitle>Chart of Account</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Name"
                                variant="outlined"
                                fullWidth
                                size="small"
                                name="accountName"
                                value={inputs.accountName}
                                onChange={handleInputChange}
                                margin="normal"
                            />
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
                            <Paper elevation={1} style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#f5f5f5', marginTop: '13px' }}>
                                <Typography variant="h6" align="center">Entered Data</Typography>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '8px', fontWeight: 'bold' }}>Name:</td>
                                            <td style={{ padding: '8px' }}>{inputs.accountName}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '8px', fontWeight: 'bold' }}>Category:</td>
                                            <td style={{ padding: '8px' }}>{category}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '8px', fontWeight: 'bold' }}>Subcategory:</td>
                                            <td style={{ padding: '8px' }}>{subcategory}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '8px', fontWeight: 'bold' }}>Description:</td>
                                            <td style={{ padding: '8px' }}>{inputs.description}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '8px', fontWeight: 'bold' }}>Rate:</td>
                                            <td style={{ padding: '8px' }}>{inputs.credit}</td>
                                        </tr>
                                        {subcategory === 'Fixed Assets' && (
                                            <>
                                                <tr>
                                                    <td style={{ padding: '8px', fontWeight: 'bold' }}>Period:</td>
                                                    <td style={{ padding: '8px' }}>{inputs.debit}</td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </Paper>
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>

    );
};

export default ChartsOfAccounts;
