import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
} from '@mui/material';

const RateSettingModal = () => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState('');
    const [goldRate, setGoldRate] = useState('');
    const [goldLoanRate, setGoldLoanRate] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = () => {
        const rateData = {
            date,
            goldRate,
            goldLoanRate,
        };
        console.log('Submitted Data:', rateData);
        handleClose();
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
                        value={goldLoanRate}
                        onChange={(e) => setGoldLoanRate(e.target.value)}
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
