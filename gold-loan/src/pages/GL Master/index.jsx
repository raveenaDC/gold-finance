import React, { useEffect, useState } from 'react';
import { Grid, Button, Typography, CircularProgress, Box, TextField } from '@mui/material';
import { CustomerForm } from '../../Forms';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constant/route';

export default function GlMaster() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useState({
        address: '',
        phone: '',
        search: '',
    });

    const navigate = useNavigate();

    // Fetch customer data from the API with search parameters
    const fetchCustomers = async () => {
        try {
            const { address, phone, search } = searchParams;
            const query = new URLSearchParams({
                address,
                phone,
                search,
            }).toString();

            const response = await fetch(`http://localhost:4000/customer/details/view?${query}`);
            const data = await response.json();
            console.log("view customers", data);

            const itemsWithId = data.data.items.map((item, index) => ({
                ...item,
                customId: item._id,
                id: index + 1,
            }));

            setCustomers(itemsWithId);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching customer data:", error);
            setLoading(false);
        }
    };

    // Update search parameters on input change
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Trigger search when any input changes
    useEffect(() => {
        fetchCustomers();
    }, [searchParams]);

    const handleGoldLoan = (customerId) => {
        navigate(ROUTES.CUSTOMER_GOLD_LOAN.replace(":customerId", customerId));
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{ padding: { xs: 1, sm: 2, md: 3 }, mt: -4 }}>
            {/* <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}> */}
            {/* Typography for Customer List Heading */}
            {/* <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, flexShrink: 0 }}>
                    CUSTOMER LIST
                </Typography> */}

            {/* Add Customer Button */}
            {/* <Box sx={{ mt: { xs: 1, sm: 0 }, flexShrink: 0 }}>
                    <CustomerForm onCustomerAdded={fetchCustomers} />
                </Box> */}
            {/* </Grid> */}

            <h5 style={{
                color: '#B8860B',
                fontSize: '18px',
                marginBottom: '20px',
                fontWeight: '600',
                textAlign: 'center', // Centers the text
            }}>
                CUSTOMER LIST
            </h5>

            {/* Search Filters */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={2}>
                    <TextField
                        fullWidth
                        label="Search by First Name"
                        variant="outlined"
                        name="search"
                        value={searchParams.search}
                        onChange={handleSearchChange}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '5px', // Rounded corners
                                backgroundColor: '#f5f5f5', // Light grey background
                                '& fieldset': {
                                    borderColor: '#B8860B', // Dark gold border
                                },
                                '&:hover fieldset': {
                                    borderColor: '#FFD700', // Gold border on hover
                                },
                            },
                            '& .MuiInputBase-input': {
                                fontSize: '0.875rem', // Smaller text
                                padding: '10px', // Adjust padding for better spacing
                            },
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={2}>
                    <TextField
                        fullWidth
                        label="Search by Last Name"
                        variant="outlined"
                        name="search"
                        value={searchParams.search}
                        onChange={handleSearchChange}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '5px', // Rounded corners
                                backgroundColor: '#f5f5f5', // Light grey background
                                '& fieldset': {
                                    borderColor: '#B8860B', // Dark gold border
                                },
                                '&:hover fieldset': {
                                    borderColor: '#FFD700', // Gold border on hover
                                },
                            },
                            '& .MuiInputBase-input': {
                                fontSize: '0.875rem', // Smaller text
                                padding: '10px', // Adjust padding for better spacing
                            },
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={2}>
                    <TextField
                        fullWidth
                        label="Search by Address"
                        variant="outlined"
                        name="address"
                        value={searchParams.address}
                        onChange={handleSearchChange}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '5px', // Rounded corners
                                backgroundColor: '#f5f5f5', // Light grey background
                                '& fieldset': {
                                    borderColor: '#B8860B', // Dark gold border
                                },
                                '&:hover fieldset': {
                                    borderColor: '#FFD700', // Gold border on hover
                                },
                            },
                            '& .MuiInputBase-input': {
                                fontSize: '0.875rem', // Smaller text
                                padding: '10px', // Adjust padding for better spacing
                            },
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <TextField
                        fullWidth
                        label="Search by Location"
                        variant="outlined"
                        name="Location"
                        value={searchParams.address}
                        onChange={handleSearchChange}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '5px', // Rounded corners
                                backgroundColor: '#f5f5f5', // Light grey background
                                '& fieldset': {
                                    borderColor: '#B8860B', // Dark gold border
                                },
                                '&:hover fieldset': {
                                    borderColor: '#FFD700', // Gold border on hover
                                },
                            },
                            '& .MuiInputBase-input': {
                                fontSize: '0.875rem', // Smaller text
                                padding: '10px', // Adjust padding for better spacing
                            },
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <TextField
                        fullWidth
                        label="Search by Phone"
                        variant="outlined"
                        name="phone"
                        value={searchParams.phone}
                        onChange={handleSearchChange}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '5px', // Rounded corners
                                backgroundColor: '#f5f5f5', // Light grey background
                                '& fieldset': {
                                    borderColor: '#B8860B', // Dark gold border
                                },
                                '&:hover fieldset': {
                                    borderColor: '#FFD700', // Gold border on hover
                                },
                            },
                            '& .MuiInputBase-input': {
                                fontSize: '0.875rem', // Smaller text
                                padding: '10px', // Adjust padding for better spacing
                            },
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <CustomerForm onCustomerAdded={fetchCustomers} />
                </Grid>

            </Grid>


            {/* Display Customer List */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mt: 2 }}>
                {customers.map((customer, index) => (
                    <Box
                        key={customer.id}
                        sx={{
                            width: '300px',
                            p: 2,
                            border: '1px solid #FFD700', // Golden border
                            borderRadius: '8px',
                            backgroundColor: '#F9F9F9', // Dark grey background
                            color: '#00000', // White text
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
                            position: 'relative', // To position the image inside the box
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                            },
                            '&:hover .image': {
                                opacity: 1, // Show the image when the box is hovered
                            },
                        }}
                    >
                        {/* Image Section */}
                        <Box
                            className="image"
                            sx={{
                                position: 'absolute',
                                top: '10px',
                                right: '12px',
                                width: '80px',
                                height: '80px',
                                opacity: 1, // Initially hidden
                                transition: 'opacity 0.3s ease',
                                borderRadius: '50%',
                                overflow: 'hidden',
                            }}
                        >
                            <img
                                src={customer?.image?.path ? `http://localhost:4000${customer.image.path}` : 'https://via.placeholder.com/120'}
                                alt={`${customer.firstName} ${customer.lastName}`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover', // Ensures the image maintains a good aspect ratio
                                }}
                            />
                        </Box>

                        <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                            Cust No : {index + 1}
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '45px auto', gap: 1, mb: 2 }}>
                            <Typography variant="body1" sx={{ fontSize: '12px' }}>Name</Typography>
                            <Typography variant="body1" sx={{ fontSize: '12px' }}>: {customer.firstName} {customer.lastName}</Typography>

                            <Typography variant="body1" sx={{ fontSize: '12px' }}>Address</Typography>
                            <Typography variant="body1" sx={{ fontSize: '12px' }}>: {customer.address}</Typography>

                            <Typography variant="body1" sx={{ fontSize: '12px' }}>Location</Typography>
                            <Typography variant="body1" sx={{ fontSize: '12px' }}>: {customer.nearBy},{customer.city}</Typography>

                            <Typography variant="body1" sx={{ fontSize: '12px' }}>Mobile</Typography>
                            <Typography variant="body1" sx={{ fontSize: '12px' }}>: {customer.primaryNumber},{customer.secondaryNumber}</Typography>

                            <Typography variant="body1" sx={{ fontSize: '12px' }}>Email</Typography>
                            <Typography variant="body1" sx={{ fontSize: '12px' }}>: {customer.email}</Typography>


                        </Box>


                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#2C3E50', // Navy Blue: Professional and elegant
                                color: '#FFFFFF', // White text for high contrast
                                '&:hover': { backgroundColor: '#34495E' }, // Slightly lighter navy blue for hover
                                fontSize: '12px',
                                width: '100%',
                                fontWeight: 'bold',
                                borderRadius: '6px', // Subtle rounded edges
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
                            }}
                            onClick={() => handleGoldLoan(customer.customId)}
                        >
                            Gold Loan
                        </Button>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
