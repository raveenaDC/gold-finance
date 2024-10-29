import React, { useState } from 'react';
import AddNomineeDetails from './AddNomineeDetails';
import {
    Box,
    Grid,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import Webcam from 'react-webcam';

const GoldLoanForm = () => {
    const [form, setForm] = useState({
        glNumber: '',
        purchaseDate: '',
        goldRate: '',
        companyGoldRate: '',
        netWeight: '',
        grossWeight: '',
        stoneWeight: '',
        itemDetails: '',
        insurance: false,
        processingFee: '',
        packingFee: '',
    });

    const [errors, setErrors] = useState({});
    const [interestType, setInterestType] = useState('simple');
    const [image, setImage] = useState(null);
    const [showWebcam, setShowWebcam] = useState(false);
    const webcamRef = React.useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleInterestChange = (event, newType) => {
        setInterestType(newType);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.glNumber) newErrors.glNumber = "GL Number is required";
        if (!form.purchaseDate) newErrors.purchaseDate = "Purchase Date is required";
        if (!form.goldRate) newErrors.goldRate = "Gold Rate is required";
        if (!form.companyGoldRate) newErrors.companyGoldRate = "Company Gold Rate is required";
        if (!form.netWeight) newErrors.netWeight = "Net Weight is required";
        if (!form.grossWeight) newErrors.grossWeight = "Gross Weight is required";
        if (!form.itemDetails) newErrors.itemDetails = "Item Details selection is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form data:', form);
            // Proceed with form submission
        } else {
            console.log('Validation errors:', errors);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
        setShowWebcam(false);
    };

    const handleCloseImage = () => {
        setImage(null); // Reset the image state to close the image
    };

    return (
        <Box sx={{ display: 'flex', gap: 4, overflowY: 'auto', maxHeight: '90vh' }}>
            {/* Gold Loan Form Section */}
            <Grid container component="form" onSubmit={handleSubmit} spacing={2} sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ mb: 0.2, mt: 2 }}> .. Gold Loan Form</Typography>

                <Grid item xs={12}>
                    <AddNomineeDetails />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        label="Gold Rate"
                        name="goldRate"
                        type="number"
                        value={form.goldRate}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.goldRate}
                        helperText={errors.goldRate}
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        label="Company Gold Rate"
                        name="companyGoldRate"
                        type="number"
                        value={form.companyGoldRate}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.companyGoldRate}
                        helperText={errors.companyGoldRate}
                    />
                </Grid>

                <Grid item xs={4}>
                    <TextField
                        label="Net Weight (grams)"
                        name="netWeight"
                        type="number"
                        value={form.netWeight}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.netWeight}
                        helperText={errors.netWeight}
                    />
                </Grid>

                <Grid item xs={4}>
                    <TextField
                        label="Gross Weight (grams)"
                        name="grossWeight"
                        type="number"
                        value={form.grossWeight}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.grossWeight}
                        helperText={errors.grossWeight}
                    />
                </Grid>

                <Grid item xs={4}>
                    <TextField
                        label="Stone Weight (grams)"
                        name="stoneWeight"
                        type="number"
                        value={form.stoneWeight}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>Item Details</InputLabel>
                        <Select
                            name="itemDetails"
                            value={form.itemDetails}
                            onChange={handleChange}
                            error={!!errors.itemDetails}
                        >
                            <MenuItem value=""><em>Select Item</em></MenuItem>
                            <MenuItem value="chain">Chain</MenuItem>
                            <MenuItem value="ring">Ring</MenuItem>
                            <MenuItem value="bangle">Bangle</MenuItem>
                            <MenuItem value="handchain">Handchain</MenuItem>
                            <MenuItem value="earings">Earrings</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Interest Rate"
                        name="processingFee"
                        type="number"
                        value={form.processingFee}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        label="Principal amount"
                        name="packingFee"
                        type="number"
                        value={form.packingFee}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        label="Insurance"
                        name="processingFee"
                        type="number"
                        value={form.processingFee}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        label="Apprecial"
                        name="packingFee"
                        type="number"
                        value={form.packingFee}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        label="Processing Fee"
                        name="processingFee"
                        type="number"
                        value={form.processingFee}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        label="Packing Fee"
                        name="packingFee"
                        type="number"
                        value={form.packingFee}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Submit
                    </Button>
                </Grid>
            </Grid>

            {/* Interest Calculator Section */}
            <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>Interest Calculation</Typography>

                <ToggleButtonGroup
                    color="primary"
                    value={interestType}
                    exclusive
                    onChange={handleInterestChange}
                    aria-label="Interest Type"
                >
                    <ToggleButton value="simple">Simple</ToggleButton>
                    <ToggleButton value="multiple">Multiple</ToggleButton>
                </ToggleButtonGroup>

                {interestType === 'multiple' && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1">Mode</Typography>
                        <FormControl fullWidth>
                            <InputLabel>Select Mode</InputLabel>
                            <Select name="mode" value={form.mode} onChange={handleChange}>
                                <MenuItem value="days">Days</MenuItem>
                                <MenuItem value="weekly">Weekly</MenuItem>
                                <MenuItem value="monthly">Monthly</MenuItem>
                                <MenuItem value="quarterly">Quarterly</MenuItem>
                                <MenuItem value="halfyearly">Half-Yearly</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                )}

                {/* Image Upload and Capture */}
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6">Upload or Capture Image</Typography>
                    <input
                        accept="image/*"
                        type="file"
                        onChange={handleImageUpload}
                        style={{ display: 'block', marginTop: '10px' }}
                    />
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => setShowWebcam(!showWebcam)}
                    >
                        {showWebcam ? 'Close Camera' : 'Open Camera'}
                    </Button>

                    {showWebcam && (
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
                                onClick={capture}
                                sx={{ mt: 2 }}
                            >
                                Capture Image
                            </Button>
                        </Box>
                    )}

                    {image && (
                        <Box sx={{ mt: 2, position: 'relative' }}>
                            <Typography variant="subtitle1">Captured/Uploaded Image:</Typography>
                            <Box
                                component="img"
                                src={image}
                                alt="Captured"
                                sx={{ mt: 1, width: '100%', height: 'auto', borderRadius: 1 }}
                            />
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleCloseImage}
                                sx={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 10,
                                }}
                            >
                                Close
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default GoldLoanForm;

