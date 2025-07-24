import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Checkbox, FormControlLabel, Autocomplete, TextField } from '@mui/material';

const StaffDesignation = () => {
    const [open, setOpen] = useState(false);
    const [designation, setDesignation] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const [permissions, setPermissions] = useState({ view: false, edit: false });
    const [designations, setDesignations] = useState([]);
    const [currentStep, setCurrentStep] = useState(1); // Step 1: Input, Step 2: Details
    const [error, setError] = useState('');

    const predefinedDesignations = ['Manager', 'Assistant Manager', 'Clerk', 'Cashier', 'Loan Officer'];
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setDesignation('');
        setSelectedDays([]);
        setPermissions({ view: false, edit: false });
        setError(''); // Reset error message on close
        setCurrentStep(1); // Reset to Step 1 when closing the modal
        setOpen(false);
    };

    const handleSubmit = () => {
        if (designation.trim() === '') {
            setError('Designation is required');
            return;
        }

        setDesignations([...designations, { designation, selectedDays, permissions }]);
        setCurrentStep(2); // Go to Step 2 to show details after submission
        // Reset form after submission
        setDesignation('');
        setSelectedDays([]);
        setPermissions({ view: false, edit: false });
    };

    const toggleDay = (day) => {
        setSelectedDays(prevDays =>
            prevDays.includes(day) ? prevDays.filter(d => d !== day) : [...prevDays, day]
        );
    };

    const goToNextStep = () => {
        if (!designation) {
            setError('Please select a designation before proceeding.');
        } else {
            setCurrentStep(2); // Go to Step 2 after clicking Next
        }
    };

    const handleEdit = () => {
        setCurrentStep(1); // Go back to Step 1 for editing
        setError(''); // Reset error message when editing
    };

    return (
        <div>
            {/* Trigger to open the modal */}
            <Typography onClick={handleOpen} variant="body2" sx={{ cursor: 'pointer', }}>
                Add Designation
            </Typography>

            {/* Modal */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: 300, sm: 400 },
                    bgcolor: 'background.paper',
                    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)', // 3D shadow effect
                    p: 3,
                    borderRadius: 2,
                    border: '1px solid #e0e0e0', // Subtle border for depth
                }}>
                    {currentStep === 1 ? (
                        <>
                            {/* Step 1: Add Designation */}
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                Add Designation
                            </Typography>

                            {/* Error Message */}
                            {error && (
                                <Typography color="error" sx={{ mb: 1, fontSize: '0.875rem' }}>
                                    {error}
                                </Typography>
                            )}

                            {/* Designation Input */}
                            <Autocomplete
                                options={predefinedDesignations}
                                value={designation}
                                onChange={(event, newValue) => {
                                    setDesignation(newValue || '');
                                    setError(''); // Clear error when a designation is selected
                                }}
                                size="small"
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Designation"
                                        fullWidth
                                        sx={{ mb: 2, boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)' }} // 3D effect for input
                                    />
                                )}
                            />

                            {/* Select Days */}
                            <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                                Select Days
                            </Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, mb: 2 }}>
                                {daysOfWeek.map(day => (
                                    <FormControlLabel
                                        key={day}
                                        control={
                                            <Checkbox
                                                checked={selectedDays.includes(day)}
                                                onChange={() => toggleDay(day)}
                                                size="small"
                                                sx={{
                                                    '& .MuiSvgIcon-root': { fontSize: 20 }, // Smaller checkbox
                                                    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)', // 3D effect for checkboxes
                                                }}
                                            />
                                        }
                                        label={day}
                                        sx={{ ml: 0 }} // Align checkboxes to the left
                                    />
                                ))}
                            </Box>

                            {/* Permissions */}
                            <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                                Permissions
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={permissions.view}
                                            onChange={() => setPermissions({ ...permissions, view: !permissions.view })}
                                            size="small"
                                            sx={{
                                                '& .MuiSvgIcon-root': { fontSize: 20 }, // Smaller checkbox
                                                boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)', // 3D effect for checkboxes
                                            }}
                                        />
                                    }
                                    label="View Gold Loan Form"
                                    sx={{ ml: 0 }} // Align checkboxes to the left
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={permissions.edit}
                                            onChange={() => setPermissions({ ...permissions, edit: !permissions.edit })}
                                            size="small"
                                            sx={{
                                                '& .MuiSvgIcon-root': { fontSize: 20 }, // Smaller checkbox
                                                boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)', // 3D effect for checkboxes
                                            }}
                                        />
                                    }
                                    label="Edit Gold Loan Form"
                                    sx={{ ml: 0 }} // Align checkboxes to the left
                                />
                            </Box>

                            {/* Next and Submit Buttons */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={goToNextStep}
                                    size="small"
                                    sx={{ boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.2)' }} // 3D effect for buttons
                                >
                                    Next
                                </Button>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleSubmit}
                                    size="small"
                                    sx={{ boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.2)' }} // 3D effect for buttons
                                >
                                    Submit
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <>
                            {/* Step 2: Designation Details */}
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                Designation Details
                            </Typography>

                            {/* Show details after Step 1 */}
                            <Box sx={{
                                p: 1.5,
                                border: '1px solid #ccc',
                                mb: 2,
                                borderRadius: 1,
                                boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)', // 3D effect for details box
                            }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    {designation}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                    Access Days: {selectedDays.join(', ') || 'None'}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                    Permissions: {permissions.view ? 'View ' : ''} {permissions.edit ? 'Edit' : ''}
                                </Typography>
                            </Box>

                            {/* Edit and Close Buttons */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleEdit}
                                    size="small"
                                    sx={{ boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.2)' }} // 3D effect for buttons
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleClose}
                                    size="small"
                                    sx={{ boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.2)' }} // 3D effect for buttons
                                >
                                    Close
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default StaffDesignation;