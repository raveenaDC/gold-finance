import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, Grid, TextField, Select, MenuItem, Typography, Box, IconButton, Snackbar, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { viewAccountHeadName, saverecieptpaymet } from '../../services/accounts/account.service';
import SearchReceiptModal from '../../components/Reciept Search';


const CashReceiptsModal = () => {
    const [state, setState] = useState({
        open: false,
        accountType: 'Payables',
        selectedAccount: { accountName: '', chartId: '' },
        formData: {
            description: "",
            debit: "",
            credit: "",
            voucherNumber: "10",
            isPaymentType: "0"
        },
        error: '',
        loading: true,
        accountHeadName: []
    });

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const amountDate = new Date().toISOString().split('T')[0];

    const handleOpen = () => setState(prev => ({ ...prev, open: true }));
    const handleClose = () => setState(prev => ({ ...prev, open: false }));

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState(prev => ({ ...prev, formData: { ...prev.formData, [name]: value } }));
    };

    const handleAccountChange = (event) => {
        const selectedOption = state.accountHeadName.find(account => account.accountName === event.target.value);
        if (selectedOption) {
            setState(prev => ({
                ...prev,
                selectedAccount: { accountName: selectedOption.accountName, chartId: selectedOption._id }
            }));
        }
    };

    useEffect(() => {
        const fetchAccountHeadName = async () => {
            try {
                const response = await viewAccountHeadName();
                if (!response?.isSuccess) {
                    setSnackbar({ open: true, message: response.result, severity: 'error' });
                    return;
                }
                setState(prev => ({
                    ...prev,
                    accountHeadName: response.result.data.chartList || [],
                    loading: false
                }));
            } catch (error) {
                console.error('Error fetching account head names:', error);
                setSnackbar({ open: true, message: 'Failed to fetch account head names. Please try again.', severity: 'error' });
            }
        };
        fetchAccountHeadName();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setState(prev => ({ ...prev, loading: true, error: '' }));
        const { formData, selectedAccount, accountType } = state;
        console.log("paymerts", formData);

        try {
            const response = await saverecieptpaymet(
                selectedAccount.chartId,
                formData.voucherNumber,
                selectedAccount.accountName,
                formData.description,
                formData.isPaymentType,
                formData.debit,
                formData.credit,
                amountDate,
                accountType
            );
            console.log(response);

            if (response.isSuccess) {
                setSnackbar({ open: true, message: 'Payment data saved successfully!', severity: 'success' });

                setState(prev => ({
                    ...prev,
                    formData: { description: "", debit: "", credit: "", voucherNumber: "10", isPaymentType: "1" },
                    selectedAccount: { accountName: '', chartId: '' }
                }));
            } else {
                setSnackbar({ open: true, message: response.error || 'Failed to save payment data.', severity: 'error' });
            }
        } catch (error) {
            console.error('Error saving payment data:', error);
            setSnackbar({ open: true, message: 'An error occurred while saving.', severity: 'error' });
        }
    };

    const handleSnackbarClose = () => setSnackbar(prev => ({ ...prev, open: false }));

    return (
        <div>
            <Typography variant="body1" onClick={handleOpen} sx={{ fontSize: '17px' }}>
                Receipt
            </Typography>
            <Dialog open={state.open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    Cash Receipt
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                size="small"
                                label="Date"
                                type="date"
                                value={amountDate}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField size="small" label="Vr No" name="voucherNumber" value={state.formData.voucherNumber} onChange={handleInputChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Select
                                size="small"
                                value={state.accountType}
                                onChange={(e) => setState(prev => ({ ...prev, accountType: e.target.value }))}
                                sx={{ marginLeft: '220px', width: '200px' }}
                            >
                                <MenuItem value="General">General</MenuItem>
                                <MenuItem value="Payables">Payables</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Account Details</Typography>
                            <Box display="flex" justifyContent="space-between" mt={1}>
                                <Select
                                    size="small"
                                    value={state.selectedAccount.accountName}
                                    onChange={handleAccountChange}
                                    fullWidth
                                >
                                    {state.accountHeadName.map(account => (
                                        <MenuItem key={account._id} value={account.accountName}>
                                            {account.accountName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <TextField
                                    size="small"
                                    label="Description"
                                    name="description"
                                    value={state.formData.description}
                                    onChange={handleInputChange}
                                    fullWidth
                                    sx={{ marginLeft: 2 }}
                                />
                                <TextField
                                    size="small"
                                    label="Amount"
                                    name="debit"
                                    value={state.formData.debit}
                                    onChange={handleInputChange}
                                    sx={{ marginLeft: 2 }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} textAlign="center" mt={2}>
                            <Button variant="outlined" color="primary" aria-label="Search Payment">
                                <SearchReceiptModal />
                            </Button>
                            <Button variant="contained" color="success" aria-label="Save" style={{ marginLeft: 8 }} onClick={handleSave}>
                                Save
                            </Button>
                            <Button variant="contained" color="secondary" aria-label="Exit" style={{ marginLeft: 8 }} onClick={handleClose}>
                                Exit
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default CashReceiptsModal;
