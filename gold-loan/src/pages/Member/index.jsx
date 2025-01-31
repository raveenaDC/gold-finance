import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Box, InputAdornment, Autocomplete, Button, TextField, Grid, Typography, Modal, IconButton, Container, MenuItem, } from '@mui/material';
import { Visibility, VisibilityOff } from "@mui/icons-material";

import CloseIcon from '@mui/icons-material/Close';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FileUpload } from '@mui/icons-material';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { submitDocument } from '../../api';
import { viewDesignationRole } from '../../services/system/system.service'

export default function CustomerForm({ onCustomerAdded }) {
    const [open, setOpen] = useState(false); // Modal state
    const [showPassword, setShowPassword] = useState(false);
    const [usingAadharcam, setUsingAadharcam] = useState(false); // Toggle between file upload and webcam
    const [usingSigncam, setUsingSigncam] = useState(false); // Toggle between file upload and webcam
    const [usingWebcam, setUsingWebcam] = useState(false); // Toggle between file upload and webcam

    const [fileImage, setFileImage] = useState({ memberImage: null, signature: null, aadharImage: [], capture: null, sCapture: null, aCapture: [], passBookImage: null }); // State to store the uploaded image and signature


    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        place: '',
        state: '',
        district: '',
        pin: '',
        aadhar: '',
        primaryNumber: '',
        secondaryNumber: '',
        designation: '',
        landMark: '',
        bankUserName: '',
        bankAccount: '',
        ifsc: '',
        bankName: '',
        upId: '',
        gender: '',
        email: '', // Add email field       
        dateOfBirth: '',
        joiningDate: '',
        panCardName: '',
        panCardNumber: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const webcamRef = useRef(null); // Ref to access the webcam
    const fileInputcamRef = useRef(null); // Reference to the file input
    const fileInputSignRef = useRef(null); // Reference to the file input    
    const fileInputaadharRef = useRef(null);
    const fileInputpassBookRef = useRef(null);

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
        if (!webcamRef.current) return;
        const imageSrc = webcamRef.current.getScreenshot(); // Capture image from webcam\
        console.log("fileImage.aCapture, fileImage.aCapture.length");
        console.log(fileImage.aCapture, fileImage.aCapture.length);
        if (fileImage.aCapture != null) {
            if (fileImage.aCapture.length < 2) {
                setFileImage((prev) => ({
                    ...prev,
                    aCapture: [...prev.aCapture, imageSrc], // Append image
                }));
                setUsingAadharcam(false); // Hide webcam
            }
        } else {
            alert("You can only capture 2 images at a time.");
        }
    }, [webcamRef, fileImage]);
    // handle image change
    const handleimagechange = (e) => {
        const { name, files } = e.target;
        setFileImage({ ...fileImage, [name]: files[0] });
    };

    const handleMutipleImage = (event) => {
        const files = Array.from(event.target.files).filter((file) =>
            file.type.startsWith("image/")
        );
        console.log("files.length === 0");
        console.log(files, files.length);

        if (files.length === 0) {
            alert("Please upload valid image files.");
            return;
        }
        setFileImage((prevState) => ({
            ...prevState,
            aadharImage: [...prevState.aadharImage, ...files],
        }));
    };
    const handleGenderChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        // Optional: Clear any errors on change
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
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

    // Function to handle closing the image
    const handleCloseImage = () => {
        setFileImage({ ...fileImage, memberImage: null }); // Clear the uploaded image
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


    // Handle removal of an image
    const handleCloseAadhar = (index) => {
        setFileImage((prevState) => ({
            ...prevState,
            aadharImage: prevState.aadharImage.filter((_, i) => i !== index), // Remove specific image
        }));

        if (fileInputaadharRef.current) {
            fileInputaadharRef.current.value = ''; // Clear the file input's value
        }
    };

    const handleCloseACapture = (index) => {
        setFileImage((prev) => ({
            ...prev,
            aCapture: prev.aCapture.filter((_, i) => i !== index),
        }));
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
            console.log(formData.lastName, formData.lastName.length, formData.lastName.length);

        } else if (!/^[a-zA-Z\s.]+$/.test(formData.lastName)) {
            formErrors.lastName = "Last name is invalid";

        }

        // Address validation
        if (!formData.address.trim()) formErrors.address = "Address is required";

        // Near by validation
        if (!formData.landMark.trim()) formErrors.nearBy = "Near By location  is required";

        // Care of validation
        if (!formData.city.trim()) formErrors.city = "City is required";

        // place validation
        if (!formData.place.trim()) formErrors.place = "Place is required";

        // State validation
        if (!formData.state.trim()) formErrors.state = "State is required";

        // State validation
        if (!formData.district.trim()) formErrors.district = "District is required";


        // Zip Code validation
        if (!formData.pin.trim()) {
            formErrors.pin = "Zip Code is required";
        } else if (!/^\d{6}$/.test(formData.pin)) {
            formErrors.pin = "Zip Code must be 6 digits";
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
        if (!formData.upId) {
            formErrors.upId = "UPID is required";
        } else if (!/^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(formData.upId)) {
            formErrors.upId = "UPID must be contain only alphabets and spaces";
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
        if (!fileImage.memberImage && !fileImage.capture) {
            formErrors.image = "Either upload an image or capture one with the webcam";
        }

        if (!fileImage.signature && !fileImage.sCapture) {
            formErrors.signature = "Either upload a signature or capture one with the webcam";
        }

        // if (!fileImage.aadharImage && !fileImage.aCapture) {
        //     formErrors.aadharImage = "Either upload an Aadhar image or capture one with the webcam";
        // }

        if (!formData.password) {
            formErrors.password = "Password is required";
        } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.password)) {
            formErrors.password = "Password must be at least 8 characters long and include letters and numbers";
        }


        // Pan card Name Verification
        if (!formData.panCardName) {
            formErrors.panCardName = "Pan card name is required";
        } else if (!/^[a-zA-Z\s]{3,50}$/.test(formData.panCardName)) {
            formErrors.bankName = "Pan Cad name must be 3 to 50 characters long and contain only alphabets and spaces";
        }

        // PAN Card Number Validation
        if (!formData.panCardNumber) {
            formErrors.panCardNumber = "PAN card number is required";
        } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCardNumber)) {
            formErrors.panCardNumber = "Invalid PAN card number format. It should be in the format ABCDE1234F";
        }


        setErrors(formErrors);
        console.log(Object.keys(formErrors), Object.keys(formErrors).length);

        return Object.keys(formErrors).length === 0;
    };

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
        data.append('city', formData.city);
        data.append('place', formData.place);
        data.append('state', formData.state);
        data.append('nearBy', formData.landMark);
        data.append('aadhar', formData.aadhar);
        data.append('pin', formData.pin);
        data.append('primaryNumber', formData.primaryNumber);
        if (formData.secondaryNumber != '') { data.append('secondaryNumber', formData.secondaryNumber); }
        data.append('gst', formData.designation);
        data.append('district', formData.district);
        data.append('bankAccount', formData.bankAccount);
        data.append('bankName', formData.bankName);
        data.append('bankUserName', formData.bankUserName);
        data.append('ifsc', formData.ifsc);
        data.append('email', formData.email);
        data.append('upId', formData.upId);
        data.append('createdDate', formData.joiningDate);
        data.append('gender', formData.gender);
        data.append('dateOfBirth', formData.dateOfBirth);
        data.append('panCardName', formData.panCardName);
        data.append('panCardNumber', formData.panCardNumber);
        data.append('image', fileImage.memberImage);
        data.append('signature', fileImage.signature);
        data.append('passBookImage', fileImage.passBookImage);
        fileImage.aadharImage.forEach((aadharImage, index) => {
            data.append('aadharImage', aadharImage); // Append each image to the form data
        });

        // Add captured image if available (convert Base64 to Blob and append)
        if (fileImage.capture) {
            let blob = base64ToBlob(fileImage.capture, 'image/jpeg'); // Convert Base64 to Blob
            // Generate a unique filename using current date and time
            const timestamp = new Date().toISOString().replace(/[-:.]/g, ''); // Removes characters not allowed in filenames
            const filename = `webcam_image_${timestamp}.jpg`; // e.g., 'webcam_image_20241018T123456.jpg'
            const fileWithFileName = new File([blob], filename, { type: 'image/jpeg' });// Create a new File from the Blob to include the filename
            fileImage.memberImage = fileWithFileName; // Assign it to fileImage.image
            data.append('image', fileImage.memberImage); // Append Blob with a file name
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
        console.log(fileImage.aCapture, fileImage.aCapture.length);

        // Handle captured signature (convert Base64 to Blob)
        if (fileImage.aCapture.length) {
            fileImage.aCapture.forEach((capture, index) => {
                const blob = base64ToBlob(capture, 'image/jpeg');
                const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
                const filename = `webcam_aadhar_${timestamp}_${index + 1}.jpg`;
                const fileWithFileName = new File([blob], filename, { type: 'image/jpeg' });
                data.append('aadharImage', fileWithFileName);

            });
        }

        try {

            const customerData = {
                info: data,
                method: 'post',
                path: 'member/create'
            }
            // await createCustomer(customerData)
            const response = await submitDocument(customerData); // Call the API function
            // todo - show success alert only if doc submission is succeess // check with status code or flag
            alert('Successfully uploaded!');


            // Clear form data after successful submission
            setFormData({
                firstName: '',
                lastName: '',
                address: '',
                city: '',
                place: '',
                district: '',
                state: '',
                pin: '',
                aadhar: '',
                primaryNumber: '',
                secondaryNumber: '',
                landMark: '',
                designation: '',
                bankUserName: '',
                bankAccount: '',
                ifsc: '',
                bankName: '',
                panCardName: '',
                panCardNumber: '',
                email: '', // Clear email field

            });
            setFileImage({
                memberImage: null,
                signature: null,
                capture: null,
                sCapture: null,
                aadharImage: [],
                aCapture: [],
                passBookImage: null
            }); // Clear uploaded image
            // setFileSignature(null); // Clear uploaded signature
            // if (onCustomerAdded) {
            //     onCustomerAdded();
            // }
            onCustomerAdded?.();
            handleClose(); // Close the form after submission
        } catch (error) {
            alert('Failed to upload data. Please try again.');
        }
    };

    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);

    useEffect(() => {
        const fetchDesignationRole = async () => {
            try {
                const response = await viewDesignationRole();
                console.log("Roles Fetched:", response.result.data.roles);

                if (response?.isSuccess) {
                    setRoles(response.result.data.roles); // Assuming it's an array
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };
        fetchDesignationRole();
    }, []);

    return (
        <>


            <Typography variant='button' onClick={handleOpen} sx={{ cursor: 'pointer', mr: 2, color: 'black' }} >MEMBER</Typography>


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
                            backgroundColor: 'rgb(255, 255, 255)',
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
                                width: '2px', // Width of the scrollbar
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#888', // Color of the scrollbar thumb
                                borderRadius: '5px', // Rounded corners on the thumb
                            },
                            '&::-webkit-scrollbar-thumb:hover': {

                                backgroundColor: '#555', // Color when hovering over the scrollbar thumb
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: '#f1f1f1', // Background color of the scrollbar track
                                borderRadius: '8px', // Rounded corners on the track
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
                            MEMBER FORM
                        </Typography>

                        {/* Form Content */}
                        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                            <Grid container spacing={1}>

                                {/* First Name */}
                                <Grid item xs={12} sm={6}>
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
                                <Grid item xs={12} sm={6}>
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

                                {/* Address */}
                                <Grid item xs={12} >
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
                                {/* place*/}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="place"
                                        name="place"
                                        label="place "
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
                                {/* city */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="city"
                                        name="city"
                                        label="City"
                                        variant="outlined"
                                        required
                                        value={formData.city}
                                        onChange={handleChange}
                                        error={!!errors.city} // Add error prop
                                        helperText={errors.city} // Display error message
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
                                        id="pin"
                                        name="pin"
                                        label="Zip Code"
                                        variant="outlined"
                                        required
                                        value={formData.pin}
                                        onChange={handleChange}
                                        error={!!errors.pin} // Add error prop
                                        helperText={errors.pin} // Display error message
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
                                        label="LandMark"
                                        variant="outlined"
                                        value={formData.landMark}
                                        onChange={handleChange}
                                        error={!!errors.nearBy} // Add error prop
                                        helperText={errors.nearBy} // Display error message
                                        sx={commonTextFieldSx} // Apply common style
                                        size="small"
                                    />
                                </Grid>

                                {/* dateOfBirth */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        label="Date of Birth"
                                        type="date" // Enables both typing and picking a date
                                        variant="outlined"
                                        required
                                        value={formData.dateOfBirth} // Controlled component value
                                        onChange={handleChange} // Update state on change
                                        error={!!errors.dob} // Display error state if applicable
                                        helperText={errors.dob} // Error message
                                        sx={commonTextFieldSx} // Apply common styles for consistency
                                        size="small"
                                        InputLabelProps={{
                                            shrink: true, // Ensures the label doesn't overlap the input
                                        }}
                                    />
                                </Grid>

                                {/* gender */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select // Enables dropdown functionality
                                        fullWidth
                                        id="gender"
                                        name="gender"
                                        label="Gender"
                                        variant="outlined"
                                        required
                                        value={formData.gender} // Controlled component value
                                        onChange={handleGenderChange} // Update state on change
                                        error={!!errors.gender} // Display error state if applicable
                                        helperText={errors.gender} // Error message
                                        sx={commonTextFieldSx} // Apply common styles for consistency
                                        size="small"
                                    >
                                        {/* Dropdown options */}
                                        <MenuItem value="">Select Gender</MenuItem>
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                    </TextField>
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
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id="password"
                                        name="password"
                                        label="Password"
                                        variant="outlined"
                                        required
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        error={!!errors.password} // Add error prop
                                        helperText={errors.password} // Display error message
                                        sx={commonTextFieldSx} // Apply common style
                                        size="small"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>


                                {/* GST Number */}
                                <Grid item xs={12} sm={6}>
                                    <Autocomplete
                                        multiple
                                        size='small'
                                        options={roles}
                                        getOptionLabel={(option) => option._id} // Adjust according to your data
                                        value={selectedRoles}
                                        onChange={(event, newValue) => setSelectedRoles(newValue)}
                                        renderInput={(params) => <TextField {...params} label="Select Roles" variant="outlined" />}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} >
                                    <TextField
                                        fullWidth
                                        id="joinedDate"
                                        name="joinedDate"
                                        label="Joined Date"
                                        type="date" // Enables both typing and picking a date
                                        variant="outlined"
                                        required
                                        value={formData.joiningDate} // Controlled component value
                                        onChange={handleChange} // Update state on change
                                        error={!!errors.dob} // Display error state if applicable
                                        helperText={errors.dob} // Error message
                                        sx={commonTextFieldSx} // Apply common styles for consistency
                                        size="small"
                                        InputLabelProps={{
                                            shrink: true, // Ensures the label doesn't overlap the input
                                        }}
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
                                        multiple
                                        onChange={handleMutipleImage} // Handle file change
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
                                    {fileImage.aadharImage.length > 0 && (
                                        <Box mt={2} style={{ position: 'relative', right: 0 }}>
                                            {fileImage.aadharImage.map((image, index) => (
                                                <div key={index} style={{ position: 'relative', display: 'inline-block', margin: '5px' }}>
                                                    <img
                                                        src={URL.createObjectURL(image)}
                                                        alt="Uploaded Aadhar"
                                                        style={{ width: '100px' }}
                                                    />
                                                    <IconButton
                                                        onClick={() => handleCloseAadhar(index)}
                                                        style={{ position: 'absolute', top: 0, right: 0, padding: '0' }}
                                                    >
                                                        <CloseIcon />
                                                    </IconButton>
                                                </div>
                                            ))}
                                        </Box>
                                    )}


                                    {fileImage.aCapture && (
                                        <Box mt={2} position="relative">
                                            {fileImage.aCapture.map((img, index) => (
                                                <Box key={index} position="relative" display="inline-block" mx={1}>
                                                    <img src={img} alt={`Captured Aadhar ${index + 1}`} style={{ width: '100px' }} />
                                                    <IconButton
                                                        onClick={() => handleCloseACapture(index)}
                                                        style={{
                                                            position: 'absolute', top: 0, right: 0, padding: '0',
                                                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                                        }}
                                                    >
                                                        <CloseIcon />
                                                    </IconButton>
                                                </Box>
                                            ))}
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
                                            Bank & Pan details

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
                                                {/* upId */}
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        id="upId"
                                                        name="upId"
                                                        label="UPI ID"
                                                        variant="outlined"
                                                        value={formData.upId}
                                                        onChange={handleChange}
                                                        error={!!errors.upId} // Add error prop
                                                        helperText={errors.upId} // Display error message
                                                        sx={commonTextFieldSx} // Apply common style
                                                        size="small"
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <Button
                                                        variant="contained"
                                                        component="label"

                                                    >
                                                        file upload
                                                        <input
                                                            ref={fileInputpassBookRef} // Attach the ref here
                                                            type="file"
                                                            name="passBookImage"
                                                            hidden
                                                            accept="image/*"
                                                            capture="environment" // Enables capture from the camera
                                                            onChange={handleimagechange} // Attach the file change handler
                                                        />
                                                    </Button>
                                                </Grid>
                                                {/* Pan card Details Heading */}
                                                <Grid item xs={12}>
                                                    <Typography sx={{ fontSize: 14, borderBottom: '1px solid #979797', marginTop: .5, marginBottom: .5, color: '#626161' }}>
                                                        Pan card Details
                                                    </Typography>
                                                </Grid>

                                                {/*Pancardname */}
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        id="panCardName"
                                                        name="panCardName"
                                                        label="Pan Card Name"
                                                        variant="outlined"
                                                        required
                                                        value={formData.panCardName}
                                                        onChange={handleChange}
                                                        error={!!errors.panCardName} // Add error prop
                                                        helperText={errors.panCardName} // Display error message
                                                        sx={commonTextFieldSx} // Apply common style
                                                        size="small"
                                                    />
                                                </Grid>
                                                {/* pan card number */}
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        id="panCardNumber"
                                                        name="panCardNumber"
                                                        label="Pan Card Number"
                                                        variant="outlined"
                                                        value={formData.panCardNumber}
                                                        onChange={handleChange}
                                                        error={!!errors.panCardNumber} // Add error prop
                                                        helperText={errors.panCardNumber} // Display error message
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
                                        {fileImage.memberImage && !fileImage.capture && (
                                            <Box mt={2} position="relative">
                                                <img src={URL.createObjectURL(fileImage.memberImage)} alt="Uploaded Image" style={{ width: '100px' }} />
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
