import React, { useState } from 'react';
import { Button, TextField, Select, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Typography } from '@mui/material';

const JournalEntryForm = () => {
    const [open, setOpen] = useState(false); // Modal state

    const [voucherNo, setVoucherNo] = useState(226);
    const [voucherDate, setVoucherDate] = useState('2025-01-08');
    const [mode, setMode] = useState('Credit');
    const [entries, setEntries] = useState([]); // Stores table rows
    const [accountName, setAccountName] = useState('');
    const [creditAmount, setCreditAmount] = useState('');
    const [debitAmount, setDebitAmount] = useState('');
    const [narration, setNarration] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleAddEntry = () => {
        if (accountName && (creditAmount || debitAmount)) {
            setEntries([
                ...entries,
                {
                    accountName,
                    credit: mode === 'Credit' ? parseFloat(creditAmount) : 0,
                    debit: mode === 'Debit' ? parseFloat(debitAmount) : 0,
                }
            ]);
            setAccountName('');
            setCreditAmount('');
            setDebitAmount('');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleAddEntry();
        }
    };

    const totalCredit = entries.reduce((sum, entry) => sum + entry.credit, 0);
    const totalDebit = entries.reduce((sum, entry) => sum + entry.debit, 0);

    return (
        <div>
            <Typography variant="body1" onClick={handleOpen} sx={{ fontSize: '17px' }}> Journal </Typography>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Journal Entry</DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', marginTop: "10px" }}>
                        <TextField size='small' label="Voucher Date" type="date" value={voucherDate} onChange={(e) => setVoucherDate(e.target.value)} InputLabelProps={{ shrink: true }} />
                        <TextField size='small' label="Voucher No" value={voucherNo} onChange={(e) => setVoucherNo(e.target.value)} />

                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <FormControl>
                            <InputLabel>Mode</InputLabel>
                            <Select value={mode} onChange={(e) => setMode(e.target.value)} size='small'>
                                <MenuItem value="Credit">Credit</MenuItem>
                                <MenuItem value="Debit">Debit</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField size='small' label="Account Name" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
                        {mode === 'Credit' ? (
                            <TextField size='small' type="number" label="Credit Amount" value={creditAmount} onChange={(e) => setCreditAmount(e.target.value)} onKeyPress={handleKeyPress} />
                        ) : (
                            <TextField size='small' type="number" label="Debit Amount" value={debitAmount} onChange={(e) => setDebitAmount(e.target.value)} onKeyPress={handleKeyPress} />
                        )}
                    </div>

                    <Table style={{ marginBottom: '10px' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>SI No</TableCell>
                                <TableCell>Account Name</TableCell>
                                <TableCell>Credit</TableCell>
                                <TableCell>Debit</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {entries.map((entry, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{entry.accountName}</TableCell>
                                    <TableCell align="right">{entry.credit} </TableCell>
                                    <TableCell align="right">{entry.debit}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                        <div>Total Credit: {totalCredit.toFixed(2)}</div>
                        <div>Total Debit: {totalDebit.toFixed(2)}</div>
                    </div>

                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={2}
                        size='small'
                        value={narration}
                        onChange={(e) => setNarration(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Close</Button>
                    <Button onClick={handleAddEntry} color="primary">Add Entry</Button>
                    <Button variant="contained" color="primary" style={{ marginLeft: '10px' }}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default JournalEntryForm;
