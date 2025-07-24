import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { saveDesignation } from '../../services/system/system.service';

const App = () => {
    const [openModal, setOpenModal] = useState(false);
    const [roleName, setDesignation] = useState('');
    const [error, setError] = useState('');

    const handleOpen = () => setOpenModal(true);
    const handleClose = () => {
        setOpenModal(false);
        setError(''); // Clear error on close
    };

    const handleSubmit = async () => {
        try {
            // Call the API to save the designation
            const response = await saveDesignation(roleName,);
            console.log("designationsaved", response);

            if (response?.isError) {
                alert('Failed to save designation. Please try again.');
            } else {
                alert('Designation saved successfully!');
                handleClose();
            }
        } catch (error) {
            // Handle any unexpected errors from the API call
            console.error('Failed to save designation:', error);
            alert('Failed to save designation. Please try again.');
        }
    };


    const handleDesignationChange = (e) => {
        setDesignation(e.target.value);

    };

    return (
        <div>
            <Typography variant="button" onClick={handleOpen}>
                Open Designation Modal
            </Typography>

            <Modal open={openModal} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: 24,
                        width: '300px',
                    }}
                >
                    <Typography variant="h6" mb={2}>Enter Designation</Typography>
                    <TextField
                        label="Designation"
                        fullWidth
                        value={roleName}
                        onChange={handleDesignationChange}
                        error={!!error}
                        helperText={error}
                        sx={{ marginBottom: '16px' }}
                        size='small'
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}

                    >
                        Submit
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default App;