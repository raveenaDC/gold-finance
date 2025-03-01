import React, { useState } from 'react';
import { Button, Modal, Box, TextField, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { searchPledgeDetails } from '../../services/pledge/pledge.service';

const SearchModalWithTable = () => {
    const [open, setOpen] = useState(false);
    const [startDate, setstartDate] = useState('');
    const [endDate, setendDate] = useState('');
    const [search, setsearch] = useState('');
    const [result, setresult] = useState([]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleSearch = (e) => {
        e.preventDefault();
        searchPledgeDetails(startDate, endDate, search)
            .then((response) => {
                setresult(response.result.data.items);
            })
            .catch((error) => {
                console.error("Error in handleSearch:", error);
            });
    };

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleOpen}>Search</Button>

            <Modal open={open} onClose={handleClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '95%', sm: '80%', md: '70%' },
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    overflow: 'auto',
                    maxHeight: '90vh',
                }}>
                    <Typography variant="h6" mb={2} sx={{ color: '#2F2F2F' }}>
                        Search by Date or Bank Name
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
                        <TextField
                            type="date"
                            label="From Date"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            value={startDate}
                            onChange={(e) => setstartDate(e.target.value)}
                            sx={{ flex: 1, minWidth: '140px', fontFamily: 'inherit', fontWeight: 'inherit' }}
                            size='small'
                            InputProps={{
                                style: {
                                    fontFamily: 'inherit',
                                    fontWeight: 'inherit',
                                },
                            }}
                        />
                        <TextField
                            type="date"
                            label="To Date"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            value={endDate}
                            onChange={(e) => setendDate(e.target.value)}
                            sx={{ flex: 1, minWidth: '140px', fontFamily: 'inherit', fontWeight: 'inherit' }}
                            size='small'
                            InputProps={{
                                style: {
                                    fontFamily: 'inherit',
                                    fontWeight: 'inherit',
                                },
                            }}
                        />
                        <TextField
                            label="Bank Name"
                            variant="outlined"
                            value={search}
                            onChange={(e) => setsearch(e.target.value)}
                            sx={{ flex: 2, minWidth: '180px', fontFamily: 'inherit', fontWeight: 'inherit' }}
                            size='small'
                            InputProps={{
                                style: {
                                    fontFamily: 'inherit',
                                    fontWeight: 'inherit',
                                },
                            }}
                        />
                        <Button
                            variant="outlined"
                            onClick={handleSearch}
                            sx={{ flex: 1, minWidth: '100px' }}
                            size='small'
                        >Search</Button>
                    </Box>

                    <Box sx={{ overflowX: 'auto' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    {['Date', 'Pledge No', 'Bank Name', 'Principal Amount', 'Interest', 'Other Charges', 'Due Date', 'Item Details', 'GL No', 'Remark'].map((header) => (
                                        <TableCell key={header} sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap', fontFamily: 'inherit', fontWeight: 'inherit' }}>{header}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {result.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ fontFamily: 'inherit', fontWeight: 'inherit' }}>{new Date(row.pledgeDate).toLocaleDateString()}</TableCell>
                                        <TableCell sx={{ fontFamily: 'inherit', fontWeight: 'inherit' }}>{row.bankPledgeNumber}</TableCell>
                                        <TableCell sx={{ fontFamily: 'inherit', fontWeight: 'inherit' }}>{row.bankName}</TableCell>
                                        <TableCell sx={{ fontFamily: 'inherit', fontWeight: 'inherit' }}>{row.principleAmount}</TableCell>
                                        <TableCell sx={{ fontFamily: 'inherit', fontWeight: 'inherit' }}>{row.interestRate}</TableCell>
                                        <TableCell sx={{ fontFamily: 'inherit', fontWeight: 'inherit' }}>{row.otherCharges}</TableCell>
                                        <TableCell sx={{ fontFamily: 'inherit', fontWeight: 'inherit' }}>{new Date(row.dueDate).toLocaleDateString()}</TableCell>
                                        <TableCell sx={{ fontFamily: 'inherit', fontWeight: 'inherit' }}>{row.itemDetails?.map((item) => item.goldItem).join(", ") || "NA"}</TableCell>
                                        <TableCell sx={{ fontFamily: 'inherit', fontWeight: 'inherit' }}>{row.glNumber?.map((item) => `${item.glNo} (${item.firstName} ${item.lastName})`).join(", ") || "NA"}</TableCell>
                                        <TableCell sx={{ fontFamily: 'inherit', fontWeight: 'inherit' }}>NA</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>

                    <Box mt={3} display="flex" justifyContent="flex-end">
                        <Button onClick={handleClose} variant="outlined">Close</Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default SearchModalWithTable;