import React, { useState, useRef, useCallback } from 'react';
import signatureIcon from '../../assets/signatureIcon.png';
import Webcam from 'react-webcam';
import { Box, Button, TextField, Grid, Typography, Modal, IconButton, Container } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { submitDocument } from '../../api';
import { DEFAULT_MARGINS } from '@mui/x-charts';
import ImageIcon from '@mui/icons-material/Image';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FileUpload } from '@mui/icons-material';



export default function CustomerForm({ onCustomerAdded }) {
    const [open, setOpen] = useState(false); // Modal state
    const [usingAadharcam, setUsingAadharcam] = useState(false); // Toggle between file upload and webcam
    const [usingSigncam, setUsingSigncam] = useState(false); // Toggle between file upload and webcam
    const [usingWebcam, setUsingWebcam] = useState(false); // Toggle between file upload and webcam
    const [fileImage, setFileImage] = useState({ image: null, signature: null, aadharImage: null, capture: null, sCapture: null, aCapture: null }); // State to store the uploaded image and signature
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        careOf: '',
        place: '',
        state: '',
        district: '',
        zip: '',
        aadhar: '',
        primaryNumber: '',
        secondaryNumber: '',
        gst: '',
        nearBy: '',
        bankUserName: '',
        bankAccount: '',
        ifsc: '',
        bankName: '',
        email: '', // Add email field

    });
    const [errors, setErrors] = useState({});
    const webcamRef = useRef(null); // Ref to access the webcam

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);




    // Handle webcam capture
    const captureImage = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot(); // Capture image from webcam as Base64
        setFileImage({ ...fileImage, capture: imageSrc });  // Set Base64 image
        setUsingWebcam(false); // Hide the webcam after capture
    }, [webcamRef, fileImage]);

    // Handle Signaturecam capture
    const captureSign = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot(); // Capture image from webcam as Base64
        setFileImage({ ...fileImage, sCapture: imageSrc });  // Set Base64 image
        setUsingSigncam(false); // Hide the webcam after capture
    }, [webcamRef, fileImage]);

    // Handle Signaturecam capture
    const captureAadhar = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot(); // Capture image from webcam as Base64
        setFileImage({ ...fileImage, aCapture: imageSrc });  // Set Base64 image
        setUsingAadharcam(false); // Hide the webcam after capture
    }, [webcamRef, fileImage]);



    // handle image change
    const handleimagechange = (e) => {
        const { name, files } = e.target;
        setFileImage({ ...fileImage, [name]: files[0] });
    };

    //handle from input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };
    const handleButtonClick = () => {
        if (fileInputaadharRef.current) {
            fileInputaadharRef.current.click();
        }
    };

    const base64ToBlob = (base64Data, contentType = '') => {
        const byteCharacters = atob(base64Data.split(',')[1]); // Decode Base64 string
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: contentType });
    };

    const fileInputcamRef = useRef(null); // Reference to the file input
    const fileInputSignRef = useRef(null); // Reference to the file input    
    const fileInputaadharRef = useRef(null);


    // Function to handle closing the image
    const handleCloseImage = () => {
        setFileImage({ ...fileImage, image: null }); // Clear the uploaded image
        if (fileInputcamRef.current) {
            fileInputcamRef.current.value = ""; // Clear the input value
        }
    };

    const handleCloseCapture = () => {
        setFileImage({ ...fileImage, capture: null }); // Clear the captured image
    };

    // Function to handle closing the signature image
    const handleCloseSignature = () => {
        setFileImage({ ...fileImage, signature: null }); // Clear the uploaded signature
        if (fileInputSignRef.current) {
            fileInputSignRef.current.value = ""; // Clear the input value
        }


    };

    const handleCloseSCapture = () => {
        setFileImage({ ...fileImage, sCapture: null }); // Clear the captured signature
    };

    // Function to handle closing the image
    const handleCloseAadhar = () => {
        setFileImage({ ...fileImage, aadharImage: null }); // Clear the uploaded image
        if (fileInputaadharRef.current) {
            fileInputaadharRef.current.value = ""; // Clear the input value
        }
    };

    const handleCloseACapture = () => {
        setFileImage({ ...fileImage, aCapture: null }); // Clear the captured image
    };


    const commonTextFieldSx = {
        '& .MuiInputBase-root': {
            // height: 40, // Adjust to the desired height

        },
        '& .MuiInputLabel-root': {
            fontSize: 13.5,

        },

    };


    // Validate form data
    const validate = () => {
        let formErrors = {};
        const emailRegex = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,}$/;

        // First Name validation
        if (!formData.firstName.trim()) {
            formErrors.firstName = "First Name is required";
        } else if (formData.firstName.length < 3 || formData.firstName.length > 30) {
            formErrors.firstName = "First name must be between 3 and 30 characters";
        } else if (!/^[a-zA-Z\s.]+$/.test(formData.firstName)) {
            formErrors.firstName = "First name is invalid";
        }

        // Last Name validation
        if (!formData.lastName.trim()) {
            formErrors.lastName = "Last Name is required";
        } else if (formData.lastName.length < 1 || formData.lastName.length > 30) {
            formErrors.lastName = "Last name must be between 1 and 30 characters";
        } else if (!/^[a-zA-Z\s.]+$/.test(formData.lastName)) {
            formErrors.lastName = "Last name is invalid";
        }

        // Address validation
        if (!formData.address.trim()) formErrors.address = "Address is required";

        // Near by validation
        if (!formData.nearBy.trim()) formErrors.nearBy = "Near By location  is required";

        // Care of validation
        if (!formData.careOf.trim()) formErrors.careOf = "CareOf is required";

        // place validation
        if (!formData.place.trim()) formErrors.place = "Place is required";

        // State validation
        if (!formData.state.trim()) formErrors.state = "State is required";

        // State validation
        if (!formData.district.trim()) formErrors.district = "District is required";


        // Zip Code validation
        if (!formData.zip.trim()) {
            formErrors.zip = "Zip Code is required";
        } else if (!/^\d{6}$/.test(formData.zip)) {
            formErrors.zip = "Zip Code must be 6 digits";
        }

        // Aadhar Number verification
        if (!formData.aadhar) {
            formErrors.aadhar = "Aadhar number is required";
        } else if (!/^\d{12}$/.test(formData.aadhar)) {
            formErrors.aadhar = "Aadhar number must be exactly 12 digits";
        }

        // Bank Account Number Verification
        if (!formData.bankAccount) {
            formErrors.bankAccount = "Bank account number is required";
        } else if (!/^\d{9,18}$/.test(formData.bankAccount)) {
            formErrors.bankAccount = "Bank account number must be between 9 and 18 digits";
        }

        // IFSC Code Verification
        if (!formData.ifsc) {
            formErrors.ifsc = "IFSC code is required";
        } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc)) {
            formErrors.ifsc = "Invalid IFSC code format";
        }

        // Bank Username Verification
        if (!formData.bankUserName) {
            formErrors.bankUserName = "Bank username is required";
        } else if (!/^[a-zA-Z\s]{3,50}$/.test(formData.bankUserName)) {
            formErrors.bankUserName = "Bank username must be 3 to 50 characters long and contain only alphabets and spaces";
        }
        // Bank Name Verification
        if (!formData.bankName) {
            formErrors.bankName = "Bank name is required";
        } else if (!/^[a-zA-Z\s]{3,50}$/.test(formData.bankName)) {
            formErrors.bankName = "Bank name must be 3 to 50 characters long and contain only alphabets and spaces";
        }

        // Primary Mobile Number validation
        if (!formData.primaryNumber) {
            formErrors.primaryNumber = "Primary mobile number is required";
        } else if (!/^\d{10}$/.test(formData.primaryNumber)) {
            formErrors.primaryNumber = "Primary mobile number must be exactly 10 digits";
        }

        // Validate if secondary number is provided and correctly formatted
        if (formData.secondaryNumber !== "" && !/^\d{10}$/.test(formData.secondaryNumber)) {
            formErrors.secondaryNumber = "Secondary mobile number must be exactly 10 digits";
        }

        // Email validation
        if (!formData.email) {
            formErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            formErrors.email = "Email address is invalid";
        }

        // Conditional validation for image and signature
        if (!fileImage.image && !fileImage.capture) {
            formErrors.image = "Either upload an image or capture one with the webcam";
        }

        if (!fileImage.signature && !fileImage.sCapture) {
            formErrors.signature = "Either upload a signature or capture one with the webcam";
        }

        if (!fileImage.aadharImage && !fileImage.aCapture) {
            formErrors.aadharImage = "Either upload an Aadhar image or capture one with the webcam";
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    // Validate the form fields

    // handle for submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the form fields
        if (!validate()) {
            //  alert('Please correct the errors in the form!'); // Alert user if validation fails
            return; // Prevent form submission if validation fails
        }

        const data = new FormData();
        data.append('firstName', formData.firstName);
        data.append('lastName', formData.lastName);
        data.append('address', formData.address);
        data.append('careOf', formData.careOf);
        data.append('place', formData.place);
        data.append('state', formData.state);
        data.append('nearBy', formData.nearBy);
        data.append('aadhar', formData.aadhar);
        data.append('zip', formData.zip);
        data.append('primaryNumber', formData.primaryNumber);
        data.append('secondaryNumber', formData.secondaryNumber);
        data.append('gst', formData.gst);
        data.append('district', formData.district);
        data.append('bankAccount', formData.bankAccount);
        data.append('bankName', formData.bankName);
        data.append('bankUserName', formData.bankUserName);
        data.append('ifsc', formData.ifsc);
        data.append('email', formData.email);
        data.append('image', fileImage.image);
        data.append('signature', fileImage.signature);
        data.append('aadharImage', fileImage.aadharImage);


        // Add captured image if available (convert Base64 to Blob and append)
        if (fileImage.capture) {
            let blob = base64ToBlob(fileImage.capture, 'image/jpeg'); // Convert Base64 to Blob
            // Generate a unique filename using current date and time
            const timestamp = new Date().toISOString().replace(/[-:.]/g, ''); // Removes characters not allowed in filenames
            const filename = `webcam_image_${timestamp}.jpg`; // e.g., 'webcam_image_20241018T123456.jpg'
            const fileWithFileName = new File([blob], filename, { type: 'image/jpeg' });// Create a new File from the Blob to include the filename
            fileImage.image = fileWithFileName; // Assign it to fileImage.image
            data.append('image', fileImage.image); // Append Blob with a file name
        }

        // Handle captured signature (convert Base64 to Blob)
        if (fileImage.sCapture) {
            let blob = base64ToBlob(fileImage.sCapture, 'image/jpeg');
            const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
            const filename = `webcam_signature_${timestamp}.jpg`;
            const fileWithFileName = new File([blob], filename, { type: 'image/jpeg' });
            fileImage.signature = fileWithFileName; // Assign it to fileImage.image
            data.append('signature', fileWithFileName); // Append the signature file
        }

        // Handle captured signature (convert Base64 to Blob)
        if (fileImage.aCapture) {
            let blob = base64ToBlob(fileImage.aCapture, 'image/jpeg');
            const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
            const filename = `webcam_aadhar_${timestamp}.jpg`;
            const fileWithFileName = new File([blob], filename, { type: 'image/jpeg' });
            fileImage.aadharImage = fileWithFileName; // Assign it to fileImage.image
            data.append('aadharImage', fileWithFileName); // Append the signature file
        }


        try {

            const customerData = {
                info: data,
                method: 'post',
                path: 'customer/create'
            }
            await submitDocument(customerData); // Call the API function
            alert('Successfully uploaded!');


            // Clear form data after successful submission
            setFormData({
                firstName: '',
                lastName: '',
                address: '',
                careOf: '',
                place: '',
                state: '',
                zip: '',
                aadhar: '',
                primaryNumber: '',
                secondaryNumber: '',
                nearBy: '',
                gst: '',
                email: '', // Clear email field

            });
            setFileImage({
                image: null,
                signature: null,
                capture: null,
                sCapture: null,
            }); // Clear uploaded image
            // setFileSignature(null); // Clear uploaded signature
            if (onCustomerAdded) {
                onCustomerAdded();
            }
            handleClose(); // Close the form after submission
        } catch (error) {
            alert('Failed to upload data. Please try again.');
        }
    };

    return (
        <>

            {/* <ItemDetailsTable /> */}
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Add Customer
            </Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // backgroundColor: 'rgba(0, 0, 0, 0.1)', // Semi-transparent overlay

                }}
            >
                <Container maxWidth="md" >
                    <Box
                        sx={{
                            width: '49%',
                            maxHeight: '88vh', // Set a maximum height for the modal
                            backgroundColor: 'hsla(0, 0%, 90%, 1)',
                            borderRadius: 2,
                            p: 3,
                            boxShadow: 24,
                            position: 'relative',
                            left: '20%',
                            marginTop: '10vh',

                            overflowY: 'auto', // Enable vertical scrolling if content overflows

                            // opacity: 0.6, // Slight transparency on the modal content itself
                            // Custom scrollbar styles
                            '&::-webkit-scrollbar': {
                                width: '8px', // Width of the scrollbar
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#888', // Color of the scrollbar thumb
                                borderRadius: '4px', // Rounded corners on the thumb
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                backgroundColor: '#555', // Color when hovering over the scrollbar thumb
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: '#f1f1f1', // Background color of the scrollbar track
                                borderRadius: '4px', // Rounded corners on the track
                            },
                        }}
                    >
                        {/* Close Button */}
                        <IconButton
                            onClick={handleClose}
                            sx={{ position: 'absolute', top: 8, right: 8 }}
                        >
                            <CloseIcon />
                        </IconButton>

                        {/* Form Title */}
                        <Typography variant="h6" id="modal-title" sx={{ mb: 2 }}>
                            Customer Form
                        </Typography>

                        {/* Form Content */}
                        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                            <Grid container spacing={1}>
                                {/* First Name */}
                                <Grid item xs={12} sm={7}>
                                    <TextField
                                        fullWidth
                                        id="firstName"
                                        name="firstName"
                                        label="First Name"
                                        variant="outlined"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        error={!!errors.firstName} // Add error prop
                                        helperText={errors.firstName} // Display error message
                                        sx={commonTextFieldSx} // Apply common style
                                        size="small"
                                    />
                                </Grid>

                                {/* Last Name */}
                                <Grid item xs={12} sm={5}>
                                    <TextField
                                        fullWidth
                                        id="lastName"
                                        name="lastName"
                                        label="Last Name"
                                        variant="outlined"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        error={!!errors.lastName} // Add error prop
                                        helperText={errors.lastName} // Display error message
                                        sx={commonTextFieldSx} // Apply common style
                                        size="small"
                                    />
                                </Grid>

                                {/* Email */}
                                <Grid item xs={12} >
                                    <TextField
                                        fullWidth
                                        id="email"
                                        name="email"
                                        label="Email"
                                        variant="outlined"
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        error={!!errors.email} // Add error prop
                                        helperText={errors.email} // Display error message
                                        sx={commonTextFieldSx} // Apply common style
                                        size="small"
                                    />
                                </Grid>


                                {/* Primary Mobile Number */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="primaryNumber"
                                        name="primaryNumber"
                                        label="Primary Mobile Number"
                                        variant="outlined"
                                        required
                                        value={formData.primaryNumber}
                                        onChange={handleChange}
                                        error={!!errors.primaryNumber}
                                        helperText={errors.primaryNumber}
                                        sx={commonTextFieldSx} // Apply common style
                                        size="small"
                                    />
                                </Grid>

                                {/* Secondary Mobile Number */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="secondaryNumber"
                                        name="secondaryNumber"
                                        label="Secondary  Number"
                                        variant="outlined"
                                        value={formData.secondaryNumber}
                                        onChange={handleChange}
                                        error={!!errors.secondaryNumber} // Add error prop
                                        helperText={errors.secondaryNumber} // Display error message
                                        sx={commonTextFieldSx} // Apply common style
                                        size="small"
                                    />
                                </Grid>


                                {/* Address */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="address"
                                        name="address"
                                        label="Address"
                                        variant="outlined"
                                        required
                                        value={formData.address}
                                        onChange={handleChange}
                                        error={!!errors.address} // Add error prop
                                        helperText={errors.address} // Display error message
                                        sx={commonTextFieldSx} // Apply common style
                                        size="small"
                                    />
                                </Grid>
                                {/* care Of */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="careOf"
                                        name="careOf"
                                        label="CareOf"
                                        variant="outlined"
                                        required
                                        value={formData.careOf}
                                        onChange={handleChange}
                                        error={!!errors.careOf} // Add error prop
                                        helperText={errors.careOf} // Display error message
                                        sx={commonTextFieldSx} // Apply common style
                                        size="small"
                                    />
                                </Grid>
                                {/* place/City */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="place"
                                        name="place"
                                        label="place (City)"
                                        variant="outlined"
                                        required
                                        value={formData.place}
                                        onChange={handleChange}
                                        error={!!errors.place} // Add error prop
                                        helperText={errors.place} // Display error message
                                        sx={commonTextFieldSx} // Apply common style
                                        size="small"
                                    />
                                </Grid>

                                {/* District */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="district"
                                        name="district"
                                        label="District"
                                        variant="outlined"
                                        required
                                        value={formData.district}
                                        onChange={handleChange}
                                        error={!!errors.district} // Add error prop
                                        helperText={errors.district} // Display error message
                                        sx={commonTextFieldSx} // Apply common style
                                        size="small"
                                    />
                                </Grid>

                                {/* State */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="state"
                                        name="state"
                                        label="State"
                                        variant="outlined"
                                        required
                                        value={formData.state}
                                        onChange={handleChange}
                                        error={!!errors.state} // Add error prop
                                        helperText={errors.state} // Display error message
                                        sx={commonTextFieldSx} // Apply common style
                                        size="small"
                                    />
                                </Grid>

                                {/* Zip Code */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="zip"
                                        name="zip"
                                        label="Zip Code"
                                        variant="outlined"
                                        required
                                        value={formData.zip}
                                        onChange={handleChange}
                                        error={!!errors.zip} // Add error prop
                                        helperText={errors.zip} // Display error message
                                        sx={commonTextFieldSx} // Apply common style
                                        size="small"
                                    />
                                </Grid>



                                {/* Near By location */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="nearBy"
                                        name="nearBy"
                                        label="Near By location"
                                        variant="outlined"
                                        value={formData.nearBy}
                                        onChange={handleChange}
                                        error={!!errors.nearBy} // Add error prop
                                        helperText={errors.nearBy} // Display error message
                                        sx={commonTextFieldSx} // Apply common style
                                        size="small"
                                    />
                                </Grid>



                                {/* GST Number */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="gst"
                                        name="gst"
                                        label="GST Number"
                                        variant="outlined"
                                        value={formData.gst}
                                        onChange={handleChange}
                                        sx={commonTextFieldSx} // Apply common style
                                        size="small"
                                    />
                                </Grid>

                                {/* Aadhar Details Heading */}
                                <Grid item xs={12}>
                                    <Typography sx={{ fontSize: 14, borderBottom: '1px solid #979797', marginTop: .5, marginBottom: .5, color: '#626161' }}>
                                        Aadhar Details
                                    </Typography>
                                </Grid>

                                {/* Aadhar Number */}
                                <Grid item xs={12} sm={8}>
                                    <TextField
                                        fullWidth
                                        id="aadhar"
                                        name="aadhar"
                                        label="Aadhar Number"
                                        variant="outlined"
                                        required
                                        value={formData.aadhar}
                                        onChange={handleChange}
                                        error={!!errors.aadhar}
                                        helperText={errors.aadhar}
                                        sx={commonTextFieldSx}
                                        size="small"
                                    />
                                </Grid>

                                {/* Aadhar File Upload */}
                                <Grid item xs={12} sm={4}>
                                    <IconButton onClick={handleButtonClick}>
                                        {/* onClick={() => fileInputaadharRef.current?.click()} */}
                                        <FileUpload />

                                    </IconButton>
                                    <input
                                        ref={fileInputaadharRef} // Add a ref for programmatic access
                                        hidden
                                        name="aadharImage"
                                        accept="image/*"
                                        type="file"
                                        onChange={handleimagechange} // Handle file change
                                    />

                                    <IconButton

                                        onClick={() => setUsingAadharcam(!usingAadharcam)} // Toggle `usingSigncam`
                                    // sx={{ ml: 2 }}
                                    >
                                        {usingAadharcam ? <PhotoCamera /> : <PhotoCamera />} {/* Conditionally render text or icon */}
                                    </IconButton>

                                </Grid>

                                <Grid item xs={12}>


                                    {/* Display uploaded Aadhar */}
                                    {fileImage.aadharImage && !fileImage.aCapture && (
                                        <Box mt={2} style={{ position: 'relative', right: 0, }} >
                                            <img src={URL.createObjectURL(fileImage.aadharImage)} alt="Uploaded Aadhar" style={{ width: '100px' }} />
                                            <IconButton
                                                onClick={handleCloseAadhar}
                                                style={{ position: 'absolute', top: 0, left: 105, padding: '0' }}
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </Box>
                                    )}

                                    {fileImage.aCapture && (
                                        <Box mt={2} position="relative">
                                            <img src={fileImage.aCapture} alt="Captured Aadhar" style={{ width: '100px' }} />
                                            <IconButton
                                                onClick={handleCloseACapture}
                                                style={{ position: 'absolute', top: 0, right: 0, padding: '0' }}
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </Box>
                                    )}


                                    {/* Webcam Component */}
                                    {usingAadharcam && (
                                        <Box mt={2}>
                                            <Webcam
                                                audio={false}
                                                ref={webcamRef}
                                                screenshotFormat="image/jpeg"
                                                width="100%"
                                            />
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={captureAadhar}
                                                sx={{ mt: 2 }}
                                            >
                                                Capture
                                            </Button>
                                        </Box>
                                    )}
                                    {errors.aadharImage && <Typography color="error">{errors.aadharImage}</Typography>}
                                </Grid>

                                <Grid item xs={12} >
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1-content"
                                            id="panel1-header"
                                            sx={{ marginTop: 1 }}
                                        >
                                            Please enter bank details

                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid container spacing={1}>
                                                {/* Account Name */}
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        id="bankUserName"
                                                        name="bankUserName"
                                                        label="Account Namee"
                                                        variant="outlined"
                                                        required
                                                        value={formData.bankUserName}
                                                        onChange={handleChange}
                                                        error={!!errors.bankUserName} // Add error prop
                                                        helperText={errors.bankUserName} // Display error message
                                                        sx={commonTextFieldSx} // Apply common style
                                                        size="small"
                                                    />
                                                </Grid>
                                                {/* Bank name */}
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        id="bankName"
                                                        name="bankName"
                                                        label="Bank name"
                                                        variant="outlined"
                                                        required
                                                        value={formData.bankName}
                                                        onChange={handleChange}
                                                        error={!!errors.bankName} // Add error prop
                                                        helperText={errors.bankName} // Display error message
                                                        sx={commonTextFieldSx} // Apply common style
                                                        size="small"
                                                    />
                                                </Grid>
                                                {/* IFSC Code */}
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        id="ifsc"
                                                        name="ifsc"
                                                        label="IFSC Code"
                                                        variant="outlined"
                                                        required
                                                        value={formData.ifsc}
                                                        onChange={handleChange}
                                                        error={!!errors.ifsc} // Add error prop
                                                        helperText={errors.ifsc} // Display error message
                                                        sx={commonTextFieldSx} // Apply common style
                                                        size="small"
                                                    />
                                                </Grid>
                                                {/* Account Number */}
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        id="bankAccount"
                                                        name="bankAccount"
                                                        label="Account Number"
                                                        variant="outlined"
                                                        required
                                                        value={formData.bankAccount}
                                                        onChange={handleChange}
                                                        error={!!errors.bankAccount} // Add error prop
                                                        helperText={errors.bankAccount} // Display error message
                                                        sx={commonTextFieldSx} // Apply common style
                                                        size="small"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </AccordionDetails>
                                    </Accordion>

                                </Grid>

                                {/* Image Upload or Capture */}
                                <Grid item xs={12} sm={6}>
                                    <Box>
                                        <Button
                                            variant="contained"
                                            component="label"
                                            startIcon={<AccountCircleIcon />} // Adds the PhotoCamera icon
                                        >
                                            <input
                                                ref={fileInputcamRef} // Attach the ref here
                                                type="file"
                                                name="image"
                                                hidden
                                                accept="image/*"
                                                capture="environment" // Enables capture from the camera
                                                onChange={handleimagechange} // Attach the file change handler
                                            />
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => setUsingWebcam(!usingWebcam)}
                                            startIcon={!usingWebcam && <PhotoCamera />} // Adds the Image icon only when not using the webcam
                                            sx={{ ml: 2 }}
                                        >
                                            {usingWebcam ? 'Cancel' : null}
                                        </Button>
                                        {/* Display uploaded image */}
                                        {fileImage.image && !fileImage.capture && (
                                            <Box mt={2} position="relative">
                                                <img src={URL.createObjectURL(fileImage.image)} alt="Uploaded Image" style={{ width: '100px' }} />
                                                <IconButton
                                                    onClick={handleCloseImage}
                                                    style={{ position: 'absolute', top: 0, right: 0, padding: '0' }}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            </Box>
                                        )}

                                        {fileImage.capture && (
                                            <Box mt={2} position="relative">
                                                <img src={fileImage.capture} alt="Captured Image" style={{ width: '100px' }} />
                                                <IconButton
                                                    onClick={handleCloseCapture}
                                                    style={{ position: 'absolute', top: 0, right: 0, padding: '0' }}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            </Box>
                                        )}

                                        {/* Webcam Component */}
                                        {usingWebcam && (
                                            <Box mt={2}>
                                                <Webcam
                                                    audio={false}
                                                    ref={webcamRef}
                                                    screenshotFormat="image/jpeg"
                                                    width="100%"
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={captureImage}
                                                    sx={{ mt: 2 }}
                                                >
                                                    Capture Image
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>
                                    {errors.image && <Typography color="error">{errors.image}</Typography>}
                                </Grid>

                                {/* Signature Upload or Capture */}
                                <Grid item xs={12} sm={6}>
                                    <Box>
                                        <Button
                                            variant="contained"
                                            component="label"
                                            startIcon={<img src={signatureIcon} alt="Signature Icon" style={{ width: 24, height: 24 }} />} // Display the image as icon
                                        >

                                            <input
                                                ref={fileInputSignRef} // Attach the ref here
                                                type="file"
                                                name="signature"
                                                hidden
                                                accept="image/*"
                                                onChange={handleimagechange} // Attach the file change handler
                                            />
                                        </Button>

                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => setUsingSigncam(!usingSigncam)}
                                            startIcon={!usingSigncam && <PhotoCamera />} // Adds the PhotoCamera icon
                                            sx={{ ml: 2 }}
                                        >
                                            {usingSigncam ? 'Cancel' : null}
                                        </Button>

                                        {/* Display uploaded signature */}
                                        {fileImage.signature && !fileImage.sCapture && (
                                            <Box mt={2} position="relative">
                                                <img src={URL.createObjectURL(fileImage.signature)} alt="Uploaded Signature" style={{ width: '100px' }} />
                                                <IconButton
                                                    onClick={handleCloseSignature}
                                                    style={{ position: 'absolute', top: 0, right: 0, padding: '0' }}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            </Box>
                                        )}

                                        {fileImage.sCapture && (
                                            <Box mt={2} position="relative">
                                                <img src={fileImage.sCapture} alt="Captured Signature" style={{ width: '100px' }} />
                                                <IconButton
                                                    onClick={handleCloseSCapture}
                                                    style={{ position: 'absolute', top: 0, right: 0, padding: '0' }}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            </Box>
                                        )}

                                        {/* Webcam Component */}
                                        {usingSigncam && (
                                            <Box mt={2}>
                                                <Webcam
                                                    audio={false}
                                                    ref={webcamRef}
                                                    screenshotFormat="image/jpeg"
                                                    width="100%"
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={captureSign}
                                                    sx={{ mt: 2 }}
                                                >
                                                    Capture Image
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>
                                    {errors.signature && <Typography color="error">{errors.signature}</Typography>}
                                </Grid>

                                {/* Submit Button */}
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button variant="contained" color="primary" type="submit">
                                        Submit
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Container>
            </Modal >
        </>
    );
}
