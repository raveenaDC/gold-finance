import React, { useEffect, useMemo, useState } from 'react';
import { Grid, Button, Typography, CircularProgress, Box, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { CustomerForm } from '../../Forms';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constant/route';

export default function GlMaster() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchAddress, setSearchAddress] = useState('');
    const [searchPhone, setSearchPhone] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [pagination, setPagination] = useState({
        activePage: 1,
        total: 0,
        pageLimit: 10,
    });

    const navigate = useNavigate();

    // Define columns for the DataGrid
    const columns = [
        { field: 'id', headerName: 'SL No.', width: 57 },
        { field: 'firstName', headerName: 'First Name', width: 150 },
        { field: 'lastName', headerName: 'Last Name', width: 150 },
        { field: 'address', headerName: 'Address', flex: 8 },
        // { field: 'address', headerName: 'Address', width: 400 },
        { field: 'primaryNumber', headerName: 'Mobile', width: 120 },
        { field: 'email', headerName: 'Email', width: 200 }, // Assuming you have an email field
        {
            field: 'goldLoan',
            headerName: 'Action',
            width: 100,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#FFD700',
                        color: '#000',
                        '&:hover': { backgroundColor: '#FFC107' },
                        width: '100%',
                        fontSize: '8px', // Adjust font size (e.g., 12px or another value you prefer)
                        height: '25px', // Adjust button height (e.g., 35px or another value you prefer)
                        padding: '2px 4px', // Adjust padding to maintain proportion
                    }}
                    onClick={() => handleGoldLoan(params.row.customId)}
                >
                    Gold Loan
                </Button>
            ),
        },

    ];

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, activePage: newPage + 1 })); // `newPage` is 0-indexed
        fetchCustomers(newPage + 1, pagination.pageLimit);
    };

    // Filter customers based on the search term
    // const filteredCustomers = useMemo(() => {
    //     if (!searchTerm) return customers;
    //     return customers.filter(customer => {
    //         const searchQuery = searchTerm.toLowerCase();
    //         return (
    //             customer.firstName.toLowerCase().includes(searchQuery) ||
    //             customer.lastName.toLowerCase().includes(searchQuery) ||
    //             customer.address.toLowerCase().includes(searchQuery) ||
    //             customer.primaryNumber.includes(searchQuery) || // Assuming mobile is in primaryNumber
    //             (customer.email && customer.email.toLowerCase().includes(searchQuery)) // Check for email
    //         );
    //     })
    // }, [searchTerm, customers]);


    const filteredCustomers = useMemo(() => {
        return customers.filter((customer) => {
            const matchesName = searchName
                ? (
                    customer.firstName.toLowerCase().includes(searchName.toLowerCase()) ||
                    customer.lastName.toLowerCase().includes(searchName.toLowerCase())
                )
                : true;
            const matchesAddress = searchAddress
                ? customer.address.toLowerCase().includes(searchAddress.toLowerCase())
                : true;
            const matchesPhone = searchPhone
                ? customer.primaryNumber.includes(searchPhone)
                : true;
            const matchesEmail = searchEmail
                ? customer.email?.toLowerCase().includes(searchEmail.toLowerCase())
                : true;
            return matchesName && matchesAddress && matchesPhone && matchesEmail;
        });
    }, [searchName, searchAddress, searchPhone, searchEmail, customers]);


    // Fetch customer data from the API
    const fetchCustomers = async (page, limit) => {
        try {
            const response = await fetch(`http://localhost:4000/customer/details/view?page=${page}&limit=${limit}`);
            const data = await response.json();
            console.log(data);

            const itemsWithId = data.data.items.map((item, index) => ({
                ...item,
                customId: item._id,
                id: index + 1,
            }));

            setCustomers(itemsWithId);
            setPagination({
                activePage: data.data.pagination.activePage,
                total: data.data.pagination.total,
                pageLimit: data.data.pagination.pageLimit,
            });
            setLoading(false);
        } catch (error) {
            console.error("Error fetching customer data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleGoldLoan = (customerId) => {
        navigate(ROUTES.CUSTOMER_GOLD_LOAN.replace(":customerId", customerId));
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (

        <Box sx={{ padding: { xs: 1, sm: 2, md: 3 } }}>
            <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                {/* <ItemDetailsTable /> */}
                {/* Typography for Customer List Heading */}
                <Typography
                    variant="h4"
                    sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, flexShrink: 0 }}
                >
                    CUSTOMER LIST
                </Typography>

                {/* Search Bar */}
                <Box sx={{ flexGrow: 1, mx: 2, textAlign: 'center' }}>
                    <TextField
                        variant="outlined"
                        placeholder="Search by Name"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        fullWidth
                        sx={{
                            maxWidth: '600px', // Limit the max width
                            width: '100%', // Ensure it takes up the available space
                        }}
                        InputProps={{
                            sx: {
                                padding: '0', // Reduce padding inside the input
                                height: '36px', // Set the desired height
                            },
                        }}
                    />
                </Box>{/* Search Bar */}
                <Box sx={{ flexGrow: 1, mx: 2, textAlign: 'left' }}>
                    <TextField
                        variant="outlined"
                        placeholder="Search by Address"
                        value={searchAddress}
                        onChange={(e) => setSearchAddress(e.target.value)}
                        fullWidth
                        sx={{
                            maxWidth: '600px', // Limit the max width
                            width: '100%', // Ensure it takes up the available space
                        }}
                        InputProps={{
                            sx: {
                                padding: '0', // Reduce padding inside the input
                                height: '36px', // Set the desired height
                            },
                        }}
                    />
                </Box>
                <Box sx={{ flexGrow: 1, mx: 2, textAlign: 'left' }}>
                    <TextField
                        variant="outlined"
                        placeholder="Search by Phone"
                        value={searchPhone}
                        onChange={(e) => setSearchPhone(e.target.value)}
                        fullWidth
                        sx={{
                            maxWidth: '600px', // Limit the max width
                            width: '100%', // Ensure it takes up the available space
                        }}
                        InputProps={{
                            sx: {
                                padding: '0', // Reduce padding inside the input
                                height: '36px', // Set the desired height
                            },
                        }}
                    />
                </Box>

                {/* Add Customer Button */}
                <Box sx={{ mt: { xs: 1, sm: 0 }, flexShrink: 0 }}>
                    <CustomerForm onCustomerAdded={fetchCustomers} />
                </Box>
            </Grid>


            {/* <Box sx={{ height: 100, width: 100, border: "1px solid black", backgroundColor: "primary.main" }} /> */}

            <Box
                sx={{
                    height: 480,
                    width: '100%',
                    '& .MuiDataGrid-root': {
                        backgroundColor: 'white',
                    },
                }}
            >
                <DataGrid
                    rows={customers}
                    columns={columns}
                    pageSize={pagination.pageLimit}
                    rowCount={pagination.total}
                    pagination
                    paginationMode="server"
                    onPageChange={handlePageChange}
                    checkboxSelection={false}
                    getRowId={(row) => row.id}
                    loading={loading}
                    sx={{
                        '& .MuiDataGrid-cell': {
                            fontSize: { xs: '0.8rem', sm: '0.8rem' }, // Font size for different screen sizes
                            padding: '-5px 4px', // Reduce padding to reduce cell height

                        },
                        '& .MuiDataGrid-columnHeaders': { fontSize: { xs: '0.6rem', sm: '.8rem' } },
                    }}
                    rowHeight={30}
                />
            </Box>
        </Box>
    );
}