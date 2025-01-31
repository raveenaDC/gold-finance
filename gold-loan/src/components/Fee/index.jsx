import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Typography } from '@mui/material';

const Fee = () => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        processingFeePercentage: '',
        processingFeeAmount: '',
        packingFee: '',
        appraiser: '',
        insurance: '',
        firstLetter: '',
        secondLetter: ''
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        // Handle form submission logic here
        console.log(formData);
        handleClose();
    };

    return (
        <div>
            <Typography variant="body2" onClick={handleOpen}>
                Gold Loan Settings
            </Typography>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Fees and Details</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Processing Fee (Percentage)"
                                name="processingFeePercentage"
                                value={formData.processingFeePercentage}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Processing Fee (Amount)"
                                name="processingFeeAmount"
                                value={formData.processingFeeAmount}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Packing Fee"
                                name="packingFee"
                                value={formData.packingFee}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Appraiser"
                                name="appraiser"
                                value={formData.appraiser}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Insurance"
                                name="insurance"
                                value={formData.insurance}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="1st Letter"
                                name="firstLetter"
                                value={formData.firstLetter}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="2nd Letter"
                                name="secondLetter"
                                value={formData.secondLetter}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
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

export default Fee;
