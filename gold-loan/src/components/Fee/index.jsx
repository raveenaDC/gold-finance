import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Typography } from '@mui/material';
import { saveAdditionalFees } from '../../services/system/system.service';
const Fee = () => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        processingFee: '',
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Save the form data
            const response = await saveAdditionalFees(formData.processingFee, formData.packingFee, formData.appraiser,
                formData.insurance,
                formData.firstLetter,
                formData.secondLetter);
            if (response?.isError) {
                console.log('Failed to Saved fees:', response);
                alert('Failed to save fees');


            } else {
                console.log(' Saved fees:', response);
                setFormData({
                    processingFee: '',
                    packingFee: '',
                    appraiser: '',
                    insurance: '',
                    firstLetter: '',
                    secondLetter: ''
                });
                alert('Fees saved successfully!');
                handleClose();

            }
        } catch (error) {
            console.error('Error saving fees:', error);
            alert('Error saving fees');
        }

        // Handle form submission logic here
        console.log(formData);

    };

    return (
        <div>
            <Typography variant="body2" onClick={handleOpen}>
                Gold Loan Settings
            </Typography>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Fees and Details</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Processing Fee (Percentage)"
                                name="processingFee"
                                value={formData.processingFee}
                                onChange={handleChange}
                                size='small'
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Packing Fee"
                                name="packingFee"
                                value={formData.packingFee}
                                onChange={handleChange}
                                size='small'
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Appraiser"
                                name="appraiser"
                                value={formData.appraiser}
                                onChange={handleChange}
                                size='small'
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Insurance"
                                name="insurance"
                                value={formData.insurance}
                                onChange={handleChange}
                                size='small'
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="1st Letter"
                                name="firstLetter"
                                value={formData.firstLetter}
                                onChange={handleChange}
                                size='small'
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="2nd Letter"
                                name="secondLetter"
                                value={formData.secondLetter}
                                onChange={handleChange}
                                size='small'
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
