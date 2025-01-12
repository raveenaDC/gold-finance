import React, { useState, useEffect } from 'react';
import { TextField, List, ListItem, ListItemText, CircularProgress, Box, Button, Modal } from '@mui/material';
import { useNominee } from '../../configure/NomineeContext';

function NomineeSearch({ onClose }) {
    const [nominees, setNominees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [nameSearch, setNameSearch] = useState('');
    const [addressSearch, setAddressSearch] = useState('');
    const [phoneSearch, setPhoneSearch] = useState('');
    const { setNominee } = useNominee();

    const [showNomineeModal, setShowNomineeModal] = useState(false);
    const { nominee } = useNominee();

    const handleNomineeModalOpen = () => setShowNomineeModal(true);
    const handleNomineeModalClose = () => setShowNomineeModal(false);

    useEffect(() => {
        const fetchNominees = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:4000/customer/details/view');
                const data = await response.json();
                setNominees(data.data.items);
            } catch (error) {
                console.error('Error fetching nominees:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNominees();
    }, []);

    const filterNominees = () => {
        return nominees.filter((nominee) => {
            const fullName = `${nominee.firstName ?? ''} ${nominee.lastName ?? ''}`.toLowerCase();
            const address = nominee.address?.toLowerCase() ?? '';
            const phone = nominee.primaryNumber ?? '';

            return (
                fullName.includes(nameSearch.toLowerCase()) &&
                address.includes(addressSearch.toLowerCase()) &&
                phone.includes(phoneSearch)
            );
        });
    };

    const handleNomineeSelect = (nominee) => {
        setNominee({
            nomineeId: nominee._id,
            firstName: nominee.firstName,
            lastName: nominee.lastName,
        });
        console.log('Selected Nominee ID:', nominee._id);
        if (onClose) {
            onClose();
        }
    };

    return (
        <>
            <Button variant="text" color="Secondary" onClick={handleNomineeModalOpen}>
                {/* {nominee.nomineeId ? `Nominee: ${nominee.firstName}` : nomineeSaved ? ` Nominee : ${nomineeDetails.firstName}` : 'Add Nominee'} */}
                {nominee.nomineeId ? `Nominee: ${nominee.firstName}` : 'Add Nominee'}

            </Button>

            <Modal open={showNomineeModal} onClose={handleNomineeModalClose} aria-labelledby="nominee-modal-title">
                <Box sx={{
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
                    scrollbarWidth: 'none',    // Hide scrollbar in Firefox
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                }}>
                    <h5 style={{
                        color: '#B8860B',
                        fontSize: '18px',
                        marginBottom: '20px',
                        fontWeight: '600',
                        textAlign: 'center', // Centers the text
                    }}>
                        Nominee Search
                    </h5>

                    {/* Left Column: Search Fields */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            label="Full Name"
                            variant="outlined"
                            value={nameSearch}
                            onChange={(e) => setNameSearch(e.target.value)}
                            fullWidth
                            size='small'
                            margin="dense"
                        />
                        <TextField
                            label="Address"
                            variant="outlined"
                            value={addressSearch}
                            onChange={(e) => setAddressSearch(e.target.value)}
                            fullWidth
                            size='small'
                            margin="dense"
                        />
                        <TextField
                            label="Phone Number"
                            variant="outlined"
                            value={phoneSearch}
                            onChange={(e) => setPhoneSearch(e.target.value)}
                            fullWidth
                            size='small'
                            margin="dense"
                        />
                    </Box>

                    {/* Right Column: Results List */}
                    <Box sx={{ maxHeight: '270px', display: 'flex', flexDirection: 'row', overflow: 'auto' }}>
                        {loading ? (
                            <CircularProgress />
                        ) : (
                            <List>
                                {filterNominees().map((nominee) => (
                                    <ListItem
                                        button
                                        key={nominee._id}
                                        onClick={() => handleNomineeSelect(nominee)}
                                    >
                                        <ListItemText
                                            primary={
                                                <span>{`${nominee.firstName} ${nominee.lastName}`}</span>
                                            }
                                            secondary={
                                                <span>{`Address: ${nominee.address}, Phone: ${nominee.primaryNumber}`}</span>
                                            }
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Box>

                    <Button
                        onClick={handleNomineeModalClose}
                        variant="contained"
                        color="primary"
                        textAlign='center'// Centers the text

                    >
                        Submit
                    </Button>

                </Box>
            </Modal>
        </>

    );
}

export default NomineeSearch;
