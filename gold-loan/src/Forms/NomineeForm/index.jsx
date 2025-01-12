import React, { useState } from 'react';
import { Button, Grid, TextField, Typography, Modal, Box } from '@mui/material';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { NomineeSearch } from '../../components'
import { useNominee } from '../../configure/NomineeContext';
import { submitDocument } from '../../api';

// function CustomTabPanel(props) {
//     const { children, value, index, ...other } = props;

//     return (
//         <div
//             role="tabpanel"
//             hidden={value !== index}
//             id={`simple-tabpanel-${index}`}
//             aria-labelledby={`simple-tab-${index}`}
//             {...other}
//         >
//             {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
//         </div>
//     );
// }
// CustomTabPanel.propTypes = {
//     children: PropTypes.node,
//     index: PropTypes.number.isRequired,
//     value: PropTypes.number.isRequired,
// };
// function a11yProps(index) {
//     return {
//         id: `simple-tab-${index}`,
//         'aria-controls': `simple-tabpanel-${index}`,
//     };
// }
const AddNomineeDetails = () => {
    const [showNomineeModal, setShowNomineeModal] = useState(false);
    const [nomineeSaved, setNomineeSaved] = useState(false);
    const [nomineeId, setNomineeId] = useState(false);
    const [value, setValue] = React.useState(0);

    // const [nomineeDetails, setNomineeDetails] = useState({
    //     firstName: '',
    //     lastName: '',
    //     address: '',
    //     place: '',
    //     state: '',
    //     nearBy: '',
    //     aadhar: '',
    //     primaryNumber: '',
    //     email: '', // Add email field
    // });


    const { nominee } = useNominee(); // Access nominee data from context    
    const { setNominee } = useNominee();// Use the setNominee function from context

    const handleNomineeModalOpen = () => setShowNomineeModal(true);
    const handleNomineeModalClose = () => setShowNomineeModal(false);

    // const handleNomineeChange = (e) => {
    //     const { name, value } = e.target;
    //     setNomineeDetails((prevDetails) => ({
    //         ...prevDetails,
    //         [name]: value,
    //     }));
    // };

    // const handleSaveNomineeDetails = async () => {
    //     setNomineeSaved(true);
    //     handleNomineeModalClose(); // Close the modal
    //     // nominee.firstName = nomineeDetails.firstName;
    //     const data = new FormData();
    //     data.append('firstName', nomineeDetails.firstName);
    //     data.append('lastName', nomineeDetails.lastName);
    //     data.append('address', nomineeDetails.address);
    //     data.append('place', nomineeDetails.place);
    //     data.append('state', nomineeDetails.state);
    //     data.append('nearBy', nomineeDetails.nearBy);
    //     data.append('aadhar', nomineeDetails.aadhar);
    //     data.append('primaryNumber', nomineeDetails.primaryNumber);
    //     data.append('email', nomineeDetails.email);
    //     try {

    //         const customerData = {
    //             info: data,
    //             method: 'post',
    //             path: 'customer/create'
    //         }
    //         let response = await submitDocument(customerData); // Call the API function
    //         alert('Successfully uploaded!');

    //         setNomineeId(response.data._id)
    //         setNominee({
    //             nomineeId: response.data._id,
    //             firstName: nomineeDetails.firstName,

    //         });
    //     } catch (error) {
    //         alert('Failed to upload data. Please try again.');
    //     }
    // };

    // const handleChange = (event, newValue) => {
    //     setValue(newValue);
    // };

    return (
        <Grid container spacing={2}>
            {/* Add or Display Nominee Button */}
            <Grid item xs={12}>
                <Button variant="text" color="Secondary" onClick={handleNomineeModalOpen}>
                    {/* {nominee.nomineeId ? `Nominee: ${nominee.firstName}` : nomineeSaved ? ` Nominee : ${nomineeDetails.firstName}` : 'Add Nominee'} */}
                    {nominee.nomineeId ? `Nominee: ${nominee.firstName}` : 'Add Nominee'}
                </Button>
            </Grid>


            {/* Nominee Details Modal */}
            <Modal open={showNomineeModal} onClose={handleNomineeModalClose} aria-labelledby="nominee-modal-title">
                <Box
                    sx={{
                        p: 4,
                        backgroundColor: 'white',
                        borderRadius: 2,
                        maxWidth: 600,
                        margin: 'auto',
                        mt: '5.5%',
                        maxHeight: '88vh',    // Set maximum height for scrollable area
                        overflowY: 'auto',     // Enable vertical scrolling
                        '::-webkit-scrollbar': { display: 'none' },  // Hide scrollbar in Webkit browsers
                        msOverflowStyle: 'none',  // Hide scrollbar in IE and Edge
                        scrollbarWidth: 'none'    // Hide scrollbar in Firefox
                    }}
                >
                    {/* <Box sx={{ width: '100%', maxHeight: '88vh', }}> */}
                    {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label="Nominee Details" {...a11yProps(0)} />
                                <Tab label="Item Two" {...a11yProps(1)} />
                            </Tabs>
                        </Box> */}
                    {/* <CustomTabPanel value={value} index={0}>

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
                                label="Email"
                                name="email"
                                value={nomineeDetails.email}
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
                                sx={{ mt: 1 }} s
                            />

                            <Button variant="contained" color="primary" onClick={handleSaveNomineeDetails} fullWidth sx={{ mt: 3 }}>
                                Save Nominee Details
                            </Button>

                        </CustomTabPanel> */}

                    {/* <CustomTabPanel value={value} index={1} sx={{ width: '100%', maxHeight: '88vh', }}> */}

                    <NomineeSearch />
                    {/* </CustomTabPanel> */}

                    {/* </Box> */}

                    <Button
                        onClick={handleNomineeModalClose}
                        variant="contained"
                        color="primary"

                    >
                        Submit
                    </Button>
                </Box>
            </Modal>
        </Grid>
    );
};

export default AddNomineeDetails;
