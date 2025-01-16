import React, { useState } from 'react';
import { Button, Modal, Box, TextField, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const SearchModalWithTable = () => {
    const [open, setOpen] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [bankName, setBankName] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleSearch = () => {
        console.log({ fromDate, toDate, bankName });
        // Add search logic here
    };

    return (
        <div>
            {/* Trigger Button */}
            <Button
                variant="outlined"
                color="primary"
                onClick={handleOpen}
            >
                Search
            </Button>

            {/* Modal */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-search-title"
                aria-describedby="modal-search-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        bgcolor: 'background.paper',
                        border: '2px ',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    {/* Search Form */}
                    <Typography id="modal-search-title" variant="h6" mb={2} style={{ color: '#2F2F2F' }}>
                        Search by Date or Bank Name
                    </Typography>
                    <Box display="flex" gap={2} mb={3}>
                        <TextField
                            type="date"
                            label="From Date"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            style={{ flex: 1 }}
                            size='small'
                        />
                        <TextField
                            type="date"
                            label="To Date"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            style={{ flex: 1 }}
                            size='small'
                        />
                        <TextField
                            label="Bank Name"
                            variant="outlined"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            style={{ flex: 2 }}
                            size='small'
                        />
                        <Button
                            variant="outlined"
                            onClick={handleSearch}
                            style={{ flex: 1 }}
                            size='small'
                        >
                            Search
                        </Button>
                    </Box>

                    {/* Table */}
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: .8 }}>Date</TableCell>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: .8 }}>Pledge No</TableCell>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: .8 }}>Bank Name</TableCell>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: .8 }}>Principal Amount</TableCell>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: .8 }}>Interest</TableCell>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: .8 }}>Other Charges</TableCell>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: .8 }}>Due Date</TableCell>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: .8 }}>Item  Details</TableCell>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: .8 }}>GL No</TableCell>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: .8 }}>Remark</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: .1 }}>01/01/2025</TableCell>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: .1 }}>12345</TableCell>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: .1 }}>XYZ Bank</TableCell>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: .1 }}>5000</TableCell>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: .1 }}>5%</TableCell>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: .1 }}>200</TableCell>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: .1 }}>01/07/2025</TableCell>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: .1 }}>Gold Chain</TableCell>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: .1 }}>GL001 (John Doe)</TableCell>
                                <TableCell sx={{ fontSize: '0.675rem', lineHeight: .1 }}>None</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <Box mt={3} display="flex" justifyContent="flex-end">
                        <Button onClick={handleClose} variant="outlined">
                            Close
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default SearchModalWithTable;
