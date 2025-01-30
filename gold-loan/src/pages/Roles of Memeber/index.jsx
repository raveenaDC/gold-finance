import React, { useState } from 'react';
import { Button, TextField, Checkbox, FormControlLabel, Typography, Box, IconButton, Grid, Dialog, DialogActions, DialogContent, DialogTitle, Stepper, Step, StepLabel, Autocomplete } from '@mui/material';
import { Person, Email, Phone, Work, CalendarToday, ArrowBack, ArrowForward, Done, CheckCircle } from '@mui/icons-material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';

const steps = ['Permissions', 'Confirmation'];

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
    const [openModal, setOpenModal] = useState(false); // State to control the modal open/close
    const [designation, setDesignation] = useState('');
    const [formData, setFormData] = useState({
        permissions: {
            sunday: false,
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            goldLoanMasterCreate: false,
            goldLoanTransaction: false,
            goldLoanEditing: false,
            pledgeMasterCreate: false,
            pledgeTransaction: false,
        },
    });

    const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
    const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData({ ...formData, permissions: { ...formData.permissions, [name]: checked } });
    };

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);



    const renderPermissions = () => (
        <Box>
            <Autocomplete
                label="Designation"
                value={designation}
                onChange={(e, newValue) => setDesignation(newValue)}
                options={['Manager', 'Staff', 'Supervisor']} // Example options, adjust as needed
                getOptionLabel={(option) => option}
                renderInput={(params) => <TextField {...params} label="Designation" />}
                fullWidth sx={{ mb: 2 }}
            />

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
        </Box>
    );

    const renderConfirmation = () => (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Designations List</Typography>
            <Box sx={{ p: 1, border: '1px solid grey', mb: 1, borderRadius: 1 }}>
                <Typography variant="body1"><strong>{designation}</strong></Typography>
                <Typography variant="body2">Permissions: {formData.permissions.goldLoanMasterCreate ? 'Gold Loan Master Create ' : ''}{formData.permissions.goldLoanTransaction ? 'Gold Loan Transaction ' : ''}</Typography>
                <Typography variant="body2">Access Days: {Object.keys(formData.permissions).filter(day => formData.permissions[day] && day !== 'goldLoanMasterCreate' && day !== 'goldLoanTransaction').join(', ')}</Typography>
            </Box>
        </Box>
    );

    const handleSubmit = () => {
        // Handle form submission here
        console.log('Form submitted with:', formData);
        handleCloseModal();
    };

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

                                {activeStep === 0 && renderPermissions()}
                                {activeStep === 1 && renderConfirmation()}
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
