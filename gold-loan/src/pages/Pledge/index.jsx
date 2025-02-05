import React, { useState, useEffect } from 'react';
import {
    Box, Button, TextField, MenuItem, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton, Grid, Autocomplete, Typography, FormControlLabel, Switch,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import BankDetailsModal from '../../components/BankSchemes';
import SearchModal from '../../components/Pledge details';
import { getgolditemdetails } from '../../services/goldItems/goldItems.service';
import SaveIcon from '@mui/icons-material/Save'; // Import the Save icon
import AddIcon from '@mui/icons-material/Add';
import StaffDesignation from '../../components/Add Member Role';
import { submitData } from "../../api";
import { getBankName } from '../../services/pledge/pledge.service'

const PledgeMasterPage = () => {
    const [pledges, setPledges] = useState([]);
    const [formData, setFormData] = useState({
        pledgeNumber: '',
        bankPledgeNumber: '',
        bankName: '',
        pledgeDate: '',
        bankId: '',
        principalAmount: '',
        interestRate: '',
        dueDate: '',
        itemDetails: '',
        otherCharges: '',
        remarks: '',
    });
    const today = new Date().toISOString().split('T')[0];
    const [glOptions, setGlOptions] = useState([]); // GL number dropdown options
    const [paymentMode, setPaymentMode] = useState('Cash');
    const [options, setOptions] = useState([]);
    const [goldNumber, setGoldNumber] = useState([]);
    const [glNumber, setGlNumber] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [items, setItems] = useState([]);
    const [bankOptions, setBankOptions] = useState([]);

    const [newItem, setNewItems] = useState({
        id: 1,
        type: 'Select',
        quantity: '',
        grossWeight: '',
        stoneWeight: '',
        depreciation: '',
        netWeight: '', // User input for net weight
    });

    const totalNetWeight = items.reduce((total, item) => total + (parseFloat(item.netWeight) || 0), 0);
    const totalGrossWeight = items.reduce((total, item) => total + (parseFloat(item.grossWeight) || 0), 0);
    const totalStoneWeight = items.reduce((total, item) => total + (parseFloat(item.stoneWeight) || 0), 0);
    const totalDepWeight = items.reduce((total, item) => total + (parseFloat(item.depreciation) || 0), 0);
    const totalQuantity = items.reduce((total, item) => total + (parseFloat(item.quantity) || 0), 0);

    const calculateNetWeight = (quantity, grossWeight, stoneWeight, depreciation) => {

        const grossWt = parseFloat(grossWeight) || 0;
        const stoneWt = parseFloat(stoneWeight) || 0;
        const depWt = parseFloat(depreciation) || 0;
        const netWeight = grossWt - (stoneWt + depWt);
        return netWeight
    };

    const glNumberOptions = [];



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    // Add a new row to the table
    const handleAddRow = () => {
        if (newItem.netWeight !== "") {
            setItems((prevItems) => [
                ...prevItems,
                { ...newItem, id: prevItems.length + 1 }
            ]);
            // Reset newItem to its initial state
            setNewItems({
                id: newItem.id + 1, // Increment ID for the next item
                type: 'Select',
                quantity: '',
                grossWeight: '',
                stoneWeight: '',
                depreciation: '',
                netWeight: '',
            });
        }
    };

    // const handleGlNumberChange = (event, newValue) => {
    //     if (newValue) {
    //         setGoldNumber(newValue.glNo); // Set selected GL number
    //         setGlNumber(newValue._id);
    //         // console.log("hiiiiiiiii");

    //         // console.log("nothing", newValue.customerId);
    //         // console.log(("idghg", newValue._id));
    //         // console.log("nothing", newValue.glNo);
    //     } else {
    //         setGoldNumber('');
    //     }
    // }

    const handleChange = (field, value, type, goldItemId) => {
        setNewItems((prevState) => {
            const updatedItem = {
                ...prevState,
                [field]: value,
            };

            // Assign goldItem ID if provided
            if (goldItemId) {
                updatedItem.goldItem = goldItemId;
            }

            // Calculate netWeight if relevant fields are updated
            if (["quantity", "grossWeight", "stoneWeight", "depreciation"].includes(field)) {
                updatedItem.netWeight = calculateNetWeight(
                    updatedItem.quantity || 0,
                    updatedItem.grossWeight || 0,
                    updatedItem.stoneWeight || 0,
                    updatedItem.depreciation || 0
                );
            }

            // Handle type for dropdown selections (goldItem)
            if (field === "goldItem" && value) {
                updatedItem.type = options.find((option) => option._id === value)?.goldItem || "Select";
            }

            return updatedItem;
        });
    };

    const handleChangeItem = (id, gId, field, value) => {
        setItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === id) {
                    const updatedItem = {
                        ...item,
                        [field]: value,
                    };
                    if (gId) {
                        updatedItem.goldItem = gId;
                        updatedItem.type = options.find((option) => option._id === gId)?.goldItem || item.type;
                    }
                    // Recalculate net weight if applicable
                    if (["quantity", "grossWeight", "stoneWeight", "depreciation"].includes(field)) {
                        updatedItem.netWeight = calculateNetWeight(
                            updatedItem.quantity,
                            updatedItem.grossWeight,
                            updatedItem.stoneWeight,
                            updatedItem.depreciation
                        );
                    }
                    return updatedItem;
                }
                return item;
            })
        );
    };

    // Handle changes when editing a row
    const handleChangeInRow = (id, field, value) => {
        const updatedItems = items.map((item) => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value }; // Update the specific field

                // Recalculate netWeight if relevant fields are updated
                if (["quantity", "grossWeight", "stoneWeight", "depreciation"].includes(field)) {
                    updatedItem.netWeight = calculateNetWeight(
                        updatedItem.quantity || 0,
                        updatedItem.grossWeight || 0,
                        updatedItem.stoneWeight || 0,
                        updatedItem.depreciation || 0
                    );
                }

                return updatedItem;
            }
            return item;
        });
        setItems(updatedItems);
    };


    // Toggle edit mode for a specific row
    const toggleEditMode = (id) => {
        const updatedItems = items.map((item) => {
            if (item.id === id) {
                return { ...item, isEditing: !item.isEditing };
            }
            return item;
        });
        setItems(updatedItems);
    };

    // Handle deleting a row
    const handleDelete = (id) => {
        const updatedItems = items.filter((item) => item.id !== id);
        setItems(updatedItems);
    };

    // Handle saving the changes after editing
    const handleSaveRow = (id) => {
        toggleEditMode(id); // Save changes and toggle back to view mode
    };

    const handleSwitchChange = (event) => {
        const newMode = event.target.checked ? 'Credit' : 'Cash';
        setPaymentMode(newMode);
        console.log('Payment Mode:', newMode); // Log the new payment mode
    };

    const fetchGoldItems = async () => {
        setLoading(true); // Set loading to true before fetching
        try {
            const response = await getgolditemdetails();
            if (response?.isSuccess && response?.items) {
                setOptions(response.items);
            } else {
                console.error("Failed to fetch gold items:", response);
            }
        } catch (error) {
            console.error("Error fetching customer data:", error);
        } finally {
            setLoading(false); // Ensure loading is stopped in both success & error cases
        }
    };


    const fetchGoldNoData = async () => {
        try {
            const response = await fetch(
                `http://localhost:4000/customer/gold/loan/number/view?search=${goldNumber}`
            );
            const data = await response.json();
            setGlOptions(data.data.loanDetails || []); // Populate dropdown options
        } catch (error) {
            console.error('Error fetching customer data:', error);
        }
    };

    const fetchBankDetails = async () => {
        try {
            const response = await getBankName();
            console.log("testbanking", response.result.data);


            if (response?.isSuccess && Array.isArray(response.result.data)) {
                setBankOptions(response.result.data); // Ensure it's an array
            }
        } catch (error) {
            console.error('Error fetching bank details:', error);
        }
    };


    useEffect(() => {
        fetchGoldItems();
        fetchGoldNoData();
        fetchBankDetails();

    }, []);

    useEffect(() => {
        // Simulate fetching or setting table data
        setTableData([
            { column1: 'Data 1', column2: 'Data 2' },
            { column1: 'Data 3', column2: 'Data 4' },
            { column1: 'Data 5', column2: 'Data 6' }
        ]);
    }, []);




    const handleSubmit = async (e) => {
        e.preventDefault();

        // // Validate form data
        // if (!formData.pledgeNumber || !formData.principalAmount || items.length === 0) {
        //     alert("Please fill in all required fields and add at least one item.");
        //     return;
        // }

        // Prepare the data in the required format
        const data = {
            pledgeNumber: formData.pledgeNumber,
            pledgeDate: formData.pledgeDate || today, // Default to today if not provided
            bankPledgeNumber: formData.bankPledgeNumber,
            bankId: formData.bankId, // Assuming bankName is the bankId
            interestRate: parseFloat(formData.interestRate) || 0,
            otherCharges: parseFloat(formData.otherCharges) || 0,
            dueDate: formData.dueDate,
            principleAmount: parseFloat(formData.principalAmount) || 0,
            glNumber: glNumber, // Assuming glNumber is already an array of IDs
            paymentMode: paymentMode.toLowerCase(), // Ensure it's in lowercase
            itemDetails: items.map(item => ({
                stoneWeight: parseFloat(item.stoneWeight) || 0,
                depreciation: parseFloat(item.depreciation) || 0,
                quantity: parseFloat(item.quantity) || 0,
                grossWeight: parseFloat(item.grossWeight) || 0,
                netWeight: parseFloat(item.netWeight) || 0,
                goldItem: item.goldItem // Assuming goldItem is the ID
            }))
        };

        // Log the data to verify its structure
        console.log("Submitting data:", data);

        const customerData = {
            info: data,
            method: 'post',
            path: 'pledge/add/pledge-details',
        };

        try {
            const response = await submitData(customerData); // Assuming submitData is defined elsewhere
            console.log("API Response:", response);

            if (response && response.isSuccess) {
                alert("Pledge submitted successfully!");
                resetForm();
                setItems([]); // Clear the items table
            } else {
                throw new Error(response?.message || "Failed to submit pledge.");
            }
        } catch (error) {
            console.error('Error submitting data:', error);
            alert(error.message || 'Failed to submit the data. Please try again.');
        }
    };

    const resetForm = () => {
        setFormData({
            pledgeNumber: '',
            bankPledgeNumber: '',
            bankName: '',
            pledgeDate: '',
            glNumber: '',
            principalAmount: '',
            interestRate: '',
            dueDate: '',
            itemDetails: '',
            otherCharges: '',
            remarks: '',
        });
    };

    return (
        <Box sx={{ padding: '16px' }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                    <Paper elevation={3} sx={{ padding: 2, mb: 3 }}>
                        <Box component="form" onSubmit={handleSubmit}>

                            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>

                                <Box display="flex" alignItems="center" gap={1} >
                                    <Typography variant="body2" fontWeight="bold">
                                        Pledge No:
                                    </Typography>

                                </Box>

                                {/* Gold Loan Details */}

                                <h5 style={{
                                    color: '#B8860B',
                                    fontSize: '18px',
                                    marginBottom: '20px',
                                    fontWeight: '600',
                                    textAlign: 'center', // Centers the text
                                }}>
                                    PLEDGE MASTER
                                </h5>


                                {/* Date */}
                                <Box display="flex" alignItems="center" gap={1}>


                                    <TextField
                                        type="date"
                                        size="small"
                                        label="PLEDGE DATE"
                                        value={formData.pledgeDate ? formData.pledgeDate.split('T')[0] : today} // Defaults to today
                                        sx={{
                                            '& .MuiInputLabel-root': {
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                            },
                                            '& .MuiInputBase-root': {
                                                fontSize: '14px',
                                                height: '36px',
                                            }
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />



                                </Box>
                            </Box>

                            <Grid container spacing={2}>
                                {['pledgeNumber', 'bankName', 'principalAmount', 'interestRate', 'otherCharges', 'dueDate'].map((field, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        {field === 'bankName' ? (
                                            <Autocomplete
                                                fullWidth
                                                options={bankOptions || []} // Ensure it's always an array
                                                getOptionLabel={(option) => option.bankName || ''} // Display bank name safely
                                                value={bankOptions?.find(opt => opt._id === formData.bankId) || null} // Match selected bank by ID
                                                onChange={(event, newValue) => {
                                                    setFormData((prevData) => ({
                                                        ...prevData,
                                                        bankId: newValue ? newValue._id : '', // Save selected bank's ID
                                                    }));
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Bank Name"
                                                        size="small"
                                                        InputLabelProps={{ style: { fontSize: '14px', fontWeight: 'bold' } }}
                                                        sx={{ '& .MuiInputBase-root': { fontSize: '14px' } }}
                                                    />
                                                )}
                                            />


                                        ) : (
                                            <TextField
                                                fullWidth
                                                label={field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                                                name={field}
                                                value={formData[field]}
                                                onChange={handleInputChange}
                                                size="small"
                                                type={field === 'dueDate' ? 'date' : 'text'}
                                                InputLabelProps={field === 'dueDate' ? { shrink: true } : {}}
                                                sx={{
                                                    '& .MuiInputLabel-root': { fontSize: '14px', fontWeight: 'bold' },
                                                    '& .MuiInputBase-root': { fontSize: '14px' }
                                                }}
                                            />
                                        )}
                                    </Grid>
                                ))}



                                <Grid item xs={12} sm={8} md={8}>
                                    <TextField
                                        fullWidth
                                        label="Remarks"
                                        name="remarks"
                                        value={formData.remarks}
                                        onChange={handleInputChange}
                                        size="small"
                                        multiline
                                        rows={2}  // Sets the number of visible rows to 2
                                        sx={{
                                            '& .MuiInputLabel-root': { fontSize: '14px', fontWeight: 'bold' },
                                            '& .MuiInputBase-root': { fontSize: '14px' }
                                        }}
                                    />
                                </Grid>

                            </Grid>
                        </Box>
                        <Grid item xs={12}  >
                            <TableContainer sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: '8px 8px 0px 0px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', mt: 2 }}>
                                {tableData.length === 0 ? (
                                    <p style={{ fontSize: '14px', color: '#757575', padding: '16px', }}>No data available</p>
                                ) : (
                                    <Table stickyHeader aria-label="sticky table" >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell colSpan={7} sx={{ padding: '8px', borderBottom: '2px solid #ddd', backgroundColor: '#fffff' }}>
                                                    <Autocomplete
                                                        multiple
                                                        options={glOptions}
                                                        getOptionLabel={(option) => option.glNo || "Select"}
                                                        onChange={(event, newValue) => {
                                                            setGoldNumber(newValue.map(option => option.glNo));
                                                            setGlNumber(newValue.map(option => option._id));
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="GL Number"
                                                                name="glNumber"
                                                                size="small"
                                                                fullWidth
                                                                sx={{
                                                                    '& .MuiInputLabel-root': { fontSize: '10px', fontWeight: 500 },
                                                                    '& .MuiInputBase-root': { fontSize: '10px', height: '30px' },
                                                                    '& .MuiOutlinedInput-root': { padding: '0 6px' },
                                                                    '& .MuiOutlinedInput-input': { padding: '6px 8px' }
                                                                }}
                                                            />
                                                        )}
                                                        value={glOptions.filter(option => glNumber.includes(option._id)) || []} // Ensure multiple selection works
                                                        sx={{ width: '400px' }}
                                                    />

                                                    <Box sx={{
                                                        textAlign: 'right',
                                                        mt: -4,

                                                    }}
                                                    >
                                                        <FormControlLabel
                                                            sx={{
                                                                width: '80px',  // Added quotes for consistency
                                                                height: '30px', // Added quotes for consistency
                                                                marginRight: '18px',  // Corrected to camelCase
                                                                marginLeft: '0px',     // Corrected to camelCase
                                                                paddingTop: '15px',
                                                                paddingBottom: '15px'

                                                            }}
                                                            control={
                                                                < Switch

                                                                    checked={paymentMode === 'Credit'
                                                                    }
                                                                    onChange={handleSwitchChange}
                                                                    color="primary"
                                                                />
                                                            }
                                                            label={paymentMode === 'Credit' ? 'Credit' : 'Cash'}
                                                        />
                                                    </Box>

                                                </TableCell>


                                            </TableRow>
                                            <TableRow>
                                                {['Item Details', 'No', 'Gross Wt', 'Stone Wt', 'Dep Wt', 'Net Wt', 'Actions'].map((header) => (
                                                    <TableCell key={header} sx={{ fontSize: '12px', backgroundColor: '#f0f0f0', padding: '4px', borderBottom: '1px solid #ccc' }}>
                                                        {header}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {/* New Item Input Row */}
                                            <TableRow sx={{
                                                height: '10px', // Adjust row height 
                                            }}>
                                                < TableCell sx={{ fontSize: '6px', padding: '1px', borderBottom: '1px solid #ccc' }}>

                                                    <Autocomplete
                                                        options={options}
                                                        getOptionLabel={(option) => option.goldItem || "Select"}
                                                        onChange={(event, newValue) => {
                                                            const goldItemId = newValue?._id || "";
                                                            const goldItemLabel = newValue?.goldItem || "Select";
                                                            handleChange("goldItem", goldItemId, "goldItem", goldItemId);
                                                            handleChange("type", goldItemLabel, "goldItem", goldItemId);
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                variant="outlined"
                                                                size="small"
                                                                placeholder="Select Gold Item"
                                                            />
                                                        )}
                                                        sx={{
                                                            '& .MuiAutocomplete-inputRoot': {
                                                                fontSize: '0.675rem',
                                                                height: 20,
                                                            },
                                                            '& .MuiInputBase-input': {
                                                                padding: '1px 1px',
                                                            },
                                                            width: 130,

                                                        }}
                                                    />

                                                </TableCell>



                                                {['quantity', 'grossWeight', 'stoneWeight', 'depreciation'].map((field) => (
                                                    <TableCell key={field} sx={{ fontSize: '8px', padding: '4px', borderBottom: '1px solid #ccc' }}>
                                                        <TextField
                                                            value={newItem[field] || ""}
                                                            onChange={(e) =>
                                                                handleChange(field, e.target.value, "goldItem", newItem.goldItem || "")
                                                            }
                                                            variant="outlined"
                                                            size="small"
                                                            fullWidth
                                                            sx={{
                                                                fontSize: '0.875rem',
                                                                '& .MuiOutlinedInput-root': {
                                                                    height: '20px',
                                                                    fontSize: '0.875rem',
                                                                },
                                                                '& .MuiInputBase-input': {
                                                                    padding: '1px 1px',
                                                                },
                                                            }}
                                                        />
                                                    </TableCell>
                                                ))}

                                                <TableCell sx={{ fontSize: '8px', padding: '4px', borderBottom: '1px solid #ccc' }}>
                                                    <TextField
                                                        value={newItem.netWeight || ""}
                                                        onChange={(e) =>
                                                            handleChange('netWeight', e.target.value, "goldItem", newItem.goldItem || "")
                                                        }
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        sx={{
                                                            fontSize: '0.875rem',
                                                            '& .MuiOutlinedInput-root': {
                                                                height: '20px',
                                                                fontSize: '0.875rem',
                                                            },
                                                            '& .MuiInputBase-input': {
                                                                padding: '1px 1px',
                                                            },
                                                        }}
                                                    />
                                                </TableCell>

                                                <TableCell sx={{ padding: '4px' }}>
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={handleAddRow}
                                                    >
                                                        <AddIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>

                                            </TableRow>

                                            {/* Displaying Items */}
                                            {items.map((item) => (
                                                <TableRow
                                                    key={item.id}
                                                    onDoubleClick={() => toggleEditMode(item.id)}
                                                    sx={{


                                                        height: '10px', // Adjust row height
                                                        '&:hover': { backgroundColor: '#f5f5f5' }, // Optional hover effect
                                                    }}
                                                >
                                                    <TableCell sx={{ padding: '2px', fontSize: '0.65rem', height: '10px', }}>
                                                        {item.isEditing ? (
                                                            <Autocomplete
                                                                options={options}
                                                                getOptionLabel={(option) => option.goldItem || "Select"}
                                                                value={options.find((opt) => opt._id === item.goldItem) || null} // Current selected value
                                                                onChange={(event, newValue) => {
                                                                    const goldItemId = newValue?._id || "";
                                                                    handleChangeItem(item.id, goldItemId, "goldItem", newValue?.goldItem || "Select");
                                                                }}
                                                                renderInput={(params) => (
                                                                    <TextField {...params} variant="outlined" size="small" placeholder="Select Gold Item" />
                                                                )}

                                                                sx={{
                                                                    '& .MuiAutocomplete-inputRoot': {
                                                                        fontSize: '0.675rem',
                                                                        height: 20,
                                                                    },
                                                                    '& .MuiInputBase-input': {
                                                                        padding: '1px 1px',
                                                                    },
                                                                    width: 130,

                                                                }}
                                                            />
                                                        ) : (
                                                            <span style={{ fontSize: "0.6rem" }}>{item.type}</span>
                                                        )}
                                                    </TableCell>

                                                    {['quantity', 'grossWeight', 'stoneWeight', 'depreciation', 'netWeight'].map((field) => (
                                                        <TableCell key={field} sx={{ padding: '2px', fontSize: '0.65rem', height: '10px', }}>
                                                            {item.isEditing ? (
                                                                <TextField
                                                                    value={item[field]}
                                                                    onChange={(e) => handleChangeInRow(item.id, field, e.target.value)}
                                                                    variant="outlined"
                                                                    size="small"
                                                                    fullWidth
                                                                    sx={{
                                                                        fontSize: '0.875rem',
                                                                        '& .MuiOutlinedInput-root': {
                                                                            height: '22px',
                                                                            fontSize: '0.75rem',
                                                                        },
                                                                        '& .MuiInputBase-input': {
                                                                            padding: '2px 2px',
                                                                        },
                                                                    }}
                                                                />
                                                            ) : (
                                                                <span style={{ fontSize: '0.7rem' }}>{item[field]}</span>
                                                            )}
                                                        </TableCell>
                                                    ))}

                                                    <TableCell sx={{ padding: '0px' }}>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDelete(item.id)}
                                                            sx={{ padding: '1px' }} // Reduce button padding

                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                        {item.isEditing && (
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => handleSaveRow(item.id)}
                                                                sx={{ padding: '1px' }} // Reduce button padding
                                                            >
                                                                <SaveIcon fontSize="small" /> {/* Add the Save icon */}
                                                            </IconButton>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}

                                        </TableBody>
                                    </Table>
                                )}
                            </TableContainer>

                            <table style={{
                                width: '100%',
                                marginTop: '-18px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #ddd',
                                borderRadius: '0 0 10px 10px',
                                overflow: 'hidden',
                                borderCollapse: 'separate',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Added shadow                            
                            }}>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '2px 6px', fontSize: '12px', borderRight: '1px solid #ddd' }}>No: 5</td>
                                        <td style={{ padding: '2px 6px', fontSize: '12px', borderRight: '1px solid #ddd' }}>Qty: {totalQuantity.toFixed(2)}</td>
                                        <td style={{ padding: '2px 6px', fontSize: '12px', borderRight: '1px solid #ddd' }}>Gr Wt: {totalGrossWeight.toFixed(2)}</td>
                                        <td style={{ padding: '2px 6px', fontSize: '12px', borderRight: '1px solid #ddd' }}>St Wt: {totalStoneWeight.toFixed(2)}</td>
                                        <td style={{ padding: '2px 6px', fontSize: '12px', borderRight: '1px solid #ddd' }}>Dpt Wt: {totalDepWeight.toFixed(2)}</td>
                                        <td style={{ padding: '2px 6px', fontSize: '12px' }}>Net Wt: {totalNetWeight.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Grid>

                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <SearchModal />
                            <Button type="submit" variant="contained" color="primary" sx={{ ml: 1 }} size='small' onClick={handleSubmit}>
                                Submit
                            </Button>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Right Side: Table Summary */}
                <Grid item xs={12} md={5}>
                    <BankDetailsModal />
                    <TableContainer component={Paper} sx={{
                        mt: 2,
                        '&::-webkit-scrollbar': {
                            width: '4px', // Thin scrollbar width
                            height: '4px', // Thin scrollbar height
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#888', // Scrollbar thumb color
                            borderRadius: '2px', // Rounded corners
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            backgroundColor: '#555', // Thumb color on hover
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: '#f1f1f1', // Track color
                        },
                    }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>Bank Name</TableCell>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>Interest Rate</TableCell>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>Other Charges</TableCell>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>Duration</TableCell>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>Remark</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pledges.map((pledge, index) => (
                                    <TableRow key={pledge.pledgeId}>
                                        <TableCell sx={{ fontSize: '0.675rem', }}>{pledge.bankName}</TableCell>
                                        <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>{pledge.interestRate}</TableCell>
                                        <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>{pledge.otherCharges}</TableCell>
                                        <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>{pledge.loanDuration}</TableCell>
                                        <TableCell sx={{ fontSize: '0.675rem', lineHeight: 1 }}>{pledge.itemDetails}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <StaffDesignation />
            </Grid >
        </Box >
    );
};

export default PledgeMasterPage;
