import React, { useState, useEffect } from 'react';
import { TextField, List, ListItem, ListItemText, CircularProgress, Box } from '@mui/material';
import { useNominee } from '../../configure/NomineeContext';

function NomineeSearch({ onClose }) {
    const [nominees, setNominees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [nameSearch, setNameSearch] = useState('');
    const [addressSearch, setAddressSearch] = useState('');
    const [phoneSearch, setPhoneSearch] = useState('');
    const { setNominee } = useNominee();

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

        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 1 }}>

            {/* Left Column: Search Fields */}
            <Box sx={{ width: '40%', }}>
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
            <Box sx={{ width: '60%', maxHeight: '270px', overflow: 'auto' }}>
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
                                    primary={`${nominee.firstName} ${nominee.lastName}`}
                                    secondary={`Address: ${nominee.address}, Phone: ${nominee.primaryNumber}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>
        </Box>

    );
}

export default NomineeSearch;
