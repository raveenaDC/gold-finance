import React, { useState, useRef } from 'react';
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
    const [fileImage, setFileImage] = useState({
        image: null,
        signature: null,
        capture: null,
    }); // State to store the uploaded image and signature

    const [usingWebcam, setUsingWebcam] = useState(false); // Toggle between file upload and webcam
    const webcamRef = useRef(null); // Ref to access the webcam

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        location: '',
        state: '',
        zip: '',
        aadhar: '',
        primaryNumber: '',
        secondaryNumber: '',
        gst: '',
        nearBy: '',
        email: '', // Add email field

    });



    // Function to handle file changes for both image and signature
    // const handleFileChange = (e) => {
    //     const { name } = e.target; // 'image' or 'signature'
    //     const file = e.target.files[0]; // Get the selected file

    //     if (file) {
    //         const fileURL = URL.createObjectURL(file); // Create a preview URL for the image or signature

    //         // Update the form data and the respective preview
    //         if (name === "image") {
    //             setFileImage(fileURL); // Update image preview
    //         } else if (name === "signature") {
    //             setFileSignature(fileURL); // Update signature preview
    //         }

    //         // Update the formData with the actual file (not URL)
    //         setFormData((prevData) => ({
    //             ...prevData,
    //             [name]: file, // Store the file in the form data
    //         }));
    //     }
    // };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // handle image change
    const handleimagechange = (e) => {
        const { name, files } = e.target;
        setFileImage({ ...fileImage, [name]: files[0] });
    };

    // Handle webcam capture
    const captureImage = () => {
        const imageSrc = webcamRef.current.getScreenshot(); // Capture image from webcam
        setFileImage({ ...fileImage, capture: imageSrc });
        setUsingWebcam(false); // Hide the webcam after capture
    };

    //handle from input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    // handle for submiossion
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('firstName', formData.firstName);
        data.append('lastName', formData.lastName);
        data.append('address', formData.address);
        data.append('location', formData.location);
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

        // Add captured image if available
        if (fileImage.capture) {
            data.append('capture', fileImage.capture);
        }





        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'address', 'location', 'state', 'zip', 'primaryNumber', 'email'];
        const isFormValid = requiredFields.every(field => formData[field]);

        if (!isFormValid) {
            alert('Please fill all required fields!'); // Alert user if fields are missing
            return; // Prevent form submission if validation fails
        }

        try {
            // console.log(formData)
            // console.log("File Data (Image):", fileImage.image);
            // console.log("File Data (Image):", fileImage.signature);
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
                location: '',
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
                                    />
                                </Grid>

                                {/* Location/City */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="location"
                                        name="location"
                                        label="Location (City)"
                                        variant="outlined"
                                        required
                                        value={formData.location}
                                        onChange={handleChange}
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
                                    />
                                </Grid>

                                {/* Near By Place */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="nearBy"
                                        name="nearBy"
                                        label="Near By Place"
                                        variant="outlined"
                                        required
                                        value={formData.nearBy}
                                        onChange={handleChange}
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
                                        value={formData.aadhar}
                                        onChange={handleChange}
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
                                        {fileImage.image && (
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
                                                capture="environment" // Enables capture from the camera
                                                onChange={handleimagechange} // Attach the file change handler
                                            />
                                        </Button>

                                        {/* Display uploaded signature */}
                                        {fileImage.signature && (
                                            <Box mt={2}>
                                                <img src={URL.createObjectURL(fileImage.signature)} alt="Uploaded Signature" style={{ width: '100px' }} />
                                            </Box>
                                        )}
                                    </Box>
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
