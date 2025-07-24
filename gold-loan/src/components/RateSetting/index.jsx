import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { setRateData } from '../../Redux/rateSlice'; // Import the action
import { saveGoldRate } from '../../services/system/system.service';

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
    const [settingsDate, setSettingsDate] = useState(getTodayDate());
    const [goldRate, setGoldRate] = useState('');
    const [companyGoldRate, setCompanyGoldRate] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Only dispatch when the form is submitted
        const rateData = { date: settingsDate, goldRate, companyGoldRate };
        console.log('Submitted Data:', rateData);
        try {
            const response = await saveGoldRate(goldRate, companyGoldRate, settingsDate);
            if (response?.isError) {
                console.log('Failed to save rates:', response);
                alert('Failed to save rates');
                return;
            }
            else {
                dispatch(setRateData({ date: settingsDate, goldRate, companyGoldRate }));
                console.log('Saved rates:', response);
                alert('Rates saved successfully!');
                setGoldRate('');
                setCompanyGoldRate('');
                handleClose(); // Close modal after submission
            }
        } catch (error) {
            console.error('Error saving rates:', error);
            alert('Error saving rates');
        }
        handleClose(); // Close modal after submission
    };

    const modalStyle = {
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
                        value={settingsDate}
                        onChange={(e) => setSettingsDate(e.target.value)}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        size='small'
                        sx={{ mb: 2, boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)' }}
                    />
                    <TextField
                        label="Gold Rate"
                        type="number"
                        value={goldRate}
                        onChange={(e) => setGoldRate(e.target.value)}
                        fullWidth
                        size='small'
                        sx={{ mb: 2, boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)' }}
                    />
                    <TextField
                        label="Gold Loan Rate"
                        type="number"
                        value={companyGoldRate}
                        onChange={(e) => setCompanyGoldRate(e.target.value)}
                        fullWidth
                        sx={{ mb: 2, boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)' }}
                        size='small'
                    />
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleSubmit}
                        fullWidth
                        size='small'
                    >
                        Submit
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default RateSettingModal;
