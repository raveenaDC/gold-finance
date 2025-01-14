import React, { useState } from 'react';
import { Button, Modal, Box, TextField, Typography } from '@mui/material';

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

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
                    <TextField fullWidth label="Bank Name" margin="normal" size='small' />
                    <TextField fullWidth label="Interest Rate (%)" margin="normal" type="number" size='small' />
                    <TextField fullWidth label="Other Charges" margin="normal" size='small' />
                    <TextField fullWidth label="Duration (months)" margin="normal" type="number" size='small' />
                    <TextField fullWidth label="Remark" margin="normal" multiline rows={2} size='small' />
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" onClick={handleClose}>
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
