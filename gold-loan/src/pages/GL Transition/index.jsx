import React, { useState, useEffect } from 'react';
import {
    Grid, TextField, Card, Avatar, Box, Typography, Autocomplete, Button, Checkbox,
    FormControlLabel, Rating, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, IconButton, Tooltip
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Draggable from 'react-draggable';


import SendIcon from '@mui/icons-material/Send';

import { useSelector, useDispatch } from 'react-redux';
import { incrementBillNumber } from '../../Redux/billNumberSlice';


import { getCustomerDetails, updateCustomerRating } from '../../services/customer/customer.service';
import { getcustomergoldloandetails, getgolddetailtable } from '../../services/goldItems/goldItems.service';

export default function GoldLoanBill() {
    const dispatch = useDispatch();
    const billNumber = useSelector((state) => state.billNumber.billNumber); // Access Redux state

    const [formData, setFormData] = useState({
        interestRate: "",
        principalPaid: "",
        includeCharges: "",
        totalAmount: "",
        insurance: "",
        processingFee: "",
        packingFee: "",
        appraiser: "",
        otherCharges: "",
    });


    const paymentModes = [
        'Cash',
        'Cheque',
        'UPI',
        'Google Pay',
        'Credit Card',
        'Debit Card',
    ];

    const [rating, setRating] = useState(0); // State to store the rating value
    const [glNumber, setGlNumber] = useState(''); // GL Number state
    const [customerId, setCustomerId] = useState(''); // Customer ID linked to GL Number
    const [loanId, setLoanId] = useState(''); // Loan ID Linked to Gold Table Details
    const [customerData, setCustomerData] = useState(null); // Fetched customer details
    const [glOptions, setGlOptions] = useState([]); // GL number dropdown options
    const [selectedDate, setSelectedDate] = useState(''); // Date picker value
    const [loanDetails, setLoanDetails] = useState([]);//fetched Gold details
    const [itemDetails, setItemDetails] = useState([]);

    const [loading, setLoading] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [showPledgeTable, setShowPledgeTable] = useState(false);
    const [showHistoryTable, setShowHistoryTable] = useState(false);


    const PaperComponent = (props) => {
        return (
            <Draggable
                handle="#draggable-dialog-title"
                cancel={'[class*="MuiDialogContent-root"], [class*="MuiDialogActions-root"]'}
            >
                <Paper {...props} />
            </Draggable>
        );
    };

    const handlePledgeCheckboxChange = (event) => {
        setShowPledgeTable(event.target.checked);
    };
    const handleCheckboxChange = (event) => {
        setShowTable(event.target.checked);
    };
    const handleHistoryTableChange = (event) => {
        setShowHistoryTable(event.target.checked);
    };


    const handleCloseModal = () => {
        setShowTable(false);
        setShowPledgeTable(false);
        setShowHistoryTable(false);
    };

    // Handle GL number change
    const handleGlNumberChange = (event, newValue) => {
        if (newValue) {
            setGlNumber(newValue.glNo); // Set selected GL number
            setCustomerId(newValue.customerId); // Set customer ID linked to GL number
            setLoanId(newValue._id);
            console.log("nothing", newValue.customerId);
            console.log(("idghg", newValue._id));
            console.log("nothing", newValue.glNo);
        } else {
            setGlNumber('');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    // Fetch customer data based on GL Number
    const fetchGoldNoData = async () => {
        try {
            const response = await fetch(
                `http://localhost:4000/customer/gold/loan/number/view?search=${glNumber}`
            );
            const data = await response.json();
            setGlOptions(data.data.loanDetails || []); // Populate dropdown options
        } catch (error) {
            console.error('Error fetching customer data:', error);
        }
    };

    const fetchCustomerData = async () => {
        try {
            const response = await getCustomerDetails(customerId);
            if (response.isSuccess && response.userDetails) {
                setCustomerData(response.userDetails);
                setRating(response.userDetails.rating); // Sync initial rating
            }
            console.log(response);
        } catch (error) {
            console.error('Error fetching customer details:', error);
        }
    };

    const fetchCustomerGoldDetailsData = async () => {
        try {
            const response = await getcustomergoldloandetails(customerId);
            const items = response.items || []; // Safely extract the items array
            setLoanDetails(items); // Store the items in the state
        } catch (error) {
            console.error('Error fetching customer details:', error);
        }
    };

    const fetchCustomerGoldTable = async () => {
        try {
            const response = await getgolddetailtable(loanId);
            console.log("checking", response.items.itemDetails);
            const items = response.items.itemDetails || []; // Safely extract the items array
            setItemDetails(items); // Store the items in the state
        } catch (error) {
            console.error('Error fetching customer details:', error);
        }

    }

    const handleRatingChange = async (event, newValue) => {
        try {
            setRating(newValue); // Optimistically update the UI with the new rating

            const response = await updateCustomerRating(customerId, newValue);

            if (response.isSuccess) {
                // Update customer data locally after API success
                setCustomerData((prevData) => ({ ...prevData, rating: newValue }));
            }
        } catch (error) {
            setLoading(false); // Reset loading state
        }
    };


    useEffect(() => {
        fetchGoldNoData();
        fetchCustomerData();

    }, [glNumber, customerId]);

    // Automatically fetch data when component mounts
    useEffect(() => {
        if (customerId) {
            fetchCustomerGoldDetailsData();
        }
    }, [customerId]);
    useEffect(() => {
        if (loanId) {
            fetchCustomerGoldTable();
        }
    }, [loanId]);

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        dispatch(incrementBillNumber());
    };

    // Handle date change
    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', mt: 2 }}>
            {/* Top Section */}
            <Grid container spacing={2} alignItems="flex-start">
                {/* Left Section */}
                <Grid item xs={12} md={8}>
                    <Box
                        sx={{
                            border: "1px solid #ddd",
                            borderRadius: 2,
                            p: 2,
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                            backgroundColor: "#ffffff",
                        }}
                    >

                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>

                            <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="body2" fontWeight="bold">
                                    Receipt No:
                                </Typography>
                                {billNumber}
                            </Box>

                            {/* Gold Loan Details */}
                            <Typography variant="h6" fontWeight="bold">
                                Gold Loan Details
                            </Typography>

                            {/* Date */}
                            <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="body2" fontWeight="bold">
                                    Date
                                </Typography>
                                <TextField
                                    type="date"
                                    size="small"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            fontSize: '12.5px',
                                            marginBottom: '0px',
                                        },
                                        '& .MuiInputBase-root': {
                                            fontSize: '12.5px',
                                            paddingTop: '0px',
                                            paddingBottom: '0px',
                                        }
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Horizontal Fields Layout */}
                        <Grid container spacing={2} alignItems="center">
                            {/* GL Number */}
                            <Grid item xs={6} md={3}>
                                <Typography variant="body2" fontWeight="bold">GL Number</Typography>
                                <Autocomplete
                                    options={glOptions}
                                    getOptionLabel={(option) => option.glNo || "Select"}
                                    onChange={handleGlNumberChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            size="small"
                                            placeholder="Select GL Number"
                                            fullWidth
                                            sx={{
                                                '& .MuiInputLabel-root': {
                                                    fontSize: '12.5px',
                                                    marginBottom: '0px',
                                                },
                                                '& .MuiInputBase-root': {
                                                    fontSize: '12.5px',
                                                    paddingTop: '0px',
                                                    paddingBottom: '0px',
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Date */}
                            <Grid item xs={6} md={3}>
                                <Typography variant="body2" fontWeight="bold">Period Start</Typography>
                                <TextField
                                    type="date"
                                    size="small"
                                    fullWidth
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            fontSize: '12.5px',
                                            marginBottom: '0px',
                                        },
                                        '& .MuiInputBase-root': {
                                            fontSize: '12.5px',
                                            paddingTop: '0px',
                                            paddingBottom: '0px',
                                        }
                                    }}
                                />
                            </Grid>

                            {/* Date */}
                            <Grid item xs={6} md={3}>
                                <Typography variant="body2" fontWeight="bold">Period End</Typography>
                                <TextField
                                    type="date"
                                    size="small"
                                    fullWidth
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            fontSize: '12.5px',
                                            marginBottom: '0px',
                                        },
                                        '& .MuiInputBase-root': {
                                            fontSize: '12.5px',
                                            paddingTop: '0px',
                                            paddingBottom: '0px',
                                        }
                                    }}
                                />
                            </Grid>

                            {/* Payment Mode */}
                            <Grid item xs={6} md={3}>
                                <Typography variant="body2" fontWeight="bold">Payment Mode</Typography>
                                <Autocomplete
                                    options={paymentModes}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            size="small"
                                            placeholder="Payment Mode"
                                            fullWidth
                                            sx={{
                                                '& .MuiInputLabel-root': {
                                                    fontSize: '12.5px',
                                                    marginBottom: '0px',
                                                },
                                                '& .MuiInputBase-root': {
                                                    fontSize: '12.5px',
                                                    paddingTop: '0px',
                                                    paddingBottom: '0px',
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Interest Rate */}
                            <Grid item xs={6} md={3}>
                                <Typography variant="body2" fontWeight="bold">Interest Rate (%)</Typography>
                                <TextField
                                    name="interestRate"
                                    value={formData.interestRate}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    placeholder="Enter interest rate"
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            fontSize: '12.5px',
                                            marginBottom: '0px',
                                        },
                                        '& .MuiInputBase-root': {
                                            fontSize: '12.5px',
                                            paddingTop: '0px',
                                            paddingBottom: '0px',
                                        }
                                    }}
                                />
                            </Grid>

                            {/* Principal Paid */}
                            <Grid item xs={6} md={3}>
                                <Typography variant="body2" fontWeight="bold">Principal Paid</Typography>
                                <TextField
                                    name="principalPaid"
                                    value={formData.principalPaid}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    placeholder="Enter amount"
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            fontSize: '12.5px',
                                            marginBottom: '0px',
                                        },
                                        '& .MuiInputBase-root': {
                                            fontSize: '12.5px',
                                            paddingTop: '0px',
                                            paddingBottom: '0px',
                                        }
                                    }}
                                />
                            </Grid>

                            {/*Insurance */}
                            <Grid item xs={6} md={3}>
                                <Typography variant="body2" fontWeight="bold">Insurance</Typography>
                                <TextField
                                    name="insurance"
                                    value={formData.insurance}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    placeholder="Enter insurance"
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            fontSize: '12.5px',
                                            marginBottom: '0px',
                                        },
                                        '& .MuiInputBase-root': {
                                            fontSize: '12.5px',
                                            paddingTop: '0px',
                                            paddingBottom: '0px',
                                        }
                                    }}
                                />
                            </Grid>
                            {/* processing Fee */}
                            <Grid item xs={6} md={3}>
                                <Typography variant="body2" fontWeight="bold">Processing Fee</Typography>
                                <TextField
                                    name="processingFee"
                                    value={formData.processingFee}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    placeholder="Enter total processing fee"
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            fontSize: '12.5px',
                                            marginBottom: '0px',
                                        },
                                        '& .MuiInputBase-root': {
                                            fontSize: '12.5px',
                                            paddingTop: '0px',
                                            paddingBottom: '0px',
                                        }
                                    }}
                                />
                            </Grid>{/*PackingFee */}
                            <Grid item xs={6} md={3}>
                                <Typography variant="body2" fontWeight="bold">PackingFee</Typography>
                                <TextField
                                    name="packingFee"
                                    value={formData.packingFee}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    placeholder="Enter total packing fee"
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            fontSize: '12.5px',
                                            marginBottom: '0px',
                                        },
                                        '& .MuiInputBase-root': {
                                            fontSize: '12.5px',
                                            paddingTop: '0px',
                                            paddingBottom: '0px',
                                        }
                                    }}
                                />
                            </Grid>{/*Appraiser */}
                            <Grid item xs={6} md={3}>
                                <Typography variant="body2" fontWeight="bold">Appraiser</Typography>
                                <TextField
                                    name="appraiser"
                                    value={formData.appraiser}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    placeholder="Enter total appraiser"
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            fontSize: '12.5px',
                                            marginBottom: '0px',
                                        },
                                        '& .MuiInputBase-root': {
                                            fontSize: '12.5px',
                                            paddingTop: '0px',
                                            paddingBottom: '0px',
                                        }
                                    }}
                                />
                            </Grid>{/* Additional Charges */}
                            <Grid item xs={6} md={3}>
                                <Typography variant="body2" fontWeight="bold">Additional Charges</Typography>
                                <TextField
                                    name="otherCharges"
                                    value={formData.otherCharges}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    placeholder="Enter additional Charges"
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            fontSize: '12.5px',
                                            marginBottom: '0px',
                                        },
                                        '& .MuiInputBase-root': {
                                            fontSize: '12.5px',
                                            paddingTop: '0px',
                                            paddingBottom: '0px',
                                        }
                                    }}
                                />
                            </Grid>

                            {/* Total Amount */}
                            <Grid item xs={6} md={3}>
                                <Typography variant="body2" fontWeight="bold">Total Amount</Typography>
                                <TextField
                                    name="totalAmount"
                                    value={formData.totalAmount}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    placeholder="Enter total amount"
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            fontSize: '12.5px',
                                            marginBottom: '0px',
                                        },
                                        '& .MuiInputBase-root': {
                                            fontSize: '12.5px',
                                            paddingTop: '0px',
                                            paddingBottom: '0px',
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={6} md={3.2}>
                                {/* Checkbox for toggling the modal */}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={showTable}
                                            onChange={handleCheckboxChange}
                                            color="primary"
                                        />
                                    }
                                    label={<Typography sx={{ color: 'chocolate' }}>Interest Call Details</Typography>}
                                />
                            </Grid>

                            <Grid item xs={6} md={3.7}>

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={showHistoryTable}
                                            onChange={handleHistoryTableChange}
                                            color="primary"
                                        />
                                    }
                                    label={<Typography sx={{ color: 'chocolate' }} >Interest History Details</Typography>}
                                />

                            </Grid>

                            <Grid item xs={6} md={3}>

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={showPledgeTable}
                                            onChange={handlePledgeCheckboxChange}
                                            color="primary"

                                        />
                                    }
                                    label={<Typography sx={{ color: 'chocolate' }}>View Pledge</Typography>}
                                />

                            </Grid>

                            {/* Submit Button */}

                            <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>


                                <Tooltip title="Submit Form" arrow>
                                    <IconButton
                                        color="primary"
                                        size="large"
                                        onClick={handleSubmit}
                                        sx={{
                                            border: '1px solid',
                                            borderRadius: '8px',
                                            fontSize: '0.675rem',
                                            display: 'flex',
                                            justifyContent: 'space-between', // Adjusts spacing between text and icon
                                            alignItems: 'center',
                                            width: '100%',
                                            height: '30px',
                                            padding: '0 8px', // Adds padding for alignment
                                        }}
                                    >
                                        <Typography variant="button">Submit</Typography>
                                        <SendIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>

                        </Grid>
                    </Box>

                    {/* Left Section */}
                    <Grid item xs={12} container spacing={1}>
                        <Grid item xs={12} md={8} sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>
                            {itemDetails && (
                                <Grid container justifyContent="center" sx={{ mt: 3 }}>
                                    <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ fontWeight: 'bold', height: '24px' }}>
                                                    <TableCell align="center" sx={{ padding: '4px' }}>Gold Item</TableCell>
                                                    <TableCell align="center" sx={{ padding: '4px' }}>Qty</TableCell>
                                                    <TableCell align="center" sx={{ padding: '4px' }}>Gross Wt</TableCell>
                                                    <TableCell align="center" sx={{ padding: '4px' }}>Stone Wt</TableCell>
                                                    <TableCell align="center" sx={{ padding: '4px' }}>Dep Wt</TableCell>
                                                    <TableCell align="center" sx={{ padding: '4px' }}>Net Wt</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {itemDetails.map((detail, index) => (
                                                    <TableRow
                                                        key={index}
                                                        sx={{
                                                            '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                                                            '&:nth-of-type(even)': { backgroundColor: '#ffffff' },
                                                            height: '24px',
                                                        }}
                                                    >
                                                        <TableCell align="center" sx={{ padding: '4px' }}>{detail.goldItem}</TableCell>
                                                        <TableCell align="center" sx={{ padding: '4px' }}>{detail.quantity}</TableCell>
                                                        <TableCell align="center" sx={{ padding: '4px' }}>{detail.grossWeight.toFixed(2)}</TableCell>
                                                        <TableCell align="center" sx={{ padding: '4px' }}>{detail.stoneWeight}</TableCell>
                                                        <TableCell align="center" sx={{ padding: '4px' }}>{detail.depreciation}</TableCell>
                                                        <TableCell align="center" sx={{ padding: '4px' }}>{detail.netWeight}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            )}
                        </Grid>
                        < Grid item xs={12} md={4} >

                            <TableContainer component={Paper} sx={{ mb: 2, mt: 3 }}>
                                <Table>

                                    <TableBody>
                                        <TableRow>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}> Principal Amount </TableCell>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>24000</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}> Principle Paid</TableCell>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>24000</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}> Bal Principle Amt</TableCell>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>24000</TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Balance  Interest</TableCell>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>24000</TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Other Charges </TableCell>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>24000</TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Total Amount</TableCell>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>24000</TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>No Of Days </TableCell>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>24000</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>


                        </Grid>
                    </Grid>


                </Grid >


                {/* Right Section */}
                < Grid item xs={12} md={4}  >
                    {customerData && Object.keys(customerData).length > 0 ? (
                        <Card
                            sx={{
                                width: '100%',
                                borderRadius: 2,
                                boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
                                backgroundColor: '#ffffff',
                                display: 'flex',
                                flexDirection: 'row',
                                padding: 2,
                                gap: 2,

                            }}
                        >
                            <Box
                                sx={{
                                    minWidth: 98,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#e8f5e9',
                                    borderRadius: 2,
                                }}
                            >
                                <Avatar
                                    alt="Profile"
                                    src={customerData?.image?.path ? `http://localhost:4000${customerData.image.path}` : '/default.jpg'}
                                    sx={{
                                        width: 90,
                                        height: 100,
                                        border: '4px solid #ffffff',
                                        objectFit: 'cover',
                                    }}
                                />
                            </Box>
                            <Box>
                                <Typography variant="body1" fontWeight="bold" sx={{ color: '#004d40' }}>
                                    {customerData.firstName || 'N/A'} {customerData.lastName || 'N/A'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {customerData.state || 'N/A'}, INDIA
                                </Typography>
                                <Rating
                                    name="profile-rating"
                                    value={customerData?.rating || 0}
                                    onChange={handleRatingChange}
                                    precision={0.5}
                                />
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" sx={{ fontSize: 11.5 }}>
                                        <strong>Address:</strong> {customerData.address || 'N/A'},{' '}
                                        {customerData.place || 'N/A'}, {customerData.pin || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontSize: 11.5 }}> <strong>Email:</strong> {customerData.email || 'No Email'}</Typography>
                                    <Typography variant="body2" sx={{ fontSize: 11.5 }}> <strong>Phone:</strong> {customerData.primaryNumber || 'No Phone'},{customerData.secondaryNumber || 'No Phone'}</Typography>
                                </Box>
                            </Box>
                        </Card>
                    ) : (
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                            Select a GL number to view customer details.
                        </Typography>
                    )
                    }


                    <Box sx={{ margin: '0 auto', mt: 1, textAlign: { xs: 'center', sm: 'left' }, px: { xs: 2, sm: 0 } }}>
                        <TableContainer
                            component={Paper}
                            sx={{
                                mb: 0,
                                overflow: 'auto', // Enable scrolling
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                maxHeight: '400px',
                                '&::-webkit-scrollbar': {
                                    width: '4px', // Thin scrollbar width
                                    height: '4px', // Thin scrollbar height
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: '#888', // Scrollbar thumb color
                                    borderRadius: '2px', // Rounded corners
                                },
                                '&::-webkit-scrollbar-thumb:hover': {
                                    backgroundColor: '#555', // Thumb color on hover
                                },
                                '&::-webkit-scrollbar-track': {
                                    backgroundColor: '#f1f1f1', // Track color
                                },
                            }}
                        >
                            <Table>
                                <TableBody>
                                    <TableRow sx={{ padding: '2px 0' }}>
                                        <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Table Name</TableCell>
                                        {loanDetails.map((detail, index) => (
                                            <TableCell key={index} sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Value</TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow sx={{ padding: '0px 0' }}>
                                        <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Date</TableCell>
                                        {loanDetails.map((detail, index) => (
                                            <TableCell key={index} sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>
                                                {new Date(detail.createdAt).toISOString().split('T')[0]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow sx={{ padding: '2px 0' }}>
                                        <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>GL Number</TableCell>
                                        {loanDetails.map((detail, index) => (
                                            <TableCell key={index} sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>{detail.glNo}</TableCell>
                                        ))}
                                    </TableRow>

                                    <TableRow sx={{ padding: '0px 0' }}>
                                        <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Principle Amount</TableCell>
                                        {loanDetails.map((detail, index) => (
                                            <TableCell key={index} sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>{detail.principleAmount}</TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow sx={{ padding: '0px 0' }}>
                                        <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Principle Paid</TableCell>
                                        {loanDetails.map((detail, index) => (
                                            <TableCell key={index} sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>{detail.amountPaid}</TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow sx={{ padding: '0px 0' }}>
                                        <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Interest Rate</TableCell>
                                        {loanDetails.map((detail, index) => (
                                            <TableCell key={index} sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>
                                                {Number(detail.interestRate).toFixed(2)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow sx={{ padding: '0px 0' }}>
                                        <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}> Total Charges</TableCell>
                                        {/* {loanDetails.map((detail, index) => (
                                        <TableCell key={index} sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>{detail.totalNetWeight}</TableCell>
                                    ))} */}
                                    </TableRow>
                                    <TableRow sx={{ padding: '0px 0' }}>
                                        <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Balance Amount</TableCell>
                                        {loanDetails.map((detail, index) => (
                                            <TableCell key={index} sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>
                                                {Number(detail.balanceAmount).toFixed(2)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow sx={{ padding: '0px 0' }}>
                                        <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Total Net (wt)</TableCell>
                                        {loanDetails.map((detail, index) => (
                                            <TableCell key={index} sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>{detail.totalNetWeight}</TableCell>
                                        ))}
                                    </TableRow>

                                    <TableRow sx={{ padding: '0px 0' }}>
                                        <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Profit/Loss</TableCell>
                                        {loanDetails.map((detail, index) => {
                                            const balanceAmount = Number(detail.balanceAmount);
                                            const profitOrLoss = Number(detail.profitOrLoss);

                                            // Determine the color based on the conditions
                                            let color = 'black'; // Default (neutral)
                                            if (balanceAmount < .3 * profitOrLoss) {
                                                color = 'green'; // Significant profit (> 30% above balanceAmount)
                                            } else if (balanceAmount > 0.8 * profitOrLoss) {
                                                color = 'red'; // Moderate profit (20%-30% above balanceAmount)
                                            } else if (balanceAmount < 0.8 * profitOrLoss) {
                                                color = 'orange'; // Loss (< 80% of balanceAmount)
                                            }

                                            return (
                                                <TableCell
                                                    key={index}
                                                    sx={{
                                                        fontSize: '0.675rem',
                                                        lineHeight: 0.1,
                                                        color: color,
                                                        fontWeight: 'bold', // Optional for emphasis
                                                    }}
                                                >
                                                    {profitOrLoss.toFixed(2)}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>

                                </TableBody>
                            </Table>
                        </TableContainer>


                    </Box>

                </Grid >

            </Grid >



            <div>

                {/* Modal for displaying the table */}
                <Dialog
                    open={showTable}
                    onClose={handleCloseModal}
                    maxWidth="md"
                    fullWidth
                    PaperComponent={PaperComponent}
                    aria-labelledby="draggable-dialog-title"
                >

                    <DialogTitle>Interest Call Details</DialogTitle>
                    <DialogContent>
                        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, }}>

                            <Table sx={{ minWidth: 650 }} aria-label="interest call details table">
                                <TableHead>
                                    <TableRow sx={{ fontWeight: 'bold', height: '24px' }}>
                                        <TableCell align="center" sx={{ padding: '4px' }}>Gold Item</TableCell>
                                        <TableCell align="center" sx={{ padding: '4px' }}>Qty</TableCell>
                                        <TableCell align="center" sx={{ padding: '4px' }}>Gross Wt</TableCell>
                                        <TableCell align="center" sx={{ padding: '4px' }}>Stone Wt</TableCell>
                                        <TableCell align="center" sx={{ padding: '4px' }}>Dep Wt</TableCell>
                                        <TableCell align="center" sx={{ padding: '4px' }}>Net Wt</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {itemDetails.map((detail, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                                                '&:nth-of-type(even)': { backgroundColor: '#ffffff' },
                                                height: '24px',
                                            }}
                                        >
                                            <TableCell align="center" sx={{ padding: '4px' }}>{detail.goldItem}</TableCell>
                                            <TableCell align="center" sx={{ padding: '4px' }}>{detail.quantity}</TableCell>
                                            <TableCell align="center" sx={{ padding: '4px' }}>{detail.grossWeight.toFixed(2)}</TableCell>
                                            <TableCell align="center" sx={{ padding: '4px' }}>{detail.stoneWeight}</TableCell>
                                            <TableCell align="center" sx={{ padding: '4px' }}>{detail.depreciation}</TableCell>
                                            <TableCell align="center" sx={{ padding: '4px' }}>{detail.netWeight}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>

                            </Table>
                        </TableContainer>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal} color="primary">
                            Close
                        </Button>
                    </DialogActions>

                </Dialog>

                <Dialog
                    open={showPledgeTable}
                    onClose={handleCloseModal}
                    maxWidth="md"
                    fullWidth
                    PaperComponent={PaperComponent}
                    aria-labelledby="draggable-dialog-title"
                >

                    <DialogTitle>Show wether pledged </DialogTitle>
                    <DialogContent>
                        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, }}>

                            <Table sx={{ minWidth: 650 }} aria-label="interest call details table">
                                <TableHead>
                                    <TableRow sx={{ fontWeight: 'bold', height: '24px' }}>
                                        <TableCell align="center" sx={{ padding: '4px' }}>Pledge date</TableCell>
                                        <TableCell align="center" sx={{ padding: '4px' }}> bank name </TableCell>
                                        <TableCell align="center" sx={{ padding: '4px' }}> Item Details</TableCell>
                                        <TableCell align="center" sx={{ padding: '4px' }}>amount  </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {itemDetails.map((detail, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                                                '&:nth-of-type(even)': { backgroundColor: '#ffffff' },
                                                height: '24px',
                                            }}
                                        >
                                            <TableCell align="center" sx={{ padding: '4px' }}>N/A</TableCell>
                                            <TableCell align="center" sx={{ padding: '4px' }}>N/A</TableCell>
                                            <TableCell align="center" sx={{ padding: '4px' }}>N/A</TableCell>
                                            <TableCell align="center" sx={{ padding: '4px' }}>N/A</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>

                            </Table>
                        </TableContainer>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal} color="primary">
                            Close
                        </Button>
                    </DialogActions>

                </Dialog>

                <Dialog
                    open={showHistoryTable}
                    onClose={handleCloseModal}
                    maxWidth="md"
                    fullWidth
                    PaperComponent={PaperComponent}
                    aria-labelledby="draggable-dialog-title"
                >

                    <DialogTitle>Interest History Details</DialogTitle>
                    <DialogContent>
                        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, }}>

                            <Table sx={{ minWidth: 650 }} aria-label="interest call details table">
                                <TableHead>
                                    <TableRow sx={{ fontWeight: 'bold', height: '24px' }}>  <TableCell align="center" sx={{ padding: '4px' }}>GL No</TableCell>
                                        <TableCell align="center" sx={{ padding: '4px' }}>Last Transaction Date</TableCell>
                                        <TableCell align="center" sx={{ padding: '4px' }}> Receipt Date</TableCell>
                                        <TableCell align="center" sx={{ padding: '4px' }}> Paid Principal</TableCell>
                                        <TableCell align="center" sx={{ padding: '4px' }}> Paid Int </TableCell>
                                        <TableCell align="center" sx={{ padding: '4px' }}>  other charges paid</TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {itemDetails.map((detail, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                                                '&:nth-of-type(even)': { backgroundColor: '#ffffff' },
                                                height: '24px',
                                            }}
                                        >
                                            <TableCell align="center" sx={{ padding: '4px' }}>N/A</TableCell>
                                            <TableCell align="center" sx={{ padding: '4px' }}>N/A</TableCell>
                                            <TableCell align="center" sx={{ padding: '4px' }}>N/A</TableCell>
                                            <TableCell align="center" sx={{ padding: '4px' }}>N/A</TableCell>
                                            <TableCell align="center" sx={{ padding: '4px' }}>N/A</TableCell>
                                            <TableCell align="center" sx={{ padding: '4px' }}>N/A</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>

                            </Table>
                        </TableContainer>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal} color="primary">
                            Close
                        </Button>
                    </DialogActions>

                </Dialog>


            </div>

        </Box >
    );
}
