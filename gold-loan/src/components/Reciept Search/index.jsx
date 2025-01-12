import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Typography,
    Box,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Autocomplete,
} from '@mui/material';

const SearchReceiptModal = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const today = new Date().toISOString().split('T')[0]; // Gets current date in "YYYY-MM-DD" format

    const accounts = [
        { label: 'Savings Account' },
        { label: 'Current Account' },
        { label: 'Fixed Deposit' },
        { label: 'Recurring Deposit' },
    ];

    const [rows, setRows] = useState([
        { id: 1, date: '', billNo: '', type: '', billAmt: '', balance: '', amount: '' },
    ]);
    const [editingRowId, setEditingRowId] = useState(null);
    const [editData, setEditData] = useState({});

    const handleRowDoubleClick = (row) => {
        setEditingRowId(row.id);
        setEditData({ ...row });
    };

    const handleInputChange = (e, field) => {
        setEditData({ ...editData, [field]: e.target.value });
    };

    const handleSave = () => {
        setRows(rows.map(row => (row.id === editingRowId ? { ...editData } : row)));
        setEditingRowId(null);
    };

    const handleCancel = () => {
        setEditingRowId(null);
    };

    return (
        <div>
            <Typography
                onClick={handleOpen}
                sx={{ fontSize: '15px', cursor: 'pointer' }}
            >
                Search
            </Typography>
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    Seacrh Reciept
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                size="small"
                                label="From"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                size="small"
                                label="To"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                size="small"
                                label="From"
                                type="date"
                                fullWidth
                                value={today} // Set the default date
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent='center' mt={1}>
                                <Autocomplete
                                    options={accounts}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextField {...params} size="small" label="Account" />
                                    )}
                                    sx={{ width: '50%' }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Bill Details</Typography>
                            <TableContainer component={Paper}>
                                <Table aria-label="bill details table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Bill No</TableCell>
                                            <TableCell>Type</TableCell>
                                            <TableCell>Bill Amt</TableCell>
                                            <TableCell>Balance</TableCell>
                                            <TableCell>Amount</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                onDoubleClick={() => handleRowDoubleClick(row)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {editingRowId === row.id ? (
                                                    <>
                                                        <TableCell>
                                                            <TextField
                                                                size="small"
                                                                value={editData.date}
                                                                onChange={(e) => handleInputChange(e, 'date')}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                size="small"
                                                                value={editData.billNo}
                                                                onChange={(e) => handleInputChange(e, 'billNo')}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                size="small"
                                                                value={editData.type}
                                                                onChange={(e) => handleInputChange(e, 'type')}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                size="small"
                                                                value={editData.billAmt}
                                                                onChange={(e) => handleInputChange(e, 'billAmt')}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                size="small"
                                                                value={editData.balance}
                                                                onChange={(e) => handleInputChange(e, 'balance')}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                size="small"
                                                                value={editData.amount}
                                                                onChange={(e) => handleInputChange(e, 'amount')}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button onClick={handleSave} color="success" variant="contained" size="small">
                                                                Save
                                                            </Button>
                                                            <Button onClick={handleCancel} color="error" variant="outlined" size="small" sx={{ ml: 1 }}>
                                                                Cancel
                                                            </Button>
                                                        </TableCell>
                                                    </>
                                                ) : (
                                                    <>
                                                        <TableCell>{row.date}</TableCell>
                                                        <TableCell>{row.billNo}</TableCell>
                                                        <TableCell>{row.type}</TableCell>
                                                        <TableCell>{row.billAmt}</TableCell>
                                                        <TableCell>{row.balance}</TableCell>
                                                        <TableCell>{row.amount}</TableCell>
                                                        <TableCell>
                                                            <Button variant="text" size="small" disabled>
                                                                Edit
                                                            </Button>

                                                        </TableCell>
                                                    </>
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={12} textAlign="center" mt={2}>
                            <Button variant="outlined" color="error" onClick={handleClose}>
                                Exit
                            </Button>
                            {/* <Button variant="outlined" color="primary" sx={{ ml: 1 }}>
                                Edit
                            </Button>
                            <Button variant="outlined" sx={{ ml: 1 }}>
                                Cancel
                            </Button>
                            <Button variant="contained" color="success" sx={{ ml: 1 }}>
                                Save
                            </Button>
                            <Button variant="contained" color="secondary" sx={{ ml: 1 }}>
                                Delete
                            </Button> */}
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SearchReceiptModal;