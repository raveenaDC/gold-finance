import React, { useState } from 'react';
import { Button, TextField, Checkbox, FormControlLabel, Typography, Box, IconButton, Grid, Dialog, DialogActions, DialogContent, DialogTitle, Stepper, Step, StepLabel } from '@mui/material';
import { Person, Email, Phone, Work, CalendarToday, ArrowBack, ArrowForward, Done, CheckCircle, LocationOn } from '@mui/icons-material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';


const steps = ['Basic Information', 'Permissions', 'Confirmation'];

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    '& .MuiInputBase-root': {
        borderRadius: '8px',
    },
}));

const IconLabel = ({ icon: Icon, label }) => (
    <Box display="flex" alignItems="center" gap={1}>
        <Icon fontSize="small" /> <Typography variant="body1">{label}</Typography>
    </Box>
);

const StyledText = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    color: '#2F2F2F', // Charcoal Grey
}));

const PermissionForm = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        mobile: '',
        altMobile: '',
        email: '',
        address: '',
        city: '',
        landmark: '',
        pinCode: '',
        permissions: {
            sunday: false,
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            goldLoan: false,
            pledge: false,
        },
    });
    const [openModal, setOpenModal] = useState(false); // State to control the modal open/close

    const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
    const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData({ ...formData, permissions: { ...formData.permissions, [name]: checked } });
    };

    const handleSubmit = () => {
        console.log('Form Data:', formData);
        // Reset the form
        setFormData({
            firstName: '',
            lastName: '',
            mobile: '',
            altMobile: '',
            email: '',
            address: '',
            city: '',
            landmark: '',
            pinCode: '',
            permissions: {
                sunday: false,
                monday: false,
                tuesday: false,
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false,
                goldLoan: false,
                pledge: false,
            },
        });
        setActiveStep(0); // Reset to Basic Information step
        setOpenModal(false); // Close the modal
    };

    const renderBasicInformation = () => (
        <Box>
            <StyledTextField
                name="firstName"
                label={<IconLabel icon={Person} label="First Name" />}
                fullWidth
                variant="outlined"
                onChange={handleInputChange}
                size='small'
            />
            <StyledTextField
                name="lastName"
                label={<IconLabel icon={Person} label="Last Name" />}
                fullWidth
                variant="outlined"
                onChange={handleInputChange}
                size='small'
            />
            <StyledTextField
                name="mobile"
                label={<IconLabel icon={Phone} label="Mobile" />}
                fullWidth
                variant="outlined"
                onChange={handleInputChange}
                size='small'
            />
            <StyledTextField
                name="altMobile"
                label={<IconLabel icon={Phone} label="Alternative Mobile" />}
                fullWidth
                variant="outlined"
                onChange={handleInputChange}
                size='small'
            />
            <StyledTextField
                name="email"
                label={<IconLabel icon={Email} label="Email" />}
                fullWidth
                variant="outlined"
                onChange={handleInputChange}
                size='small'
            />
            <StyledTextField
                name="address"
                label={<IconLabel icon={LocationOn} label="Address" />}
                fullWidth
                variant="outlined"
                onChange={handleInputChange}
                size='small'
            />
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <StyledTextField
                        name="city"
                        label={<IconLabel icon={LocationOn} label="City" />}
                        fullWidth
                        variant="outlined"
                        onChange={handleInputChange}
                        size='small'
                    />
                </Grid>
                <Grid item xs={6}>
                    <StyledTextField
                        name="landmark"
                        label={<IconLabel icon={LocationOn} label="Landmark" />}
                        fullWidth
                        variant="outlined"
                        onChange={handleInputChange}
                        size='small'
                    />
                </Grid>
            </Grid>
            <StyledTextField
                name="pinCode"
                label={<IconLabel icon={LocationOn} label="Pin Code" />}
                fullWidth
                variant="outlined"
                onChange={handleInputChange}
                size='small'
            />
        </Box>
    );

    const renderPermissions = () => (
        <Box>
            <>
                <StyledText variant="h6">Select Days of Week</StyledText>
                {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => (
                    <FormControlLabel
                        control={<Checkbox name={day} checked={formData.permissions[day]} onChange={handleCheckboxChange} />}
                        label={day.charAt(0).toUpperCase() + day.slice(1)}
                        key={day}
                    />
                ))}

                <StyledText variant="h6" sx={{ mt: 3 }}>Gold Loan Permissions</StyledText>
                <FormControlLabel
                    control={<Checkbox name="goldLoanMasterCreate" checked={formData.permissions.goldLoanMasterCreate} onChange={handleCheckboxChange} />}
                    label="Gold Loan Master Create"
                />
                <FormControlLabel
                    control={<Checkbox name="goldLoanTransaction" checked={formData.permissions.goldLoanTransaction} onChange={handleCheckboxChange} />}
                    label="Gold Loan Transaction"
                />
                <FormControlLabel
                    control={<Checkbox name="goldLoanEditing" checked={formData.permissions.goldLoanEditing} onChange={handleCheckboxChange} />}
                    label="Gold Loan Editing"
                />

                <StyledText variant="h6" sx={{ mt: 3 }}>Pledge Permissions</StyledText>
                <FormControlLabel
                    control={<Checkbox name="pledgeMasterCreate" checked={formData.permissions.pledgeMasterCreate} onChange={handleCheckboxChange} />}
                    label="Pledge Master Create"
                />
                <FormControlLabel
                    control={<Checkbox name="pledgeTransaction" checked={formData.permissions.pledgeTransaction} onChange={handleCheckboxChange} />}
                    label="Pledge Transaction"
                />
            </>
        </Box>
    );

    const renderConfirmation = () => (
        <Box sx={{ padding: 2, backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>Confirm Your Details</Typography>

            {/* Basic Information Section */}
            <Box sx={{ marginBottom: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>Basic Information</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="body2">First Name: <strong>{formData.firstName}</strong></Typography>
                        <Typography variant="body2">Mobile: <strong>{formData.mobile}</strong></Typography>
                        <Typography variant="body2">Email: <strong>{formData.email}</strong></Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">Last Name: <strong>{formData.lastName}</strong></Typography>
                        <Typography variant="body2">Alternative Mobile: <strong>{formData.altMobile}</strong></Typography>
                        <Typography variant="body2">Address: <strong>{formData.address}</strong></Typography>
                    </Grid>
                </Grid>
            </Box>

            {/* Location Details */}
            <Box sx={{ marginBottom: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>Location Details</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="body2">City: <strong>{formData.city}</strong></Typography>
                        <Typography variant="body2">Landmark: <strong>{formData.landmark}</strong></Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">Pin Code: <strong>{formData.pinCode}</strong></Typography>
                    </Grid>
                </Grid>
            </Box>

            {/* Selected Days */}
            <Box sx={{ marginBottom: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>Selected Days</Typography>
                {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) =>
                    formData.permissions[day] && <Typography variant="body2" key={day} sx={{ display: 'inline-block', marginRight: 2, marginBottom: 1 }}>
                        <strong>{day.charAt(0).toUpperCase() + day.slice(1)}</strong>
                    </Typography>
                )}
            </Box>

            {/* Gold Loan Permissions */}
            <Box sx={{ marginBottom: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>Gold Loan Permissions</Typography>
                {formData.permissions.goldLoanMasterCreate && <Typography variant="body2">- Gold Loan Master Create</Typography>}
                {formData.permissions.goldLoanTransaction && <Typography variant="body2">- Gold Loan Transaction</Typography>}
                {formData.permissions.goldLoanEditing && <Typography variant="body2">- Gold Loan Editing</Typography>}
            </Box>

            {/* Pledge Permissions */}
            <Box>
                <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>Pledge Permissions</Typography>
                {formData.permissions.pledgeMasterCreate && <Typography variant="body2">- Pledge Master Create</Typography>}
                {formData.permissions.pledgeTransaction && <Typography variant="body2">- Pledge Transaction</Typography>}
            </Box>
        </Box>
    );

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleOpenModal}>Open Form</Button>

            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
                <DialogTitle>Staff Member Registration</DialogTitle>
                <DialogContent>
                    <Box sx={{ p: 4 }}>
                        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel StepIconComponent={() => <CheckCircle color={activeStep ? 'primary' : 'disabled'} />}>
                                        {label}
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>


                        {activeStep === steps.length ? (
                            <Box textAlign="center">
                                <Typography variant="h6">All steps completed - your form is ready to submit!</Typography>
                                <Button variant="contained" color="success" startIcon={<Done />} onClick={handleSubmit}>
                                    Submit
                                </Button>
                            </Box>
                        ) : (
                            <Box component={motion.div} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                                {activeStep === 0 && renderBasicInformation()}
                                {activeStep === 1 && renderPermissions()}
                                {activeStep === 2 && renderConfirmation()}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                    <IconButton color="primary" onClick={handleBack} disabled={activeStep === 0}>
                                        <ArrowBack />
                                    </IconButton>
                                    <IconButton color="primary" onClick={handleNext}>
                                        {activeStep === steps.length - 1 ? <Done /> : <ArrowForward />}
                                    </IconButton>
                                </Box>
                            </Box>
                        )}

                    </Box>
                </DialogContent>
                <DialogActions>

                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PermissionForm;
