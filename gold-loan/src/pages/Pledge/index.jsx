import React, { useState } from 'react';
import { Box, Button, TextField, MenuItem, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const PledgeMasterPage = () => {
    const [pledges, setPledges] = useState([]);
    const [formData, setFormData] = useState({
        pledgeId: '',
        pledgerName: '',
        dateOfPledge: '',
        goldWeight: '',
        goldPurity: '24K',
        loanAmount: '',
        interestRate: '',
        loanDuration: '',
        maturityDate: '',
        remarks: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setPledges([...pledges, { ...formData, pledgeId: `P${pledges.length + 1}` }]);
        setFormData({
            pledgeId: '',
            pledgerName: '',
            dateOfPledge: '',
            goldWeight: '',
            goldPurity: '24K',
            loanAmount: '',
            interestRate: '',
            loanDuration: '',
            maturityDate: '',
            remarks: ''
        });
    };

    const textFieldStyle = {
        margin: '4px',
        width: '300px',
        '& .MuiInputBase-root': { fontSize: '12px' },
        '& .MuiInputLabel-root': { fontSize: '10px' }
    };

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h5" gutterBottom>Pledge Master Page</Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ marginBottom: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <TextField
                    label="Pledger Name"
                    name="pledgerName"
                    value={formData.pledgerName}
                    onChange={handleInputChange}
                    size='small'

                    required
                />

                <TextField
                    label="Date of Pledge"
                    type="date"
                    name="dateOfPledge"
                    value={formData.dateOfPledge}
                    onChange={handleInputChange}
                    size='small'

                    InputLabelProps={{ shrink: true }}
                    required
                />

                <TextField
                    label="Gold Weight (grams)"
                    type="number"
                    name="goldWeight"
                    value={formData.goldWeight}
                    onChange={handleInputChange}
                    size='small'

                    required
                />

                <TextField
                    label="Gold Purity"
                    name="goldPurity"
                    value={formData.goldPurity}
                    onChange={handleInputChange}
                    size='small'

                    select
                >
                    <MenuItem value="24K">24K</MenuItem>
                    <MenuItem value="22K">22K</MenuItem>
                    <MenuItem value="18K">18K</MenuItem>
                </TextField>

                <TextField
                    label="Loan Amount"
                    type="number"
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={handleInputChange}
                    size='small'

                    required
                />

                <TextField
                    label="Interest Rate (%)"
                    type="number"
                    step="0.01"
                    name="interestRate"
                    value={formData.interestRate}
                    onChange={handleInputChange}
                    size='small'

                    required
                />

                <TextField
                    label="Loan Duration (months)"
                    type="number"
                    name="loanDuration"
                    value={formData.loanDuration}
                    onChange={handleInputChange}
                    size='small'

                    required
                />

                <TextField
                    label="Maturity Date"
                    type="date"
                    name="maturityDate"
                    value={formData.maturityDate}
                    onChange={handleInputChange}
                    size='small'

                    InputLabelProps={{ shrink: true }}
                    required
                />

                <TextField
                    label="Remarks"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    sx={{ ...textFieldStyle, width: '620px' }}
                    size='small'

                    rows={1}
                />

                <Button type="submit" variant="contained" color="primary" sx={{ marginTop: '8px', fontSize: '12px' }}>Add Pledge</Button>
            </Box>

            <Typography variant="h6" gutterBottom>Pledge List</Typography>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Pledge ID</TableCell>
                            <TableCell>Pledger Name</TableCell>
                            <TableCell>Date of Pledge</TableCell>
                            <TableCell>Gold Weight</TableCell>
                            <TableCell>Gold Purity</TableCell>
                            <TableCell>Loan Amount</TableCell>
                            <TableCell>Interest Rate</TableCell>
                            <TableCell>Loan Duration</TableCell>
                            <TableCell>Maturity Date</TableCell>
                            <TableCell>Remarks</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pledges.map((pledge, index) => (
                            <TableRow key={index}>
                                <TableCell>{pledge.pledgeId}</TableCell>
                                <TableCell>{pledge.pledgerName}</TableCell>
                                <TableCell>{pledge.dateOfPledge}</TableCell>
                                <TableCell>{pledge.goldWeight}</TableCell>
                                <TableCell>{pledge.goldPurity}</TableCell>
                                <TableCell>{pledge.loanAmount}</TableCell>
                                <TableCell>{pledge.interestRate}</TableCell>
                                <TableCell>{pledge.loanDuration}</TableCell>
                                <TableCell>{pledge.maturityDate}</TableCell>
                                <TableCell>{pledge.remarks}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default PledgeMasterPage;
