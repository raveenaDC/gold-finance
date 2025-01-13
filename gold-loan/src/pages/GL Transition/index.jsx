import React, { useState, useEffect } from 'react';
import {
    Grid, TextField, Card, Avatar, Box, Typography, Autocomplete, Button, Checkbox,
    FormControlLabel, Rating, Table, TableBody, TableCell, TableHead, TableRow,
    TableContainer, Paper, IconButton, Tooltip, Modal
} from '@mui/material';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Draggable from 'react-draggable';
import { LinearProgress } from '@mui/material';
import { differenceInDays } from 'date-fns';


import SendIcon from '@mui/icons-material/Send';
import PrintIcon from "@mui/icons-material/Print";

import { useSelector, useDispatch } from 'react-redux';
import { incrementBillNumber } from '../../Redux/billNumberSlice';
import { submitData } from "../../api";




import { getCustomerDetails, updateCustomerRating } from '../../services/customer/customer.service';
import { getcustomergoldloandetails, getgolddetailtable, getgoldbillhistorytable } from '../../services/goldItems/goldItems.service';

export default function GoldLoanBill() {
    const dispatch = useDispatch();
    const billNo = useSelector((state) => state.billNumber.billNumber); // Access Redux state

    const [formData, setFormData] = useState({
        interestRate: "",
        principlePaid: "",
        includeCharges: "",
        totalAmount: "",
        insurance: "",
        processingFee: "",
        packingFee: "",
        appraiser: "",
        otherCharges: "",
        totalCharges: "100",
        paymentMode: "cash",
        paymentName: "",
        paymentNumber: "",
    });

    const paymentModes = [
        'Cash',
        'Cheque',
        'UPI',
        'Google Pay',
        'Credit Card',
        'Debit Card',
    ];

    const [chequeDetails, setChequeDetails] = useState({ name: '', goldNumber: 10 });
    const [selectedMode, setSelectedMode] = useState('');
    const [selectedPaymentMode, setSelectedPaymentMode] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleInputChange = (field, value) => {
        setChequeDetails((prevDetails) => ({
            ...prevDetails,
            [field]: value,
        }));
    };

    const handleOkClick = () => {
        console.log('Cheque Details Submitted:', chequeDetails);
        // Add your logic for handling the OK button click
    };

    const [rating, setRating] = useState(0); // State to store the rating value
    const [glNumber, setGlNumber] = useState(''); // GL Number state
    const [customerId, setCustomerId] = useState(''); // Customer ID linked to GL Number
    const [goldLoanId, setGoldLoanId] = useState(''); // Loan ID Linked to Gold Table Details
    const [customerData, setCustomerData] = useState(null); // Fetched customer details
    const [glOptions, setGlOptions] = useState([]); // GL number dropdown options
    const [billDate, setBillDate] = useState(''); // Date picker value
    const [loanDetails, setLoanDetails] = useState([]);//fetched Gold details
    const [itemDetails, setItemDetails] = useState([]);
    const [singleloanDetails, setSingleloanDetails] = useState([]);
    const [fineDetails, setFineDetails] = useState([]);


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
    const handlePaymentModeChange = (event, value) => {
        setSelectedPaymentMode(value);
        if (value) {
            setIsModalOpen(true); // Open the modal when a payment mode is selected
        }
    };

    // const handleCloseModal = () => {
    //     setIsModalOpen(false);
    // };


    const handleCloseModal = () => {
        setShowTable(false);
        setShowPledgeTable(false);
        setShowHistoryTable(false);
        setIsModalOpen(false);
    };

    // Handle GL number change
    const handleGlNumberChange = (event, newValue) => {
        if (newValue) {
            setGlNumber(newValue.glNo); // Set selected GL number
            setCustomerId(newValue.customerId); // Set customer ID linked to GL number
            setGoldLoanId(newValue._id);
            // console.log("hiiiiiiiii");

            // console.log("nothing", newValue.customerId);
            // console.log(("idghg", newValue._id));
            // console.log("nothing", newValue.glNo);
        } else {
            setGlNumber('');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePrint = () => {
        const printSection = document.getElementById("print-section");

        // Temporarily hide specific elements (checkboxes and buttons)
        const checkboxes = printSection.querySelectorAll(".MuiCheckbox-root");
        const buttons = printSection.querySelectorAll(".MuiIconButton-root, .submit-button-class"); // Adjust class names as needed

        checkboxes.forEach(el => el.style.display = "none");
        buttons.forEach(el => el.style.display = "none");

        // Get the content for printing
        const printContent = printSection.innerHTML;
        const printWindow = window.open("", "_blank");

        printWindow.document.open();
        printWindow.document.write(`
          <html>
            <head>
              <title>Print</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                table, th, td { border: 1px solid black; }
                th, td { padding: 8px; text-align: left; }
              </style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();

        // Restore visibility of checkboxes and buttons
        checkboxes.forEach(el => el.style.display = "");
        buttons.forEach(el => el.style.display = "");
    };



    function calculateProfileCompletion(customerData) {
        const totalFields = 24; // Adjust based on how many fields you're checking
        let completedFields = 0;

        // Check if the fields are provided
        if (customerData.primaryNumber) completedFields++;
        if (customerData.secondaryNumber) completedFields++;
        if (customerData.address) completedFields++;
        if (customerData.email) completedFields++;
        if (customerData.aadhar) completedFields++;
        if (customerData.aadharImage) completedFields++;
        if (customerData.bankName) completedFields++;
        if (customerData.bankUserName) completedFields++;
        if (customerData.city) completedFields++;
        if (customerData.email) completedFields++;
        if (customerData.gender) completedFields++;
        if (customerData.ifsc) completedFields++;
        if (customerData.image) completedFields++;
        if (customerData.lastName) completedFields++;
        if (customerData.nearBy) completedFields++;
        if (customerData.panCardName) completedFields++;
        if (customerData.panCardNumber) completedFields++;
        if (customerData.passBookImage) completedFields++;
        if (customerData.pin) completedFields++;
        if (customerData.place) completedFields++;
        if (customerData.signature) completedFields++;
        if (customerData.state) completedFields++;
        if (customerData.upId) completedFields++;
        if (customerData.gst) completedFields++;



        return parseFloat(((completedFields / totalFields) * 100).toFixed(1));
        // Return completion percentage
    }

    function handleShowMissingDetails(customerData) {
        const missingDetails = [];
        if (!customerData.primaryNumber) missingDetails.push('Mobile number');
        if (!customerData.secondaryNumber) missingDetails.push('Secondary mobile number');
        if (!customerData.address) missingDetails.push('Address');
        if (!customerData.email) missingDetails.push('Email');
        if (!customerData.aadhar) missingDetails.push('Aadhar');
        if (!customerData.aadharImage) missingDetails.push('AadharImage');
        if (!customerData.bankName) missingDetails.push('bankName');
        if (!customerData.bankUserName) missingDetails.push('bankUserName');
        if (!customerData.city) missingDetails.push('city');
        if (!customerData.email) missingDetails.push('email');
        if (!customerData.gender) missingDetails.push('gender');
        if (!customerData.ifsc) missingDetails.push('ifsc');
        if (!customerData.image) missingDetails.push('image');
        if (!customerData.lastName) missingDetails.push('lastName');
        if (!customerData.nearBy) missingDetails.push('nearBy');
        if (!customerData.panCardName) missingDetails.push('panCardName');
        if (!customerData.panCardNumber) missingDetails.push('panCardNumber');
        if (!customerData.passBookImage) missingDetails.push('passBookImage');
        if (!customerData.pin) missingDetails.push('pin');
        if (!customerData.place) missingDetails.push('place');
        if (!customerData.signature) missingDetails.push('signature');
        if (!customerData.state) missingDetails.push('state');
        if (!customerData.upId) missingDetails.push('upId');
        if (!customerData.gst) missingDetails.push('gst');


        alert(`Missing details: ${missingDetails.join(', ')}`);
    }





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
            // console.log(response);
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
            const response = await getgolddetailtable(goldLoanId);
            // console.log("checking", response.items);
            const itemDetails = response.items.itemDetails || []; // Safely extract the items array
            const items = response.items || [];
            const fine = response.items.fineDetails || [];
            setFineDetails(fine);
            setSingleloanDetails(items);
            setItemDetails(itemDetails); // Store the items in the state
        } catch (error) {
            console.error('Error fetching customer details:', error);
        }

    }

    const fetchCustomerGoldHistoryTable = async () => {
        try {
            const response = await getgoldbillhistorytable(goldLoanId);
            console.log("checking2", response.items);
            // const itemDetails = response.items.itemDetails || []; // Safely extract the items array
            // const items = response.items || [];
            // const fine = response.items.fineDetails || [];
            // setFineDetails(fine);
            // setSingleloanDetails(items);
            // setItemDetails(itemDetails); // Store the items in the state
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
        if (goldLoanId) {
            fetchCustomerGoldTable();
            fetchCustomerGoldHistoryTable();
        }
    }, [goldLoanId]);

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        if (!goldLoanId || !billDate) {
            alert('Please fill in all required fields.');
            return;
        }

        const data = {
            goldLoanId,
            billDate,
            billNo,
            ...formData,
        };
        console.log("payment name", formData.paymentName);


        const customerData = {
            info: data,
            method: 'post',
            path: 'billing/transaction',
        };

        try {
            setLoading(true);
            await submitData(customerData); // Assuming submitData is defined elsewhere
            dispatch(incrementBillNumber());
            alert('Transaction submitted successfully!');

        } catch (error) {
            console.error('Error submitting transaction:', error);
            alert('Failed to submit the transaction.');
        } finally {
            setLoading(false);
        }
    };

    // Handle date change
    const handleDateChange = (event) => {
        setBillDate(event.target.value);
    };

    const diffDays = differenceInDays(new Date(billDate), new Date(singleloanDetails.lastTransaction),);
    formData.totalAmount = parseFloat(formData.interestRate || 0) + parseFloat(formData.principlePaid || 0);
    const text = diffDays * singleloanDetails.dayAmount;



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

                            <Box display="flex" alignItems="center" gap={1} >
                                <Typography variant="body2" fontWeight="bold">
                                    Receipt No:
                                </Typography>
                                {billNo}
                            </Box>

                            {/* Gold Loan Details */}

                            <h5 style={{
                                color: '#B8860B',
                                fontSize: '18px',
                                marginBottom: '20px',
                                fontWeight: '600',
                                textAlign: 'center', // Centers the text
                            }}>
                                GOLD LOAN TRANSACTION
                            </h5>


                            {/* Date */}
                            <Box display="flex" alignItems="center" gap={1}>
                                <TextField
                                    type="date"
                                    size="small"
                                    label="PURCHASE DATE"
                                    value={new Date(singleloanDetails.purchaseDate).toLocaleDateString('en-CA')} // Format the date to YYYY-MM-DD
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            fontSize: '14px', // Increased label font size
                                            fontWeight: 'bold', // Made label bold
                                            marginBottom: '0px',
                                        },
                                        '& .MuiInputBase-root': {
                                            fontSize: '14px',
                                            paddingTop: '0px',
                                            paddingBottom: '0px',
                                        }
                                    }}
                                    InputLabelProps={{
                                        shrink: true, // Ensures the label doesn't overlap the input
                                    }}
                                    InputProps={{
                                        readOnly: true, // Makes the field read-only
                                    }}
                                />

                            </Box>
                        </Box>

                        {/* Horizontal Fields Layout */}
                        <Grid container spacing={1.5} alignItems="center" id="print-section" >
                            {/* GL Number */}
                            <Grid item xs={6} md={3}>
                                {/* <Typography variant="body2" fontWeight="bold">GL Number</Typography> */}
                                <Autocomplete
                                    options={glOptions}
                                    getOptionLabel={(option) => option.glNo || "Select"}
                                    onChange={handleGlNumberChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            size="small"
                                            label="GL NUMBER"
                                            placeholder="Select GL Number"
                                            fullWidth
                                            sx={{
                                                '& .MuiInputLabel-root': {
                                                    fontSize: '14px', // Increased label font size
                                                    fontWeight: 'bold', // Made label bold
                                                    marginBottom: '0px',
                                                },
                                                '& .MuiInputBase-root': {
                                                    fontSize: '14px',
                                                    paddingTop: '0px',
                                                    paddingBottom: '0px',
                                                }
                                            }}
                                            InputLabelProps={{
                                                shrink: true, // Ensures the label doesn't overlap the input
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Date */}
                            <Grid item xs={6} md={3}>

                                <TextField
                                    type="date"
                                    size="small"
                                    label="TRANSACTION DATE"
                                    fullWidth
                                    value={new Date(singleloanDetails.lastTransaction).toLocaleDateString('en-CA')} // Format the date to YYYY-MM-DD
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            fontSize: '14px', // Increased label font size
                                            fontWeight: 'bold', // Made label bold
                                            marginBottom: '0px',
                                        },
                                        '& .MuiInputBase-root': {
                                            fontSize: '14px',
                                            paddingTop: '0px',
                                            paddingBottom: '0px',
                                        }
                                    }}
                                    InputLabelProps={{
                                        shrink: true, // Ensures the label doesn't overlap the input
                                    }}
                                    InputProps={{
                                        readOnly: true, // Makes the field read-only
                                    }}
                                />

                            </Grid>

                            {/* Date */}
                            <Grid item xs={6} md={3}>
                                {/* <Typography variant="body2" fontWeight="bold">Period End</Typography> */}
                                <TextField
                                    type="date"
                                    size="small"
                                    label="PERIOD END"
                                    fullWidth
                                    value={billDate}
                                    onChange={(e) => setBillDate(e.target.value)}
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            fontSize: '14px', // Increased label font size
                                            fontWeight: 'bold', // Made label bold
                                            marginBottom: '0px',
                                        },
                                        '& .MuiInputBase-root': {
                                            fontSize: '14px',
                                            paddingTop: '0px',
                                            paddingBottom: '0px',
                                        }
                                    }}
                                    InputLabelProps={{
                                        shrink: true, // Ensures the label doesn't overlap the input
                                    }}
                                />
                            </Grid>

                            {/* Payment Mode */}
                            <Grid item xs={6} md={3}>
                                {/* <Typography variant="body2" fontWeight="bold">Payment Mode</Typography> */}
                                <Autocomplete
                                    options={paymentModes}
                                    onChange={handlePaymentModeChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            size="small"
                                            label="PAYMENT MODE"
                                            placeholder="Payment Mode"
                                            fullWidth
                                            sx={{
                                                '& .MuiInputLabel-root': {
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    marginBottom: '0px',
                                                },
                                                '& .MuiInputBase-root': {
                                                    fontSize: '14px',
                                                    paddingTop: '0px',
                                                    paddingBottom: '0px',
                                                },
                                            }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Interest Rate */}
                            <Grid item xs={6} md={3}>
                                <TextField
                                    name="interestRate"
                                    value={formData.interestRate}
                                    onChange={handleChange}
                                    size="small"
                                    label="INTEREST RATE"
                                    fullWidth
                                    placeholder={text.toFixed(2)}
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            fontSize: '14px', // Increased label font size
                                            fontWeight: 'bold', // Made label bold
                                            marginBottom: '0px',
                                        },
                                        '& .MuiInputBase-root': {
                                            fontSize: '14px',
                                            paddingTop: '0px',
                                            paddingBottom: '0px',
                                        }
                                    }}
                                    InputLabelProps={{
                                        shrink: true, // Ensures the label doesn't overlap the input
                                    }}
                                />
                            </Grid>


                            {/* Principal Paid */}
                            <Grid item xs={6} md={3}>
                                {/* <Typography variant="body2" fontWeight="bold">Principal Paid</Typography> */}
                                <TextField
                                    name="principlePaid"
                                    value={formData.principlePaid}
                                    onChange={handleChange}
                                    label="PRINCIPAL PAID"
                                    size="small"
                                    fullWidth
                                    placeholder="Enter Amount"
                                    disabled={formData.interestRate === null || formData.interestRate < text} // Disable if interestRate is null or greater than diffDays

                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            fontSize: '14px', // Label font size
                                            fontWeight: 'bold', // Bold label
                                            marginBottom: '0px',
                                        },
                                        '& .MuiInputBase-root': {
                                            fontSize: '14px',
                                            paddingTop: '0px',
                                            paddingBottom: '0px',
                                        },
                                    }}
                                    InputLabelProps={{
                                        shrink: true, // Prevents label overlap
                                    }}
                                />


                            </Grid>

                            {/*Insurance */}
                            <Grid item xs={6} md={3}>
                                {/* <Typography variant="body2" fontWeight="bold">Insurance</Typography> */}
                                <TextField
                                    name="insurance"
                                    value={formData.insurance}
                                    onChange={handleChange}
                                    size="small"
                                    label="INSURANCE"
                                    fullWidth
                                    placeholder="Enter Insurance"
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            fontSize: '14px', // Increased label font size
                                            fontWeight: 'bold', // Made label bold
                                            marginBottom: '0px',
                                        },
                                        '& .MuiInputBase-root': {
                                            fontSize: '14px',
                                            paddingTop: '0px',
                                            paddingBottom: '0px',
                                        }
                                    }}
                                    InputLabelProps={{
                                        shrink: true, // Ensures the label doesn't overlap the input
                                    }}
                                />
                            </Grid>
                            {/* processing Fee */}
                            <Grid item xs={6} md={3}>
                                {/* <Typography variant="body2" fontWeight="bold">Processing Fee</Typography> */}
                                <TextField
                                    name="processingFee"
                                    value={formData.processingFee}
                                    onChange={handleChange}
                                    label="PROCESSING FEE"
                                    size="small"
                                    fullWidth
                                    placeholder="Enter Processing Fee"
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            fontSize: '14px', // Increased label font size
                                            fontWeight: 'bold', // Made label bold
                                            marginBottom: '0px',
                                        },
                                        '& .MuiInputBase-root': {
                                            fontSize: '14px',
                                            paddingTop: '0px',
                                            paddingBottom: '0px',
                                        }
                                    }}
                                    InputLabelProps={{
                                        shrink: true, // Ensures the label doesn't overlap the input
                                    }}
                                />
                            </Grid>{/*PackingFee */}
                            <Grid item xs={6} md={3}>
                                {/* <Typography variant="body2" fontWeight="bold">PackingFee</Typography> */}
                                <TextField
                                    name="packingFee"
                                    value={formData.packingFee}
                                    onChange={handleChange}
                                    label="PACKING FEE"
                                    size="small"
                                    fullWidth
                                    placeholder="Enter Packing Fee"
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            fontSize: '14px', // Increased label font size
                                            fontWeight: 'bold', // Made label bold
                                            marginBottom: '0px',
                                        },
                                        '& .MuiInputBase-root': {
                                            fontSize: '14px',
                                            paddingTop: '0px',
                                            paddingBottom: '0px',
                                        }
                                    }}
                                    InputLabelProps={{
                                        shrink: true, // Ensures the label doesn't overlap the input
                                    }}
                                />
                            </Grid>{/*Appraiser */}
                            <Grid item xs={6} md={3}>
                                {/* <Typography variant="body2" fontWeight="bold">Appraiser</Typography> */}
                                <TextField
                                    name="appraiser"
                                    value={formData.appraiser}
                                    onChange={handleChange}
                                    label="APPRAISER"
                                    size="small"
                                    fullWidth
                                    placeholder="Enter Appraiser"
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            fontSize: '14px', // Increased label font size
                                            fontWeight: 'bold', // Made label bold
                                            marginBottom: '0px',
                                        },
                                        '& .MuiInputBase-root': {
                                            fontSize: '14px',
                                            paddingTop: '0px',
                                            paddingBottom: '0px',
                                        }
                                    }}
                                    InputLabelProps={{
                                        shrink: true, // Ensures the label doesn't overlap the input
                                    }}
                                />
                            </Grid>{/* Additional Charges */}
                            <Grid item xs={6} md={3}>
                                {/* <Typography variant="body2" fontWeight="bold">Additional Charges</Typography> */}
                                <TextField
                                    name="otherCharges"
                                    value={formData.otherCharges}
                                    onChange={handleChange}
                                    label="OTHER CHARGES"
                                    size="small"
                                    fullWidth
                                    placeholder="Enter Other Charges"
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            fontSize: '14px', // Increased label font size
                                            fontWeight: 'bold', // Made label bold
                                            marginBottom: '0px',
                                        },
                                        '& .MuiInputBase-root': {
                                            fontSize: '14px',
                                            paddingTop: '0px',
                                            paddingBottom: '0px',
                                        }
                                    }}
                                    InputLabelProps={{
                                        shrink: true, // Ensures the label doesn't overlap the input
                                    }}
                                />
                            </Grid>

                            {/* Total Amount */}
                            <Grid item xs={6} md={3}>
                                {/* <Typography variant="body2" fontWeight="bold">Total Amount</Typography> */}
                                <TextField
                                    name="totalAmount"
                                    value={formData.totalAmount}// Dynamically calculate totalAmount
                                    onChange={handleChange} // Handle the change in input, if necessary
                                    label="TOTAL AMOUNT"
                                    size="small"
                                    fullWidth
                                    placeholder="Enter Total Amount"
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            fontSize: '14px', // Increased label font size
                                            fontWeight: 'bold', // Made label bold
                                            marginBottom: '0px',
                                        },
                                        '& .MuiInputBase-root': {
                                            fontSize: '14px',
                                            paddingTop: '0px',
                                            paddingBottom: '0px',
                                        }
                                    }}
                                    InputLabelProps={{
                                        shrink: true, // Ensures the label doesn't overlap the input
                                    }}
                                    InputProps={{
                                        readOnly: true, // Makes the field read-only
                                    }}
                                // Optionally make it read-only if you don't want the user to edit it

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
                                            sx={{
                                                color: 'darkolivegreen', // Default color for the checkbox
                                                '&.Mui-checked': { color: 'teal' }, // Checked state color
                                                '&:hover': { backgroundColor: 'rgba(0, 128, 128, 0.1)' }, // Teal hover effect
                                            }}
                                        />
                                    }
                                    label={<Typography sx={{
                                        color: '#2F4F4F', // Dark slate gray for text
                                        fontSize: 11.5,

                                    }}>INTEREST CALL DETAILS</Typography>}
                                />
                            </Grid>

                            <Grid item xs={6} md={3.7}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={showHistoryTable}
                                            onChange={handleHistoryTableChange}
                                            sx={{
                                                color: 'darkolivegreen', // Default color for the checkbox
                                                '&.Mui-checked': { color: 'teal' }, // Checked state color
                                                '&:hover': { backgroundColor: 'rgba(0, 128, 128, 0.1)' }, // Teal hover effect
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography
                                            sx={{
                                                color: '#2F4F4F', // Dark slate gray for text
                                                fontSize: 11.5,

                                            }}
                                        >
                                            INTEREST HISTORY DETAILS
                                        </Typography>
                                    }
                                />
                            </Grid>




                            <Grid item xs={6} md={2.4}>

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={showPledgeTable}
                                            onChange={handlePledgeCheckboxChange}
                                            color="primary"
                                            sx={{
                                                color: 'darkolivegreen', // Default color for the checkbox
                                                '&.Mui-checked': { color: 'teal' }, // Checked state color
                                                '&:hover': { backgroundColor: 'rgba(0, 128, 128, 0.1)' }, // Teal hover effect
                                            }}
                                        />
                                    }
                                    label={<Typography sx={{
                                        color: '#2F4F4F', // Dark slate gray for text
                                        fontSize: 11.5,

                                    }}>VIEW PLEDGE</Typography>}
                                />

                            </Grid>

                            <Grid item xs={6} md={.2}>
                                <IconButton
                                    color="teal"
                                    size="large"
                                    onClick={handlePrint}
                                    sx={{

                                        fontSize: "0.675rem",
                                        width: "50px",
                                        height: "50px",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <PrintIcon />
                                </IconButton>
                            </Grid>

                            {/* Submit Button */}

                            <Grid item xs={6} md={2.4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>

                                <Tooltip title="Submit Form" arrow>
                                    <IconButton
                                        color="darkolivegreen"
                                        size="large"
                                        onClick={handleSubmit}
                                        sx={{
                                            border: '1px solid',
                                            borderRadius: '8px',
                                            fontSize: '0.675rem',
                                            display: 'flex',
                                            justifyContent: 'space-between', // Adjusts spacing between text and icon
                                            alignItems: 'center',
                                            width: '70%',
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
                                                        <TableCell align="center" sx={{ padding: '4px' }}>{detail.goldItemDetails.goldItem}</TableCell>
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
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>{singleloanDetails.principleAmount}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}> Principle Paid</TableCell>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>{singleloanDetails.principlePaid}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}> Bal Principle Amt</TableCell>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>{singleloanDetails.balancePrincipleAmount}</TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Balance  Interest</TableCell>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>{singleloanDetails.balanceInterest}</TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Other Charges </TableCell>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>{singleloanDetails.totalCharges}</TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Total Amount</TableCell>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>{singleloanDetails.totalChargesAndBalanceAmount}</TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>No Of Days </TableCell>
                                            <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>{singleloanDetails.NumberOfDays}</TableCell>
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
                                        <strong>Address:</strong> {customerData.address || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontSize: 11.5 }}>
                                        <strong>Email:</strong> {customerData.email || 'No Email'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontSize: 11.5 }}>
                                        <strong>Phone:</strong> {customerData.primaryNumber || 'No Phone'}, {customerData.secondaryNumber || 'No Phone'}
                                    </Typography>
                                </Box>

                                {/* Profile completion */}
                                <Box sx={{ mt: .5 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ mt: 0, cursor: 'pointer', fontSize: 11.5 }}
                                    >
                                        <strong> Profile Completion</strong>: {calculateProfileCompletion(customerData)}%
                                    </Typography>


                                    <LinearProgress
                                        variant="determinate"
                                        value={calculateProfileCompletion(customerData)}
                                        sx={{
                                            height: 5,
                                            borderRadius: 10,
                                            cursor: 'pointer',
                                            backgroundColor: '#e0f2f1', // Light teal background
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: '#689689', // Your chosen color for the filled part
                                            },
                                        }}
                                        onClick={() => handleShowMissingDetails(customerData)}
                                    />

                                    {/* <Typography
                                        variant="body2"
                                        sx={{ mt: 0, cursor: 'pointer' }}
                                        onClick={() => handleShowMissingDetails(customerData)}
                                    >
                                        Profile Completion: {calculateProfileCompletion(customerData)}%
                                    </Typography> */}

                                    {/* Clickable area to show missing details */}
                                    {/* <Button
                                        sx={{ mt: 0 }}
                                        variant="outlined"
                                        color="primary"
                                        size='small'
                                        onClick={() => handleShowMissingDetails(customerData)}
                                    >
                                        Show Missing Details
                                    </Button> */}
                                </Box>
                            </Box>
                        </Card>
                    ) : (
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                            Select a GL number to view customer details.
                        </Typography>
                    )}




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
                                                {new Date(detail.purchaseDate).toISOString().split('T')[0]}
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
                                        {loanDetails.map((detail, index) => (
                                            <TableCell key={index} sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>{detail.totalCharges}</TableCell>
                                        ))}
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

                                    <TableRow sx={{ padding: '0px 0' }}>
                                        <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Single Gram (RS)</TableCell>
                                        {loanDetails.map((detail, index) => (
                                            <TableCell key={index} sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>N/A</TableCell>
                                        ))}
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
                                        <TableCell align="center" sx={{ padding: '4px' }}>From Date</TableCell>
                                        <TableCell align="center" sx={{ padding: '4px' }}>To Date</TableCell>
                                        <TableCell align="center" sx={{ padding: '4px' }}> Days </TableCell>
                                        <TableCell align="center" sx={{ padding: '4px' }}>Bal Am </TableCell>
                                        <TableCell align="center" sx={{ padding: '4px' }}> Current Int</TableCell>
                                        <TableCell align="center" sx={{ padding: '4px' }}>Int Bal Amt  </TableCell>
                                        <TableCell align="center" sx={{ padding: '4px' }}>Total Bal Amt</TableCell>
                                        <TableCell align="center" sx={{ padding: '4px' }}>Amt Received </TableCell>
                                        <TableCell align="center" sx={{ padding: '4px' }}> Int Received</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {fineDetails.map((detail, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                                                '&:nth-of-type(even)': { backgroundColor: '#ffffff' },
                                                height: '24px',
                                            }}
                                        >
                                            <TableCell align="center" sx={{ padding: '4px' }}>{new Date(detail.createdAt).toISOString().split('T')[0]} </TableCell>
                                            <TableCell align="center" sx={{ padding: '4px' }}> {new Date(detail.updatedAt).toISOString().split('T')[0]}</TableCell>
                                            <TableCell align="center" sx={{ padding: '4px' }}></TableCell>
                                            <TableCell align="center" sx={{ padding: '4px' }}>{detail.balanceAmount}</TableCell>
                                            <TableCell align="center" sx={{ padding: '4px' }}> {detail.interestRate?.toFixed(2)}</TableCell>
                                            <TableCell align="center" sx={{ padding: '4px' }}></TableCell>
                                            <TableCell align="center" sx={{ padding: '4px' }}>{detail.totalChargesAndBalanceAmount}</TableCell>
                                            <TableCell align="center" sx={{ padding: '4px' }}>{detail.amountPaid}</TableCell>
                                            <TableCell align="center" sx={{ padding: '4px' }}></TableCell>
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
                                    <TableRow

                                        sx={{
                                            '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                                            '&:nth-of-type(even)': { backgroundColor: '#ffffff' },
                                            height: '24px',
                                        }}
                                    >
                                        <TableCell align="center" sx={{ padding: '4px' }}>{singleloanDetails.glNo}</TableCell>
                                        <TableCell align="center" sx={{ padding: '4px' }}>{singleloanDetails.lastTransaction}</TableCell>
                                        <TableCell align="center" sx={{ padding: '4px' }}>detail.</TableCell>
                                        <TableCell align="center" sx={{ padding: '4px' }}>{singleloanDetails.amountPaid}</TableCell>
                                        <TableCell align="center" sx={{ padding: '4px' }}>detail.</TableCell>
                                        <TableCell align="center" sx={{ padding: '4px' }}>detail.</TableCell>
                                    </TableRow>

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

                <Modal open={isModalOpen} onClose={handleCloseModal}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 300,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                        }}
                    >
                        <h3>Payment Details</h3>
                        <div>
                            <p><strong>Selected Mode:</strong> {selectedPaymentMode}</p>
                            <TextField
                                fullWidth
                                label="Name"
                                name='paymentName'
                                variant="outlined"
                                value={formData.paymentName}
                                onChange={handleChange}
                                size="small"
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label={`${selectedPaymentMode} Number`}
                                variant="outlined"
                                name='paymentNumber'
                                value={formData.paymentNumber}
                                onChange={handleChange}
                                size="small"
                                sx={{ mb: 2 }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleCloseModal}
                            >
                                Submit
                            </Button>
                        </div>
                    </Box>
                </Modal>


            </div>

        </Box >
    );
}
