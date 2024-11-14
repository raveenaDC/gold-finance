import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, CircularProgress, Button } from '@mui/material';

import { useNominee } from './NomineeContext';

// import axios from 'axios';

function NomineeSearch() {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState(null); // State to store selected option


    // Use the setNominee function from context
    const { setNominee } = useNominee();





    // Fetch data from the API
    // useEffect(() => {
    //     if (searchTerm === '') return;

    //     const fetchData = async () => {
    //         setLoading(true);
    //         try {
    //             console.log("look at here............/////////////////");

    //             const response = await fetch('http://localhost:4000/customer/details/view');
    //             const data = await response.json();
    //             console.log(data);

    //             // const response = await fetch.get(`/your-api-endpoint?search=${searchTerm}`);
    //             setOptions(response.data); // Assuming response data is an array of options
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, [searchTerm]);

    const fetchCustomers = async () => {
        try {
            const response = await fetch('http://localhost:4000/customer/details/view');
            const data = await response.json();
            console.log(data.data.items);

            // Map data to add unique `id` if not present
            setOptions(data.data.items);

        } catch (error) {
            console.error("Error fetching customer data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleOkClick = () => {
        if (selectedOption) {
            setNominee({
                nomineeId: selectedOption._id,
                firstName: selectedOption.firstName,
                lastName: selectedOption.lastName,
            });


            console.log('Selected _id:', selectedOption._id); // Use the _id as needed
            // You can also trigger other actions here with selectedOption._id

        } else {
            console.log('No option selected');
        }
    };



    return (
        <div> <h1>hii</h1>
            <Autocomplete
                options={options}
                loading={loading}
                onChange={(event, newValue) => setSelectedOption(newValue)} // Set selected option
                onInputChange={(event, newValue) => setSearchTerm(newValue)}
                getOptionLabel={(option) => option.firstName + ' ' + option.lastName || ''} // Adjust as needed
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search"
                        variant="outlined"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}


            />



            <Button
                variant="contained"
                onClick={handleOkClick} // Trigger handleOkClick on click
                sx={{
                    backgroundColor: '#FFD700',
                    color: '#000',
                    '&:hover': { backgroundColor: '#FFC107' },
                    width: '100%',
                    fontSize: '8px',
                    height: '30px',
                    padding: '2px 2px',
                }}
            >
                OK
            </Button>
        </div>

    );
}

export default NomineeSearch;
