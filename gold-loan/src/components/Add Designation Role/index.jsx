import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Checkbox, FormControlLabel, Autocomplete, TextField } from '@mui/material';
import { useSpring, animated } from 'react-spring';

const StaffDesignation = () => {
    const [open, setOpen] = useState(false);
    const [designation, setDesignation] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const [permissions, setPermissions] = useState({ view: false, edit: false });
    const [designations, setDesignations] = useState([]);
    const [currentStep, setCurrentStep] = useState(1); // Step 1: Input, Step 2: Details

    const predefinedDesignations = ['Manager', 'Assistant Manager', 'Clerk', 'Cashier', 'Loan Officer'];
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Animation for step transition
    const stepTransition = useSpring({
        opacity: 1,
        transform: currentStep === 1 ? 'translateX(0)' : 'translateX(100%)',
        config: { tension: 220, friction: 120 }
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setDesignation('');
        setSelectedDays([]);
        setPermissions({ view: false, edit: false });
        setCurrentStep(1); // Reset to Step 1 when closing the modal
        setOpen(false);
    };

    const handleSubmit = () => {
        if (designation.trim() !== '') {
            setDesignations([...designations, { designation, selectedDays, permissions }]);
            setCurrentStep(2); // Go to Step 2 to show details after submission
        }
    };

    const toggleDay = (day) => {
        setSelectedDays(prevDays =>
            prevDays.includes(day) ? prevDays.filter(d => d !== day) : [...prevDays, day]
        );
    };

    const goToNextStep = () => {
        setCurrentStep(2); // Go to Step 2 after clicking Next
    };

    return (
        <div>
            <Button variant="contained" onClick={handleOpen}>Add Designation</Button>

            {/* Display Added Designations */}
            <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Added Designations</Typography>
                {designations.length > 0 ? (
                    designations.map((item, index) => (
                        <Box key={index} sx={{ p: 1, border: '1px solid grey', mb: 1, borderRadius: 1 }}>
                            <Typography variant="body1"><strong>{item.designation}</strong></Typography>
                            <Typography variant="body2">Access Days: {item.selectedDays.join(', ') || 'None'}</Typography>
                            <Typography variant="body2">Permissions: {item.permissions.view ? 'View ' : ''} {item.permissions.edit ? 'Edit' : ''}</Typography>
                        </Box>
                    ))
                ) : (
                    <Typography variant="body2">No designations added yet.</Typography>
                )}
            </Box>

            {/* Modal */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
                    <animated.div style={stepTransition}>
                        {currentStep === 1 ? (
                            <>
                                <Typography variant="h6" gutterBottom>Add Designation</Typography>

                                {/* Designation Input */}
                                <Autocomplete
                                    options={predefinedDesignations}
                                    value={designation}
                                    onChange={(event, newValue) => setDesignation(newValue || '')}
                                    renderInput={(params) => <TextField {...params} label="Designation" fullWidth sx={{ mb: 2 }} />}
                                />

                                {/* Select Days */}
                                <Typography variant="body1" sx={{ mb: 1 }}>Select Days</Typography>
                                {daysOfWeek.map(day => (
                                    <FormControlLabel
                                        key={day}
                                        control={<Checkbox checked={selectedDays.includes(day)} onChange={() => toggleDay(day)} />}
                                        label={day}
                                    />
                                ))}

                                {/* Permissions */}
                                <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>Permissions</Typography>
                                <FormControlLabel
                                    control={<Checkbox checked={permissions.view} onChange={() => setPermissions({ ...permissions, view: !permissions.view })} />}
                                    label="View Gold Loan Form"
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={permissions.edit} onChange={() => setPermissions({ ...permissions, edit: !permissions.edit })} />}
                                    label="Edit Gold Loan Form"
                                />

                                {/* Next Button */}
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                    <Button variant="contained" color="success" onClick={handleSubmit} size="small">
                                        Submit
                                    </Button>
                                    <Button variant="contained" color="primary" onClick={goToNextStep} size="small" sx={{ ml: 1 }}>
                                        Next
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <>
                                <Typography variant="h6" gutterBottom>Designation Details</Typography>
                                {/* Show details after Step 1 */}
                                <Box sx={{ p: 1, border: '1px solid grey', mb: 1, borderRadius: 1 }}>
                                    <Typography variant="body1"><strong>{designation}</strong></Typography>
                                    <Typography variant="body2">Access Days: {selectedDays.join(', ') || 'None'}</Typography>
                                    <Typography variant="body2">Permissions: {permissions.view ? 'View ' : ''} {permissions.edit ? 'Edit' : ''}</Typography>
                                </Box>

                                {/* Close Button */}
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                    <Button variant="contained" color="error" onClick={handleClose} size="small">
                                        Close
                                    </Button>
                                </Box>
                            </>
                        )}
                    </animated.div>
                </Box>
            </Modal>
        </div>
    );
};

export default StaffDesignation;
