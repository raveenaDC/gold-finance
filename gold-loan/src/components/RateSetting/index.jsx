import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { setRateData } from '../../Redux/rateSlice'; // Import the action

const RateSettingModal = () => {
    const dispatch = useDispatch();

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(getTodayDate());
    const [goldRate, setGoldRate] = useState('');
    const [companyGoldRate, setCompanyGoldRate] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = () => {
        // Only dispatch when the form is submitted
        const rateData = { date, goldRate, companyGoldRate };
        console.log('Submitted Data:', rateData);

        // Dispatch action to update Redux state with the submitted data
        dispatch(setRateData({ date, goldRate, companyGoldRate }));

        handleClose(); // Close modal after submission
    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
    };

    return (
        <div>
            <Typography variant="body2" onClick={handleOpen}>
                Rate Setting
            </Typography>
            <Modal open={open} onClose={handleClose} aria-labelledby="rate-setting-modal">
                <Box sx={modalStyle}>
                    <Typography id="rate-setting-modal" variant="h6" component="h2" gutterBottom>
                        Rate Setting
                    </Typography>
                    <TextField
                        label="Date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Gold Rate"
                        type="number"
                        value={goldRate}
                        onChange={(e) => setGoldRate(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Gold Loan Rate"
                        type="number"
                        value={companyGoldRate}
                        onChange={(e) => setCompanyGoldRate(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleSubmit}
                        fullWidth
                    >
                        Submit
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default RateSettingModal;
