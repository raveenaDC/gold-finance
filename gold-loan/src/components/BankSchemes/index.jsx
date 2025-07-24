import React, { useState } from 'react';
import { Button, Modal, Box, TextField, Typography } from '@mui/material';
import { savebankdetails } from '../../services/pledge/pledge.service';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const BankDetailsModal = () => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        bankName: '',
        interestRate: '',
        otherCharges: '',
        duration: '',
        remark: '',
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => {

        setOpen(false);
        setFormData({ bankName: '', interestRate: '', otherCharges: '', duration: '', remark: '' }); // Clear form fields on close
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (event) => {
        event.preventDefault();
        try {
            // Save the form data
            const response = await savebankdetails(formData.bankName, formData.interestRate, formData.otherCharges,
                formData.duration,
                formData.remark,
            );
            console.log('Response:', response);


            if (response?.isError) {
                console.log('Failed to Saved fees:', response);
                alert('Failed to save fees');

            } else {
                console.log(' Saved fees:', response);
                setFormData({ bankName: '', interestRate: '', otherCharges: '', duration: '', remark: '' }); // Clear form fields after saving
                setOpen(false); // Close the modal
                alert('Fees saved successfully!');
                handleClose();
            }
        } catch (error) {
            console.error('Error saving fees:', error);
            alert('Error saving fees');
        }
        console.log('Saved Data:', formData); // Replace with actual API call       
    };

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleOpen} fullWidth>
                Add Bank Details
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Bank Details
                    </Typography>
                    <TextField
                        fullWidth
                        label="Bank Name"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        margin="normal"
                        size="small"
                    />
                    <TextField
                        fullWidth
                        label="Interest Rate (%)"
                        name="interestRate"
                        type="number"
                        value={formData.interestRate}
                        onChange={handleChange}
                        margin="normal"
                        size="small"
                    />
                    <TextField
                        fullWidth
                        label="Other Charges"
                        name="otherCharges"
                        value={formData.otherCharges}
                        onChange={handleChange}
                        margin="normal"
                        size="small"
                    />
                    <TextField
                        fullWidth
                        label="Duration (months)"
                        name="duration"
                        type="number"
                        value={formData.duration}
                        onChange={handleChange}
                        margin="normal"
                        size="small"
                    />
                    <TextField
                        fullWidth
                        label="Remark"
                        name="remark"
                        multiline
                        rows={2}
                        value={formData.remark}
                        onChange={handleChange}
                        margin="normal"
                        size="small"
                    />
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" onClick={handleSave}>
                            Save
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default BankDetailsModal;
