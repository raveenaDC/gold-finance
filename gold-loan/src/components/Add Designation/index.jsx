import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';

const App = () => {
    const [openModal, setOpenModal] = useState(false);
    const [designation, setDesignation] = useState('');

    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);

    const handleSubmit = () => {
        // Handle submission logic here
        console.log('Designation:', designation);
        handleClose(); // Close the modal after submission
    };

    const handleDesignationChange = (e) => {
        setDesignation(e.target.value);
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Open Designation Modal
            </Button>

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
                        value={designation}
                        onChange={handleDesignationChange} // Ensure the state updates with each keystroke
                        sx={{ marginBottom: '16px' }}
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
