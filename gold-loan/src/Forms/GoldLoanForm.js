import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import {
    Box, TextField, Button, IconButton, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Autocomplete, Grid,
    Typography, ToggleButtonGroup, ToggleButton, FormControl,
    InputLabel, Select, MenuItem
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import AddNomineeDetails from './AddNomineeDetails';
import { incrementGLNo } from '../Redux/GlNoSlice';
import { incrementVoucherNo } from '../Redux/voucherNoSlice';
import { useParams } from 'react-router-dom';

const GoldLoanForm = () => {
    const [usingWebcam, setUsingWebcam] = useState(false); // Toggle between file upload and webcam
    const [fileImage, setFileImage] = useState({ image: null, capture: null, }); // State to store the uploaded image and signature

    const [items, setItems] = useState([
        { id: 1, type: 'Select', description: '', no: '', grossWeight: '', stoneWeight: '', netWeight: '', depWeight: '' },
    ]);

    const [selectedDate, setSelectedDate] = useState(null);

    const [form, setForm] = useState({
        principalAmount: '',
        insurance: '',
        processingFee: '',
        packingFee: '',
        appraisercharge: '',
        othercharges: '',
        mode: '',
        range: ''
    });

    const voucherNo = useSelector((state) => state.voucherNo.voucherNo);

    const handleSubmit = () => {
        // Your form submission logic here
        console.log("Form submitted");
        dispatch(incrementGLNo());
        dispatch(incrementVoucherNo());
    };


    const [interestType, setInterestType] = useState('simple');
    const goldRate = 5000;

    const handleAddRow = () => {
        const newItem = {
            id: items.length + 1,
            type: 'Select',
            description: '',
            no: '',
            grossWeight: '',
            stoneWeight: '',
            netWeight: '',
            depWeight: '',
        };
        setItems([...items, newItem]);
    };

    const handleChangeItem = (id, field, value) => {
        const updatedItems = items.map((item) => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        });
        setItems(updatedItems);
    };

    const handleChangeForm = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };


    const handleInterestChange = (event, newType) => {
        setInterestType(newType);
    };

    const handleDelete = (id) => {
        const updatedItems = items.filter((item) => item.id !== id);
        setItems(updatedItems);
    };

    const handleCloseImage = () => {
        setFileImage({ ...fileImage, image: null }); // Clear the uploaded image
    };

    const webcamRef = useRef(null); // Ref to access the webcam

    // Handle webcam capture
    const captureImage = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot(); // Capture image from webcam as Base64
        setFileImage({ ...fileImage, capture: imageSrc });  // Set Base64 image
        setUsingWebcam(false); // Hide the webcam after capture
    }, [webcamRef, fileImage]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            // Ensure that the file is a valid image
            const imageUrl = URL.createObjectURL(file);
            setFileImage({ ...fileImage, image: imageUrl });
        } else {
            console.error("No file selected or invalid file.");
        }
    };
    const handleButtonClick = () => {
        document.getElementById('file-input').click();
    };
    const handleCloseCapture = () => {
        setFileImage({ ...fileImage, capture: null }); // Clear the captured image
    };
    const dispatch = useDispatch();
    const glNo = useSelector((state) => state.glNo.glNo);

    // Display GL number when form loads
    useEffect(() => {
        console.log('Current GL Number:', glNo);
    }, [glNo]);

    useEffect(() => {
        // Log or display the voucher number in your UI, or handle any initialization
        console.log("Current Voucher Number:", voucherNo);
    }, [voucherNo]);

    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0]; // Formats as YYYY-MM-DD
        setSelectedDate(formattedDate);
    }, []);

    const { customerId } = useParams();


    const totalNetWeight = items.reduce((total, item) => total + (parseFloat(item.netWeight) || 0), 0);
    const recommendedAmount = totalNetWeight * goldRate;

    return (
        <Box sx={{ display: 'flex', p: 2, width: '100%', mx: 'auto', mt: -3 }}>

            <Box sx={{ flex: 2, p: 1 }}>
                <Typography variant="subtitle1">GoldLoanForm</Typography>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ width: '100%' }}

                >
                    <center> <Typography variant="overline">GL No: {glNo} </Typography > </center>


                    <TextField
                        label="Select Date"
                        type="date"
                        value={selectedDate}
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
                <TableContainer component={Paper} sx={{ mb: 2, height: 200, overflowY: 'auto', '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '4px', '&:hover': { backgroundColor: '#555' } }, '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '4px' } }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow sx={{ height: '5px', '& .MuiTableCell-root': { padding: '0px' } }}>
                                <TableCell colSpan={8} sx={{ padding: '4px', borderBottom: '1px solid #ccc' }}>
                                    {/* Left side: AddNomineeDetails */}
                                    <AddNomineeDetails />

                                    {/* Right side: Add Item button with spacing */}
                                    <Box mt={-5} display="flex" justifyContent="flex-end">
                                        <Button variant="text" color="primary" startIcon={<AddIcon />} onClick={handleAddRow}>
                                            Add Item
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                            <TableRow >
                                {['Item Details', 'No', 'Gross Wt', 'Stone Wt', 'Dep Wt', 'Net Wt', 'Actions'].map((header) => (
                                    <TableCell key={header} sx={{ fontSize: '12px', backgroundColor: '#e0e0e0 ', padding: '4px', borderBottom: '1px solid #ccc' }}>
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell sx={{ fontSize: '8px', padding: '2px', borderBottom: '1px solid #ccc' }}>
                                        <Autocomplete
                                            options={['Earrings', 'Bangle', 'Chain', 'Ring']}

                                            value={item.type}
                                            onChange={(event, newValue) => handleChangeItem(item.id, 'type', newValue)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        fontSize: '8px', // Adjust font size for TextField
                                                        '& .MuiOutlinedInput-root': {
                                                            height: '20px', // Adjust height for TextField
                                                            fontSize: '8px', // Set input text font size
                                                        },
                                                        '& .MuiInputBase-input': {
                                                            padding: '2px 2px', // Adjust padding for compact appearance
                                                        },
                                                    }}
                                                />
                                            )}
                                            sx={{
                                                width: '130px', // Set width for Autocomplete component
                                                fontSize: '8px', // Ensure font size consistency
                                                '& .MuiAutocomplete-option': {
                                                    fontSize: '10px', // Reduce font size for dropdown options
                                                },
                                                '& .MuiAutocomplete-input': {
                                                    fontSize: '10px', // Set font size for Autocomplete input text
                                                },
                                            }}
                                        />
                                    </TableCell>
                                    {['no', 'grossWeight', 'stoneWeight', 'depWeight'].map((field) => (
                                        <TableCell key={field} sx={{ fontSize: '8px', padding: '2px', borderBottom: '1px solid #ccc' }}>
                                            <TextField
                                                type="text"
                                                value={item[field]}
                                                onChange={(e) => handleChangeItem(item.id, field, e.target.value)}
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                sx={{
                                                    fontSize: '0.875rem', // Adjust font size as needed (e.g., 0.875rem for smaller text)
                                                    '& .MuiOutlinedInput-root': {
                                                        height: '20px', // Adjust height as needed
                                                        fontSize: '0.875rem', // Ensure input text matches font size
                                                    },
                                                    '& .MuiInputBase-input': {
                                                        padding: '2px 2px', // Adjust padding for a compact look
                                                    },
                                                }}
                                            />
                                        </TableCell>
                                    ))}
                                    <TableCell sx={{ fontSize: '8px', padding: '2px', borderBottom: '1px solid #ccc' }}>
                                        <TextField
                                            type="text"
                                            value={item.netWeight}
                                            onChange={(e) => handleChangeItem(item.id, 'netWeight', e.target.value)}
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && item.netWeight !== '') {
                                                    handleAddRow();
                                                }
                                            }}
                                            InputProps={{
                                                style: {
                                                    fontSize: '0.8rem',  // Reduces the font size
                                                    height: '20px',      // Reduces the height
                                                    padding: '2px'
                                                },
                                            }}
                                            InputLabelProps={{
                                                style: {
                                                    fontSize: '0.8rem',  // Reduces the label font size
                                                },
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ padding: '2px', borderBottom: '1px solid #ccc' }}>
                                        <IconButton size="small" color="error" onClick={() => handleDelete(item.id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Grid container spacing={.5} sx={{ mb: 2 }}>
                    {['Principal Amount', 'Processing Fee', 'Packing Fee', 'Appraiser Fee', 'Insurance Fee', 'Other charges'].map((label, index) => (
                        <Grid item xs={4} key={index}>
                            <TextField
                                label={label}
                                name={label.toLowerCase().replace(/\s+/g, '')}  // Removes spaces for matching
                                value={form[label.toLowerCase().replace(/\s+/g, '')]}
                                onChange={handleChangeForm}
                                fullWidth
                                margin="dense"  // Keeps the dense margin to reduce vertical space
                                size="small"
                                sx={{
                                    '& .MuiInputLabel-root': {
                                        fontSize: '12.5px',
                                        marginBottom: '0px', // Reduce space between label and field
                                    },
                                    '& .MuiInputBase-root': {
                                        fontSize: '12.5px',
                                        paddingTop: '0px',   // Reduce padding at the top
                                        paddingBottom: '0px', // Reduce padding at the bottom
                                    }
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>

                {/* interest calaculation and image upload and capture */}
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Interest Calculation</Typography>

                <ToggleButtonGroup
                    color="primary"
                    value={interestType}
                    exclusive
                    onChange={handleInterestChange}
                    size="small"
                    sx={{ mt: 1, textAlign: 'left', }}
                >
                    <ToggleButton value="simple">Simple</ToggleButton>
                    <ToggleButton value="multiple">Multiple</ToggleButton>
                    <ToggleButton value="range">Range</ToggleButton>
                </ToggleButtonGroup>

                <Box sx={{ textAlign: 'right', mt: -5 }}>
                    {/* Webcam Toggle Button */}
                    <IconButton color="primary">
                        <PhotoCamera onClick={() => setUsingWebcam(!usingWebcam)} startIcon={!usingWebcam && <PhotoCamera />} sx={{ ml: 2 }} />
                        {usingWebcam ? '' : null}
                    </IconButton>

                    {/* File Upload Button */}
                    <input
                        type="file"
                        id="file-input"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        accept="image/*" // Ensure only images can be selected
                    />
                    <IconButton color="primary" onClick={handleButtonClick}>
                        <FileUploadIcon />
                    </IconButton>
                </Box>

                <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit} // Your submit handler function
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>

                {interestType === 'multiple' && (
                    <Box sx={{ mt: -4.5 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Mode</InputLabel>
                            <Select
                                name="mode"
                                value={form.mode}
                                label="Mode"
                                onChange={handleChange}
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
                {/* 
                {interestType === 'range' && (
                    <Box sx={{ mt: 1 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Range</InputLabel>
                            <Select
                                name="range"
                                value={form.range}
                                label="Range"
                                onChange={handleChange}
                                sx={{ width: '50%', textAlign: 'left', }}
                            >
                                <MenuItem value="0-30">0-30</MenuItem>
                                <MenuItem value="30-60">30-60</MenuItem>
                                <MenuItem value="60-90">60-90</MenuItem>
                            </Select>
                        </FormControl>
                        {form.range && (
                            <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                                Selected Range: {form.range}
                            </Typography>
                        )}
                    </Box>
                )} */}

                {/* <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit} // Your submit handler function
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid> */}
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
                    {fileImage.image && (
                        <div style={{ marginTop: '10px' }}>
                            <img src={fileImage.image} alt="Selected" style={{ maxWidth: '100%', height: 'auto' }} />
                            <IconButton
                                onClick={handleCloseCapture}
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
                {/* Summary Table at the bottom */}
                <Box sx={{ flex: 1, p: 2 }}>
                    <Typography variant="subtitle1">Summary Table</Typography>
                    <TableContainer component={Paper} sx={{ mb: 3 }}>
                        <Table>
                            <TableHead>
                                <Typography variant="overline"> Vr No: {voucherNo}</Typography >
                            </TableHead>

                            <TableBody>
                                <TableRow>
                                    <TableCell>Total Net Weight</TableCell>
                                    <TableCell>{totalNetWeight.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Recommended Amount</TableCell>
                                    <TableCell>{recommendedAmount.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Gold Rate</TableCell>
                                    <TableCell>{goldRate}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Processing Fee</TableCell>
                                    <TableCell>{form.processingFee}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Packing Fee</TableCell>
                                    <TableCell>{form.packingFee}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>

            <Box sx={{ flex: 1, p: 1, textAlign: 'center' }}>
                <Typography variant="subtitle1">Customer Details</Typography>
                {/* Placeholder for customer details form */}
                <p>Custom ID: {customerId}</p>
            </Box>
        </Box >
    );
};

export default GoldLoanForm;


