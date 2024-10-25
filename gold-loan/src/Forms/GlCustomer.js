import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import {
    Box,
    Button,
    TextField,
    Grid,
    Typography,
    Modal,
    IconButton,
    Container
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { submitDocument } from '../api';

export default function CustomerForm() {
    const [open, setOpen] = useState(false); // Modal state
    const [usingSigncam, setUsingSigncam] = useState(false); // Toggle between file upload and webcam
    const [usingWebcam, setUsingWebcam] = useState(false); // Toggle between file upload and webcam
    const [fileImage, setFileImage] = useState({ image: null, signature: null, capture: null, sCapture: null }); // State to store the uploaded image and signature
    const [formData, setFormData] = useState({
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
        gst: '',
        nearBy: '',
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

    const base64ToBlob = (base64Data, contentType = '') => {
        const byteCharacters = atob(base64Data.split(',')[1]); // Decode Base64 string
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: contentType });
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
        data.append('email', formData.email);
        data.append('image', fileImage.image);
        data.append('signature', fileImage.signature);

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


        try {
            console.log(formData)
            console.log("File Data (Image):", fileImage.image);
            console.log("File Data (sign):", fileImage.signature);
            const customerData = {
                info: data,
                method: 'post',
                path: 'customer/create'
            }
            await submitDocument(customerData); // Call the API function
            alert('Successfully uploaded!');


            console.log(formData); // Handle form submission logic here

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

            handleClose(); // Close the form after submission
        } catch (error) {
            alert('Failed to upload data. Please try again.');
        }
    };

    return (
        <>
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
                }}
            >
                <Container maxWidth="md">
                    <Box
                        sx={{
                            width: '100%',
                            maxHeight: '80vh', // Set a maximum height for the modal
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            p: 3,
                            boxShadow: 24,
                            position: 'relative',
                            overflowY: 'auto', // Enable vertical scrolling if content overflows
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
                            <Grid container spacing={2}>
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
                                    />
                                </Grid>

                                {/* Address */}
                                <Grid item xs={12}>
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
                                    />
                                </Grid>
                                {/* care Of */}
                                <Grid item xs={12}>
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
                                        error={!!errors.primaryNumber} // Add error prop
                                        helperText={errors.primaryNumber} // Display error message
                                    />
                                </Grid>

                                {/* Secondary Mobile Number */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="secondaryNumber"
                                        name="secondaryNumber"
                                        label="Secondary Mobile Number"
                                        variant="outlined"
                                        value={formData.secondaryNumber}
                                        onChange={handleChange}
                                        error={!!errors.secondaryNumber} // Add error prop
                                        helperText={errors.secondaryNumber} // Display error message
                                    />
                                </Grid>

                                {/* Email */}
                                <Grid item xs={12}>
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
                                    />
                                </Grid>

                                {/* Aadhar Number */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="aadhar"
                                        name="aadhar"
                                        label="Aadhar Number"
                                        variant="outlined"
                                        required
                                        value={formData.aadhar}
                                        onChange={handleChange}
                                        error={!!errors.aadhar} // Add error prop
                                        helperText={errors.aadhar} // Display error message
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
                                    />
                                </Grid>

                                {/* Image Upload or Capture */}
                                <Grid item xs={12} sm={6}>
                                    <Box>
                                        <Button
                                            variant="contained"
                                            component="label"
                                        >
                                            Upload Image
                                            <input
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
                                            sx={{ ml: 2 }}
                                        >
                                            {usingWebcam ? 'Cancel' : 'Use Webcam'}
                                        </Button>

                                        {/* Display uploaded image */}
                                        {fileImage.image && !fileImage.capture && (
                                            <Box mt={2}>
                                                <img src={URL.createObjectURL(fileImage.image)} alt="Uploaded Image" style={{ width: '100px' }} />
                                            </Box>
                                        )}

                                        {fileImage.capture && (
                                            <Box mt={2}>
                                                <img src={fileImage.capture} alt="Captured Image" style={{ width: '100px' }} />
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
                                        >
                                            Upload Signature
                                            <input
                                                type="file"
                                                name="signature"
                                                hidden
                                                accept="image/*"
                                                // Enables capture from the camera
                                                onChange={handleimagechange} // Attach the file change handler
                                            />
                                        </Button>

                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => setUsingSigncam(!usingSigncam)}
                                            sx={{ ml: 2 }}
                                        >
                                            {usingSigncam ? 'Cancel' : 'Use Webcam'}
                                        </Button>

                                        {/* Display uploaded signature */}
                                        {fileImage.signature && !fileImage.sCapture && (
                                            <Box mt={2}>
                                                <img src={URL.createObjectURL(fileImage.signature)} alt="Uploaded Signature" style={{ width: '100px' }} />
                                            </Box>
                                        )}

                                        {fileImage.sCapture && (
                                            <Box mt={2}>
                                                <img src={fileImage.sCapture} alt="Captured Image" style={{ width: '100px' }} />
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
            </Modal>
        </>
    );
}
