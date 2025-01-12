import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const ChequePaperStyleForm = () => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        chequeNumber: '',
        date: '',
        bankName: '',
        payeeName: '',
        amount: '',
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        console.log('Cheque Data Submitted:', formData);
        setFormData({ chequeNumber: '', date: '', bankName: '', payeeName: '', amount: '' });
        handleClose();
    };

    return (
        <div>
            <Typography variant="body1" onClick={handleOpen} sx={{ fontSize: '17px' }}>
                Cheque Reciept
            </Typography>
            <Modal open={open} onClose={handleClose} aria-labelledby="cheque-paper-style">
                <Box
                    sx={{
                        width: '80%',
                        padding: 4,
                        margin: '10% auto',
                        backgroundColor: '#ffffff',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                        borderRadius: '8px',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        fontFamily: "'Roboto', sans-serif",
                    }}
                >
                    <Typography
                        variant="h6"
                        component="h2"
                        textAlign="center"
                        mb={3}
                        sx={{
                            fontWeight: '500',
                            fontSize: '20px',
                        }}
                    >
                        Cheque Entry Form
                    </Typography>

                    {/* Single Row Layout for Fields */}
                    <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
                        <TextField
                            label="Cheque Number"
                            name="chequeNumber"
                            value={formData.chequeNumber}
                            onChange={handleChange}
                            fullWidth
                            size='small'
                            sx={{
                                flex: 1,
                            }}
                        />
                        <TextField
                            label="Date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleChange}
                            fullWidth
                            size='small'
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                flex: 1,
                            }}
                        />
                        <TextField
                            label="Bank Name"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleChange}
                            fullWidth
                            size='small'
                            sx={{
                                flex: 1,
                            }}
                        />
                        <TextField
                            label="Payee Name"
                            name="payeeName"
                            value={formData.payeeName}
                            onChange={handleChange}
                            size='small'
                            fullWidth
                            sx={{
                                flex: 1,
                            }}
                        />
                        <TextField
                            label="Amount"
                            name="amount"
                            type="number"
                            value={formData.amount}
                            onChange={handleChange}
                            fullWidth
                            size='small'
                            sx={{
                                flex: 1,
                            }}
                        />
                    </Box>

                    {/* Action Buttons */}
                    <Box mt={3} display="flex" justifyContent="space-between">
                        <Button
                            variant="outlined"
                            onClick={handleClose}
                            sx={{
                                padding: '8px 16px',
                                fontSize: '14px',
                                textTransform: 'none',
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{
                                padding: '8px 16px',
                                fontSize: '14px',
                                textTransform: 'none',
                            }}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default ChequePaperStyleForm;
