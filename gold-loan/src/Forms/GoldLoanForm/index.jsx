import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import {
    Box, TextField, Button, IconButton, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Autocomplete, Grid,
    Typography, ToggleButtonGroup, ToggleButton, FormControl,
    InputLabel, Select, MenuItem, Divider, Rating
} from '@mui/material';
import { Card, CardContent, Avatar, FormControlLabel, Switch, } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SaveIcon from '@mui/icons-material/Save'; // Import the Save icon


import { AddNomineeDetails } from '../../Forms';
import { incrementGLNo } from '../../Redux/GlNoSlice';
import { incrementVoucherNo } from '../../Redux/voucherNoSlice';
import { useParams } from 'react-router-dom';
import { submitDocument } from '../../api';
import { useNominee } from '../../configure/NomineeContext';
import { getCustomerDetails, updateCustomerRating } from '../../services/customer/customer.service';
import { getgolditemdetails, getcustomergoldloandetails } from '../../services/goldItems/goldItems.service';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';



const GoldLoanForm = () => {
    const dispatch = useDispatch();
    const webcamRef = useRef(null); // Ref to access the webcam
    const formRef = useRef();

    const [form, setForm] = useState({
        principleAmount: '',
        insurance: '',
        processingFee: '',
        packingFee: '',
        appraiser: '',
        otherCharges: '',
        range: '',
        interestMode: 'simple',
        interestPercentage: '14',
        companyGoldRate: '4000',
    });

    const [items, setItems] = useState([]);
    const [newItem, setNewItems] = useState({
        id: 1,
        type: 'Select',
        quantity: '',
        grossWeight: '',
        stoneWeight: '',
        depreciation: '',
        netWeight: '', // User input for net weight
    });

    const [customerData, setCustomerData] = useState(null);
    const [options, setOptions] = useState([]);
    const [fileImage, setFileImage] = useState({ goldImage: null, capture: null, }); // State to store the uploaded image and signature
    const [usingWebcam, setUsingWebcam] = useState(false); // Toggle between file upload and webcam   
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentMode, setPaymentMode] = useState('Cash');
    const [purchaseDate, setSelectedDate] = useState(null);
    const [rating, setRating] = useState(0); // State to store the rating value
    const [interestType, setInterestType] = useState('simple');
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [loanDetails, setLoanDetails] = useState([]);

    const glNo = useSelector((state) => state.glNo.glNo);
    const voucherNo = useSelector((state) => state.voucherNo.voucherNo);

    const { customerId } = useParams();
    const { nominee } = useNominee();// Access nominee data from context
    const nId = nominee.nomineeId;

    const [showErrors, setShowErrors] = useState(false); // Controls when to show validation errors
    const [errors, setErrors] = useState({
        principleAmount: false,
        insurance: false,
        processingFee: false,
        packingFee: false,
        appraiser: false,
        otherCharges: false,
        nId: false,
        goldImage: false,
    });

    const goldRate = 5000;

    const totalNetWeight = items.reduce((total, item) => total + (parseFloat(item.netWeight) || 0), 0);
    const totalGrossWeight = items.reduce((total, item) => total + (parseFloat(item.grossWeight) || 0), 0);
    const totalStoneWeight = items.reduce((total, item) => total + (parseFloat(item.stoneWeight) || 0), 0);
    const totalDepWeight = items.reduce((total, item) => total + (parseFloat(item.depreciation) || 0), 0);
    const totalQuantity = items.reduce((total, item) => total + (parseFloat(item.quantity) || 0), 0);
    const recommendedAmount = totalNetWeight * goldRate;
    const totalCharges = (parseFloat(form.otherCharges) || 0) + (parseFloat(form.appraiser) || 0) + (parseFloat(form.insurance) || 0) + (parseFloat(form.processingFee) || 0) + (parseFloat(form.packingFee) || 0);

    // Function to auto-calculate Net Weight
    const calculateNetWeight = (quantity, grossWeight, stoneWeight, depreciation) => {

        const grossWt = parseFloat(grossWeight) || 0;
        const stoneWt = parseFloat(stoneWeight) || 0;
        const depWt = parseFloat(depreciation) || 0;
        const netWeight = grossWt - (stoneWt + depWt);
        return netWeight
    };

    // Add a new row to the table
    const handleAddRow = () => {
        if (newItem.netWeight !== "") {
            setItems((prevItems) => [
                ...prevItems,
                { ...newItem, id: prevItems.length + 1 }
            ]);
            // Reset newItem to its initial state
            setNewItems({
                id: newItem.id + 1, // Increment ID for the next item
                type: 'Select',
                quantity: '',
                grossWeight: '',
                stoneWeight: '',
                depreciation: '',
                netWeight: '',
            });
        }
    };

    const handleChange = (field, value, type, goldItemId) => {
        setNewItems((prevState) => {
            const updatedItem = {
                ...prevState,
                [field]: value,
            };

            // Assign goldItem ID if provided
            if (goldItemId) {
                updatedItem.goldItem = goldItemId;
            }

            // Calculate netWeight if relevant fields are updated
            if (["quantity", "grossWeight", "stoneWeight", "depreciation"].includes(field)) {
                updatedItem.netWeight = calculateNetWeight(
                    updatedItem.quantity || 0,
                    updatedItem.grossWeight || 0,
                    updatedItem.stoneWeight || 0,
                    updatedItem.depreciation || 0
                );
            }

            // Handle type for dropdown selections (goldItem)
            if (field === "goldItem" && value) {
                updatedItem.type = options.find((option) => option._id === value)?.goldItem || "Select";
            }

            return updatedItem;
        });
    };

    const handleChangeItem = (id, gId, field, value) => {
        setItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === id) {
                    const updatedItem = {
                        ...item,
                        [field]: value,
                    };
                    if (gId) {
                        updatedItem.goldItem = gId;
                        updatedItem.type = options.find((option) => option._id === gId)?.goldItem || item.type;
                    }
                    // Recalculate net weight if applicable
                    if (["quantity", "grossWeight", "stoneWeight", "depreciation"].includes(field)) {
                        updatedItem.netWeight = calculateNetWeight(
                            updatedItem.quantity,
                            updatedItem.grossWeight,
                            updatedItem.stoneWeight,
                            updatedItem.depreciation
                        );
                    }
                    return updatedItem;
                }
                return item;
            })
        );
    };

    // Handle changes when editing a row
    const handleChangeInRow = (id, field, value) => {
        const updatedItems = items.map((item) => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value }; // Update the specific field

                // Recalculate netWeight if relevant fields are updated
                if (["quantity", "grossWeight", "stoneWeight", "depreciation"].includes(field)) {
                    updatedItem.netWeight = calculateNetWeight(
                        updatedItem.quantity || 0,
                        updatedItem.grossWeight || 0,
                        updatedItem.stoneWeight || 0,
                        updatedItem.depreciation || 0
                    );
                }

                return updatedItem;
            }
            return item;
        });
        setItems(updatedItems);
    };


    // Toggle edit mode for a specific row
    const toggleEditMode = (id) => {
        const updatedItems = items.map((item) => {
            if (item.id === id) {
                return { ...item, isEditing: !item.isEditing };
            }
            return item;
        });
        setItems(updatedItems);
    };

    // Handle deleting a row
    const handleDelete = (id) => {
        const updatedItems = items.filter((item) => item.id !== id);
        setItems(updatedItems);
    };

    // Handle saving the changes after editing
    const handleSaveRow = (id) => {
        toggleEditMode(id); // Save changes and toggle back to view mode
    };

    const handleChangeForm = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleSwitchChange = (event) => {
        const newMode = event.target.checked ? 'Debit' : 'Cash';
        setPaymentMode(newMode);
        console.log('Payment Mode:', newMode); // Log the new payment mode
    };

    const handleInterestChange = (event, newType) => {
        setInterestType(newType);  // Update the interestType state
        // Update the interestType state

        console.log(newType);

        // If 'multiple' is selected, set interestMode to a valid option like 'monthly'
        if (newType === 'multiple') {
            setForm(prevState => ({
                ...prevState,
                interestMode: 'monthly'  // Default valid value when 'multiple' is selected
            }));
        } else {
            // For other values like 'simple' or 'range', reset the interestMode if necessary
            setForm(prevState => ({
                ...prevState,
                interestMode: newType // Reset or keep it empty for other types
            }));
        }
    };

    // Handle dropdown value change (when 'multiple' mode is selected)
    const handleChangeMode = (event) => {
        const { value } = event.target;
        setForm(prevState => ({
            ...prevState,
            interestMode: value  // Update the interestMode directly based on dropdown selection
        }));
    };

    const handleButtonClick = () => {
        const fileInput = document.getElementById("goldImage");
        // Attach a one-time event listener to capture the selected file
        fileInput.addEventListener("change", (e) => {
            const { files, name } = e.target;
            if (files && files[0]) {
                setFileImage({ ...fileImage, [name]: files[0] });
            }
        }, { once: true });

        // Trigger file input click
        fileInput.click();
    };

    const handleCloseImage = () => {
        setFileImage({ ...fileImage, goldImage: null }); // Clear the uploaded image
    };

    const handleCloseCapture = () => {
        setFileImage({ ...fileImage, capture: null }); // Clear the captured image
    };

    // Use the customerId to fetch customer data
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

    const fetchGoldItems = async () => {
        try {
            const response = await getgolditemdetails();
            if (response.isSuccess && response.items) {
                setOptions(response.items);
            }
            console.log(response);

        } catch (error) {
            console.error("Error fetching customer data:", error);
            setLoading(false);
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

    useEffect(() => {
        fetchGoldItems();
        fetchCustomerData();
        fetchCustomerGoldDetailsData();
    }, [customerId]);

    // Display GL number when form loads
    useEffect(() => {
    }, [glNo]);
    useEffect(() => {
        // Log or display the voucher number in your UI, or handle any initialization
    }, [voucherNo]);
    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0]; // Formats as YYYY-MM-DD
        setSelectedDate(formattedDate);
    }, []);

    // Example to load some sample data for the table
    useEffect(() => {
        // Simulate fetching or setting table data
        setTableData([
            { column1: 'Data 1', column2: 'Data 2' },
            { column1: 'Data 3', column2: 'Data 4' },
            { column1: 'Data 5', column2: 'Data 6' }
        ]);
    }, []);

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

    // Handle webcam capture
    const captureImage = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot(); // Capture image from webcam as Base64
        setFileImage({ ...fileImage, capture: imageSrc });  // Set Base64 image
        setUsingWebcam(false); // Hide the webcam after capture
    }, [webcamRef, fileImage]);

    const base64ToBlob = (base64Data, contentType = '') => {
        const byteCharacters = atob(base64Data.split(',')[1]); // Decode Base64 string
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: contentType });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {
            principleAmount: form.principleAmount === '',
            insurance: form.insurance === '',
            processingFee: form.processingFee === '',
            packingFee: form.packingFee === '',
            appraiser: form.appraiser === '',
            otherCharges: form.otherCharges === '',
            nId: !nId || nId === '',
            goldImage: !(fileImage.goldImage || fileImage.capture), // Ensure at least one image is provided
        };


        setErrors(newErrors);
        setShowErrors(true); // Show validation messages only on submit

        console.log(errors.fileImage);
        console.log(fileImage.goldImage);
        // If any field is invalid, return early
        if (Object.values(newErrors).includes(true)) {
            return;
        }


        const invalidRow = items.some(item => {
            return (
                item.quantity === '' ||
                item.grossWeight === '' ||
                item.stoneWeight === '' ||
                item.depreciation === ''
            );
        });

        console.log(totalNetWeight);

        if (invalidRow) {
            return alert('Please fill out all fields correctly before adding a new item.');
        }
        console.log(form.interestMode);



        const formData = new FormData();
        formData.append('principleAmount', form.principleAmount);
        formData.append('appraiser', form.appraiser);
        formData.append('insurance', form.insurance);
        formData.append('interestMode', form.interestMode);
        formData.append('packingFee', form.packingFee);
        formData.append('processingFee', form.processingFee);
        formData.append('goldImage', fileImage.goldImage);
        formData.append("nomineeId", nId);
        formData.append("otherCharges", form.otherCharges);
        formData.append("totalNetWeight", totalNetWeight);
        formData.append("interestPercentage", form.interestPercentage);
        formData.append("paymentMode", paymentMode);
        formData.append("companyGoldRate", form.companyGoldRate);
        formData.append("glNo", glNo);  // Example for GL Number
        formData.append("voucherNo", voucherNo);  // Example for Voucher Number
        formData.append("customerId", customerId);
        formData.append("purchaseDate", purchaseDate);
        formData.append("goldRate", goldRate);
        formData.append("totalCharges", totalCharges);
        // Add the image (either captured or selected)
        if (fileImage.capture) {
            let blob = base64ToBlob(fileImage.capture, 'image/jpeg'); // Convert Base64 to Blob
            // Generate a unique filename using current date and time
            const timestamp = new Date().toISOString().replace(/[-:.]/g, ''); // Removes characters not allowed in filenames
            const filename = `webcam_image_${timestamp}.jpg`; // e.g., 'webcam_image_20241018T123456.jpg'
            const fileWithFileName = new File([blob], filename, { type: 'image/jpeg' });// Create a new File from the Blob to include the filename
            fileImage.goldImage = fileWithFileName; // Assign it to fileImage.image
            formData.append('goldImage', fileImage.goldImage); // Append Blob with a file name
        }
        console.log(newItem);
        console.log("nothing");
        console.log(items);

        items.forEach((item, index) => {
            formData.append(`itemDetails[${index}].goldItem`, item.goldItem);
            formData.append(`itemDetails[${index}].netWeight`, item.netWeight);
            formData.append(`itemDetails[${index}].grossWeight`, item.grossWeight);
            formData.append(`itemDetails[${index}].quantity`, item.quantity);
            formData.append(`itemDetails[${index}].depreciation`, item.depreciation);
            formData.append(`itemDetails[${index}].stoneWeight`, item.stoneWeight);
        });
        try {
            const response = {
                info: formData,
                method: 'post',
                path: 'customer/gold/loan-details'
            }
            console.log(response);


            let res = await submitDocument(response);
            console.log(res);

            alert(res.message);

            if (res.status === 201) {

                dispatch(incrementGLNo());
                dispatch(incrementVoucherNo());
            } else {
                console.error("Failed to submit form:", res.message);
            }
        } catch (error) {
            console.error("Error submitting form:", error.message);
            alert(error.message);
        }
    };

    const handleDownloadPDF = async () => {
        // Ensure that the table is rendered before capturing
        const input = document.getElementById('table-section');
        if (input) {
            const canvas = await html2canvas(input, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 190; // Adjust this width for your layout
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Add the image to the PDF, then save it
            pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
            pdf.save("table-details.pdf");
        }
    };

    return (
        <Box sx={{ display: 'flex', p: 2, width: '100%', mx: 'auto', mt: 1 }}>
            <Box sx={{ flex: 2, p: 1 }} ref={formRef}>

                <Typography variant="subtitle1">GoldLoanForm</Typography>

                <Box id="table-section"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ width: '100%' }}
                >

                    <center> <Typography variant="overline">GL No: {glNo} </Typography > </center>

                    <TextField
                        label="Select Date"
                        type="date"
                        value={purchaseDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true, // Ensures the label is positioned correctly
                        }}
                        size="small" // Makes the input compact
                        sx={{
                            height: '35px', // Reduces the height of the TextField
                            '& .MuiInputBase-root': {
                                minHeight: '20px', // Ensures the inner input area is smaller
                                fontSize: '0.7rem', // Adjusts font size for a more compact look
                                padding: '4px 8px', // Adds padding to make the input more compact
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: '0.77rem', // Adjusts label font size
                            },
                        }}
                    />
                </Box>
                {/* <ItemDetailsTable /> */}

                {errors.nId ? (
                    <Typography style={{ color: 'red', marginRight: '12%', fontSize: '0.675rem', width: '100%' }}>
                        Nominee ID is required
                    </Typography>
                ) : (
                    <Typography style={{ color: 'transparent', fontSize: '0.675rem', width: '100%' }}>
                        {/* Placeholder for non-error state, this keeps the layout intact */}
                    </Typography>
                )}

                <TableContainer sx={{ mb: 2, height: 200, overflowY: 'auto', '&::-webkit-scrollbar': { width: '1px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '4px', '&:hover': { backgroundColor: '#555' } }, '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '4px' } }}>
                    {/* Check if tableData is not empty */}
                    {tableData.length === 0 ? (
                        <p>No data available</p>
                    ) : (<Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow sx={{ height: '5px', '& .MuiTableCell-root': { padding: '0px' } }}>
                                <TableCell colSpan={8} sx={{ padding: '2px', borderBottom: '1px solid #ccc' }}>
                                    {/* Left side: AddNomineeDetails and Error message */}
                                    <Box display="flex" alignItems="center">
                                        <AddNomineeDetails />

                                    </Box>
                                    {/* Right side: Add Item button */}
                                    <Box mt={-5} display="flex" justifyContent="flex-end">
                                        {/* Webcam Toggle Button */}
                                        <IconButton color="primary">
                                            <PhotoCamera onClick={() => setUsingWebcam(!usingWebcam)} startIcon={!usingWebcam && <PhotoCamera />} sx={{ ml: 2 }} />
                                            {usingWebcam ? '' : null}
                                        </IconButton>
                                        {/* File Upload Button */}
                                        <input
                                            type="file"
                                            id="goldImage"
                                            name='goldImage'
                                            style={{ display: 'none' }}
                                            accept="image/*" // Ensure only images can be selected
                                        />
                                        <IconButton color="primary" name='goldImage' onClick={handleButtonClick}>
                                            <FileUploadIcon />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                {['Item Details', 'No', 'Gross Wt', 'Stone Wt', 'Dep Wt', 'Net Wt', 'Actions'].map((header) => (
                                    <TableCell key={header} sx={{ fontSize: '12px', backgroundColor: '#f0f0f0', padding: '4px', borderBottom: '1px solid #ccc' }}>
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* New Item Input Row */}
                            <TableRow sx={{
                                height: '10px', // Adjust row height 
                            }}>
                                < TableCell sx={{ fontSize: '6px', padding: '1px', borderBottom: '1px solid #ccc' }}>

                                    <Autocomplete
                                        options={options}
                                        getOptionLabel={(option) => option.goldItem || "Select"}
                                        onChange={(event, newValue) => {
                                            const goldItemId = newValue?._id || "";
                                            const goldItemLabel = newValue?.goldItem || "Select";
                                            handleChange("goldItem", goldItemId, "goldItem", goldItemId);
                                            handleChange("type", goldItemLabel, "goldItem", goldItemId);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                size="small"
                                                placeholder="Select Gold Item"
                                            />
                                        )}
                                        sx={{
                                            '& .MuiAutocomplete-inputRoot': {
                                                fontSize: '0.675rem',
                                                height: 20,
                                            },
                                            '& .MuiInputBase-input': {
                                                padding: '1px 1px',
                                            },
                                            width: 130,

                                        }}
                                    />

                                </TableCell>

                                {['quantity', 'grossWeight', 'stoneWeight', 'depreciation'].map((field) => (
                                    <TableCell key={field} sx={{ fontSize: '8px', padding: '4px', borderBottom: '1px solid #ccc' }}>
                                        <TextField
                                            value={newItem[field] || ""}
                                            onChange={(e) =>
                                                handleChange(field, e.target.value, "goldItem", newItem.goldItem || "")
                                            }
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            sx={{
                                                fontSize: '0.875rem',
                                                '& .MuiOutlinedInput-root': {
                                                    height: '20px',
                                                    fontSize: '0.875rem',
                                                },
                                                '& .MuiInputBase-input': {
                                                    padding: '1px 1px',
                                                },
                                            }}
                                        />
                                    </TableCell>
                                ))}

                                <TableCell sx={{ fontSize: '8px', padding: '4px', borderBottom: '1px solid #ccc' }}>
                                    <TextField
                                        value={newItem.netWeight || ""}
                                        onChange={(e) =>
                                            handleChange('netWeight', e.target.value, "goldItem", newItem.goldItem || "")
                                        }
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        sx={{
                                            fontSize: '0.875rem',
                                            '& .MuiOutlinedInput-root': {
                                                height: '20px',
                                                fontSize: '0.875rem',
                                            },
                                            '& .MuiInputBase-input': {
                                                padding: '1px 1px',
                                            },
                                        }}
                                    />
                                </TableCell>

                                <TableCell sx={{ padding: '4px' }}>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={handleAddRow}
                                    >
                                        <AddIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>

                            </TableRow>

                            {/* Displaying Items */}
                            {items.map((item) => (
                                <TableRow
                                    key={item.id}
                                    onDoubleClick={() => toggleEditMode(item.id)}
                                    sx={{

                                        height: '10px', // Adjust row height
                                        '&:hover': { backgroundColor: '#f5f5f5' }, // Optional hover effect
                                    }}
                                >
                                    <TableCell sx={{ padding: '2px', fontSize: '0.65rem', height: '10px', }}>
                                        {item.isEditing ? (
                                            <Autocomplete
                                                options={options}
                                                getOptionLabel={(option) => option.goldItem || "Select"}
                                                value={options.find((opt) => opt._id === item.goldItem) || null} // Current selected value
                                                onChange={(event, newValue) => {
                                                    const goldItemId = newValue?._id || "";
                                                    handleChangeItem(item.id, goldItemId, "goldItem", newValue?.goldItem || "Select");
                                                }}
                                                renderInput={(params) => (
                                                    <TextField {...params} variant="outlined" size="small" placeholder="Select Gold Item" />
                                                )}

                                                sx={{
                                                    '& .MuiAutocomplete-inputRoot': {
                                                        fontSize: '0.675rem',
                                                        height: 20,
                                                    },
                                                    '& .MuiInputBase-input': {
                                                        padding: '1px 1px',
                                                    },
                                                    width: 130,

                                                }}
                                            />
                                        ) : (
                                            <span style={{ fontSize: "0.6rem" }}>{item.type}</span>
                                        )}
                                    </TableCell>

                                    {['quantity', 'grossWeight', 'stoneWeight', 'depreciation', 'netWeight'].map((field) => (
                                        <TableCell key={field} sx={{ padding: '2px', fontSize: '0.65rem', height: '10px', }}>
                                            {item.isEditing ? (
                                                <TextField
                                                    value={item[field]}
                                                    onChange={(e) => handleChangeInRow(item.id, field, e.target.value)}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        fontSize: '0.875rem',
                                                        '& .MuiOutlinedInput-root': {
                                                            height: '22px',
                                                            fontSize: '0.75rem',
                                                        },
                                                        '& .MuiInputBase-input': {
                                                            padding: '2px 2px',
                                                        },
                                                    }}
                                                />
                                            ) : (
                                                <span style={{ fontSize: '0.7rem' }}>{item[field]}</span>
                                            )}
                                        </TableCell>
                                    ))}

                                    <TableCell sx={{ padding: '0px' }}>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDelete(item.id)}
                                            sx={{ padding: '1px' }} // Reduce button padding

                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                        {item.isEditing && (
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleSaveRow(item.id)}
                                                sx={{ padding: '1px' }} // Reduce button padding
                                            >
                                                <SaveIcon fontSize="small" /> {/* Add the Save icon */}
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>)}

                </TableContainer>

                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    marginTop: '-15px',
                    backgroundColor: '#ffffff',
                }}>
                    <tbody>
                        <tr>
                            <td style={{ padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>No: 5</td>
                            <td style={{ padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>Qty: {totalQuantity.toFixed(2)}</td>
                            <td style={{ padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>Gr Wt: {totalGrossWeight.toFixed(2)}</td>
                            <td style={{ padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>St Wt:{totalStoneWeight.toFixed(2)}</td>
                            <td style={{ padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>Dpt Wt: {totalDepWeight.toFixed(2)}</td>
                            <td style={{ padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>Net Wt: {totalNetWeight.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>

                <Grid container spacing={0.5} sx={{ mb: 2 }}>
                    {[
                        { label: 'principle Amount', name: 'principleAmount' },
                        { label: 'Processing Fee', name: 'processingFee' },
                        { label: 'Packing Fee', name: 'packingFee' },
                        { label: 'Appraiser Fee', name: 'appraiser' },
                        { label: 'Insurance Fee', name: 'insurance' },
                        { label: 'Other Charges', name: 'otherCharges' }
                    ].map((field, index) => (
                        <Grid item xs={4} key={index}>
                            <TextField
                                type="number"
                                label={field.label}
                                name={field.name}
                                value={form[field.name]}
                                error={errors[field.name]} // Display error if field has error
                                helperText={errors[field.name] ? `${field.label} must be a valid number` : ''} // Error message below the field
                                onChange={handleChangeForm}
                                fullWidth
                                margin="dense"
                                size="small"
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
                    ))}
                </Grid>

                {/* interest calaculation and image upload and capture */}
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Interest Calculation</Typography>

                <Box sx={{ textAlign: 'right', mt: -4 }}>
                    <div>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={paymentMode === 'Debit'}
                                    onChange={handleSwitchChange}
                                    color="primary"
                                />
                            }
                            label={paymentMode === 'Debit' ? 'Debit' : 'Cash'}
                        />
                    </div>

                </Box>

                <ToggleButtonGroup
                    color="primary"
                    value={interestType}
                    exclusive
                    onChange={handleInterestChange}
                    size="small"
                    sx={{ mt: 0, textAlign: 'left', }}
                >
                    <ToggleButton value="simple">Simple</ToggleButton>
                    <ToggleButton value="multiple">Multiple</ToggleButton>
                    <ToggleButton value="range">Range</ToggleButton>
                </ToggleButtonGroup>

                {interestType === 'multiple' && (
                    <Box sx={{ mt: 1 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Mode</InputLabel>
                            <Select
                                name="interestMode"
                                value={form.interestMode}
                                label="Mode"
                                onChange={handleChangeMode}
                                sx={{ width: '50%', textAlign: 'left', font: '8px' }}
                            >
                                <MenuItem value="days">Days</MenuItem>
                                <MenuItem value="weekly">Weekly</MenuItem>
                                <MenuItem value="monthly">Monthly</MenuItem>
                                <MenuItem value="quarterly">Quarterly</MenuItem>
                                <MenuItem value="halfyearly">Half Yearly</MenuItem>
                            </Select>
                        </FormControl>
                        {form.mode && (
                            <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                                Selected Mode: {
                                    form.mode === 'weekly' ? 'Weekly' :
                                        form.mode === 'monthly' ? 'Monthly' :
                                            form.mode === 'quarterly' ? 'Quarterly' :
                                                form.mode === 'halfyearly' ? 'Half Yearly' :
                                                    form.mode === 'days' ? 'Days' :
                                                        ''
                                }
                            </Typography>
                        )}
                    </Box>
                )}

                {interestType === 'range' && (
                    <Box sx={{ mt: 1 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Mode</InputLabel>
                            <Select
                                name="interestMode"
                                value={form.interestMode}
                                label="Mode"
                                onChange={handleChangeMode}
                                sx={{ width: '50%', textAlign: 'left', font: '8px' }}
                            >
                                <MenuItem value="days">Days</MenuItem>
                                <MenuItem value="weekly">Weekly</MenuItem>
                                <MenuItem value="monthly">Monthly</MenuItem>
                                <MenuItem value="quarterly">Quarterly</MenuItem>
                                <MenuItem value="halfyearly">Half Yearly</MenuItem>
                            </Select>
                        </FormControl>
                        {form.mode && (
                            <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                                Selected Mode: {
                                    form.mode === 'weekly' ? 'Weekly' :
                                        form.mode === 'monthly' ? 'Monthly' :
                                            form.mode === 'quarterly' ? 'Quarterly' :
                                                form.mode === 'halfyearly' ? 'Half Yearly' :
                                                    form.mode === 'days' ? 'Days' :
                                                        ''
                                }
                            </Typography>
                        )}
                    </Box>
                )}


                <Grid container justifyContent="flex-end" sx={{ mt: 2, position: 'sticky', bottom: 0, backgroundColor: 'white', zIndex: 1 }}>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit} // Your submit handler function
                        >
                            Submit
                        </Button>
                    </Grid>
                    {/* PDF Download Button with Icon */}
                    <IconButton
                        color="primary"
                        onClick={handleDownloadPDF}
                        sx={{ ml: 2 }}
                    >
                        <PictureAsPdfIcon />
                    </IconButton>
                </Grid>
            </Box>

            {/* display the image and summary details */}

            <Box sx={{ flex: 1, p: 1, mt: -2 }}>
                <Box
                    mt={2}
                    sx={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '600px',  // Maximum width for a more contained layout
                        height: '200px',    // Fixed height for consistency
                        backgroundColor: '#f4f4f9', // Light, professional background
                        borderRadius: '8px', // Rounded corners for a modern look
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '16px', // Padding inside the box
                        overflow: 'hidden', // Hide excess content for a clean look
                    }}
                >
                    {usingWebcam && (
                        <Box mt={2}>
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                width="100%"  // Ensures webcam stretches to the full width of the box
                                height="130px"
                            />
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={captureImage}
                                sx={{ mt: 2 }}
                                size='small'
                            >
                                Capture Image
                            </Button>
                        </Box>
                    )}

                    {/* Display the selected image preview  */}
                    {fileImage.goldImage && !fileImage.capture && (
                        <div style={{ marginTop: '10px' }}>
                            <img src={URL.createObjectURL(fileImage.goldImage)} alt="Selected" style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover', }} />
                            <IconButton
                                onClick={handleCloseImage}
                                style={{ position: 'absolute', top: 0, right: 0, padding: '0' }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </div>
                    )}
                    {fileImage.capture && (
                        <Box mt={2} position="relative">
                            <img src={fileImage.capture} alt="Captured Image" style={{ maxWidth: '100%', height: '180px' }} />
                            <IconButton
                                onClick={handleCloseCapture}
                                style={{ position: 'absolute', top: 0, right: 0, padding: '0' }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    )}
                </Box>
                {/* Validation message for goldImage */}
                {showErrors && errors.goldImage && (
                    <Typography sx={{ mt: 2, color: 'red', fontSize: '0.975rem' }}>
                        Gold image or captured image is required
                    </Typography>
                )}
                {/* Summary Table at the bottom */}
                <Box sx={{ flex: 1, p: 2, }}>
                    <Typography variant="subtitle1">Summary Table</Typography>
                    <TableContainer component={Paper} sx={{ mb: 3 }}>
                        <Table>

                            <TableHead>
                                <Typography variant="overline"> Vr No: {voucherNo}</Typography >

                            </TableHead>

                            <TableBody>
                                <TableRow>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Current Gold Rate</TableCell>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>{goldRate}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Gold Loan Rate</TableCell>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>{goldRate}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Max Gold Value</TableCell>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>{totalNetWeight.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Max Gold Loan Value</TableCell>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>{recommendedAmount.toFixed(2)}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Total Charges</TableCell>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>{totalCharges}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>

            {/* Customer Details */}

            <Box sx={{ flex: 1, p: 2 }}>
                {customerData && (
                    <Card
                        sx={{
                            width: { xs: '50%', sm: '365px' },
                            borderRadius: 2,
                            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
                            backgroundColor: '#ffffff',
                            display: 'flex',
                            flexDirection: 'row',
                            padding: 2,
                            gap: 2,
                            mt: -1,
                        }}
                    >
                        {/* Left Section: Avatar with Background */}
                        <Box
                            sx={{
                                width: '30%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: ' #e8f5e9',
                                borderRadius: 2,
                            }}
                        >
                            <Avatar
                                alt="Profile"
                                src={`http://localhost:4000${customerData.image.path}`}
                                sx={{
                                    width: 90,
                                    height: 100,
                                    border: '4px solid #ffffff',
                                    objectFit: 'cover',
                                }}
                            />
                        </Box>

                        {/* Right Section: Details */}
                        <Box
                            sx={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                padding: 1,
                            }}
                        >
                            {/* Header */}
                            <Box>
                                <Typography
                                    variant="body1"
                                    fontWeight="bold"
                                    sx={{ color: '#004d40' }}
                                >
                                    {customerData.firstName} {customerData.lastName}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                >
                                    {customerData.state},INDIA
                                </Typography>
                            </Box>

                            {/* Rating */}
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Rating
                                    name="profile-rating"
                                    value={customerData.rating}
                                    onChange={handleRatingChange}
                                    precision={0.5}
                                />
                            </Box>

                            {/* Contact Information */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                    color: 'text.secondary',
                                }}
                            >
                                <Typography variant="body2" sx={{ fontSize: 11.5 }}>
                                    <strong>Address:</strong> {customerData.address},{' '}
                                    {customerData.place}, {customerData.pin}
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: 11.5 }}>
                                    <strong>Mobile:</strong> {customerData.primaryNumber}, {customerData.secondaryNumber}
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: 11.5 }}>
                                    <strong>Email:</strong> {customerData.email}
                                </Typography>
                            </Box>
                        </Box>
                    </Card>

                )}



                <Box sx={{ maxWidth: 360, margin: '0 auto', mt: 1, textAlign: { xs: 'center', sm: 'left' }, px: { xs: 2, sm: 0 } }}>
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
            </Box>
        </Box >
    );
};
export default GoldLoanForm;