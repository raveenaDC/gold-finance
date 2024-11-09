import React, { useState } from 'react';
import { Button, Grid, TextField, Typography, Modal, Box } from '@mui/material';

const AddNomineeDetails = () => {
    const [showNomineeModal, setShowNomineeModal] = useState(false);
    const [nomineeSaved, setNomineeSaved] = useState(false);
    const [nomineeDetails, setNomineeDetails] = useState({
        firstName: '',
        lastName: '',
        address: '',
        place: '',
        state: '',
        nearByLocation: '',
        aadhar: '',
        relationship: '',
        contact: ''
    });

    const handleNomineeModalOpen = () => setShowNomineeModal(true);
    const handleNomineeModalClose = () => setShowNomineeModal(false);

    const handleNomineeChange = (e) => {
        const { name, value } = e.target;
        setNomineeDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSaveNomineeDetails = () => {
        setNomineeSaved(true); // Mark nominee details as saved
        handleNomineeModalClose(); // Close the modal
    };



    return (
        <Grid container spacing={2}>
            {/* Add or Display Nominee Button */}
            <Grid item xs={12}>
                <Button variant="text" color="Secondary" onClick={handleNomineeModalOpen}>
                    {nomineeSaved ? `Nominee: ${nomineeDetails.firstName}` : 'Add Nominee '}
                </Button>
                {/* <Button
                    variant="text"
                    color="Secondary"
                    fullWidth

                >
                    {nomineeSaved ? `Nominee: ${nomineeDetails.firstName}` : 'Add Nominee Details'}
                </Button> */}
            </Grid>

            {/* Nominee Details Modal */}
            <Modal open={showNomineeModal} onClose={handleNomineeModalClose} aria-labelledby="nominee-modal-title">
                <Box
                    sx={{
                        p: 4,
                        backgroundColor: 'white',
                        borderRadius: 2,
                        maxWidth: 400,
                        margin: 'auto',
                        mt: '7%',
                        maxHeight: '88vh',    // Set maximum height for scrollable area
                        overflowY: 'auto',     // Enable vertical scrolling
                        '::-webkit-scrollbar': { display: 'none' },  // Hide scrollbar in Webkit browsers
                        msOverflowStyle: 'none',  // Hide scrollbar in IE and Edge
                        scrollbarWidth: 'none'    // Hide scrollbar in Firefox
                    }}
                >
                    <Typography id="nominee-modal-title" variant="h6" component="h2">
                        Nominee Details
                    </Typography>
                    <TextField
                        label="First Name"
                        name="firstName"
                        value={nomineeDetails.firstName}
                        onChange={handleNomineeChange}
                        fullWidth
                        size="small"
                        sx={{ mt: 1 }}
                    />
                    <TextField
                        label="Last Name"
                        name="lastName"
                        value={nomineeDetails.lastName}
                        onChange={handleNomineeChange}
                        fullWidth
                        size="small"
                        sx={{ mt: 1 }}
                    />
                    <TextField
                        label="Address"
                        name="address"
                        value={nomineeDetails.address}
                        onChange={handleNomineeChange}
                        fullWidth
                        size="small"
                        sx={{ mt: 1 }}
                    />
                    <TextField
                        label="Place"
                        name="place"
                        value={nomineeDetails.place}
                        onChange={handleNomineeChange}
                        fullWidth
                        size="small"
                        sx={{ mt: 1 }}
                    />
                    <TextField
                        label="State"
                        name="state"
                        value={nomineeDetails.state}
                        onChange={handleNomineeChange}
                        fullWidth
                        size="small"
                        sx={{ mt: 1 }}
                    />
                    <TextField
                        label="Near By Location"
                        name="nearByLocation"
                        value={nomineeDetails.nearByLocation}
                        onChange={handleNomineeChange}
                        fullWidth
                        size="small"
                        sx={{ mt: 1 }}
                    />
                    <TextField
                        label="Aadhar"
                        name="aadhar"
                        value={nomineeDetails.aadhar}
                        onChange={handleNomineeChange}
                        fullWidth
                        size="small"
                        sx={{ mt: 1 }}
                    />
                    <TextField
                        label="Relationship"
                        name="relationship"
                        value={nomineeDetails.relationship}
                        onChange={handleNomineeChange}
                        fullWidth
                        size="small"
                        sx={{ mt: 1 }}
                    />
                    <TextField
                        label="Contact"
                        name="contact"
                        value={nomineeDetails.contact}
                        onChange={handleNomineeChange}
                        fullWidth
                        size="small"
                        sx={{ mt: 1 }}
                    />
                    <Button variant="contained" color="primary" onClick={handleSaveNomineeDetails} fullWidth sx={{ mt: 3 }}>
                        Save Nominee Details
                    </Button>
                </Box>
            </Modal>
        </Grid>
    );
};

export default AddNomineeDetails;
