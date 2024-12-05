import React, { useState } from 'react';
import AddNomineeDetails from './NomineeForm';
import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Box,
    Button,
    Paper,
    Autocomplete,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const ItemDetailsTable = () => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({
        type: 'Select',
        no: '',
        grossWeight: '',
        stoneWeight: '',
        deptWeight: '',
        netWeight: '', // User input for net weight
    });

    // Function to auto-calculate Net Weight
    const calculateNetWeight = (grossWeight, stoneWeight) => {
        if (grossWeight && stoneWeight) {
            return (parseFloat(grossWeight) - parseFloat(stoneWeight)).toFixed(2);
        }
        return ''; // Return an empty string if calculation can't be done
    };

    // Add a new row to the table
    const handleAddRow = () => {
        if (newItem.netWeight !== '') {
            setItems([
                ...items,
                { ...newItem, id: Date.now(), isEditing: false },
            ]);
            setNewItem({
                type: 'Select',
                no: '',
                grossWeight: '',
                stoneWeight: '',
                deptWeight: '',
                netWeight: '', // Reset netWeight after adding
            });
        }
    };

    // Handle changes in the new item input fields
    const handleChange = (field, value) => {
        // If Gross Weight or Stone Weight changes, auto-calculate Net Weight
        if (field === 'grossWeight' || field === 'stoneWeight') {
            const netWeight = calculateNetWeight(value, newItem.stoneWeight || newItem.grossWeight);
            setNewItem({ ...newItem, [field]: value, netWeight });
        } else {
            setNewItem({ ...newItem, [field]: value });
        }
    };

    // Handle deleting a row
    const handleDelete = (id) => {
        const updatedItems = items.filter((item) => item.id !== id);
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

    // Handle changes when editing a row
    const handleChangeInRow = (id, field, value) => {
        const updatedItems = items.map((item) => {
            if (item.id === id) {
                if (field === 'grossWeight' || field === 'stoneWeight') {
                    const netWeight = calculateNetWeight(value, item.stoneWeight || item.grossWeight);
                    return { ...item, [field]: value, netWeight };
                }
                return { ...item, [field]: value };
            }
            return item;
        });
        setItems(updatedItems);
    };

    // Handle saving the changes after editing
    const handleSaveRow = (id) => {
        toggleEditMode(id); // Save changes and toggle back to view mode
    };

    return (
        <Box sx={{ p: 2 }}>
            <TableContainer sx={{ mb: 2, height: 200, overflowY: 'auto', '&::-webkit-scrollbar': { width: '1px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '4px', '&:hover': { backgroundColor: '#555' } }, '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '4px' } }}>
                {/* Check if tableData is not empty */}
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow sx={{ height: '5px', '& .MuiTableCell-root': { padding: '0px' } }}>
                            <TableCell colSpan={8} sx={{ padding: '2px', borderBottom: '1px solid #ccc' }}>
                                {/* Left side: AddNomineeDetails and Error message */}
                                <Box display="flex" alignItems="center">
                                    <AddNomineeDetails />

                                </Box>
                                {/* Right side: Add Item button */}
                                <Box mt={-5} display="flex" justifyContent="flex-end">
                                    <Button
                                        variant="text"
                                        color="primary"
                                        startIcon={<AddIcon />}
                                        onClick={handleAddRow}
                                    >
                                        Add Item
                                    </Button>
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
                        <TableRow>
                            <TableCell sx={{ fontSize: '8px', padding: '2px', borderBottom: '1px solid #ccc' }}>
                                <Autocomplete
                                    options={['Earrings', 'Bangle', 'Chain', 'Ring']}
                                    value={newItem.type}
                                    onChange={(event, newValue) => handleChange('type', newValue)}
                                    renderInput={(params) => (
                                        <TextField {...params} variant="outlined" size="small" fullWidth sx={{ fontSize: '12px' }} />
                                    )}
                                    sx={{
                                        width: '130px', // Set width for Autocomplete component
                                        fontSize: '8px', // Ensure font size consistency
                                        '& .MuiAutocomplete-option': {
                                            fontSize: '10px', // Reduce font size for dropdown options
                                        },
                                        '& .MuiAutocomplete-input': {
                                            fontSize: '10px', // Set font size for Autocomplete input text
                                        },
                                    }}
                                />
                            </TableCell>
                            {['no', 'grossWeight', 'stoneWeight', 'deptWeight'].map((field) => (
                                <TableCell key={field} sx={{ fontSize: '8px', padding: '4px', borderBottom: '1px solid #ccc' }}>
                                    <TextField
                                        value={newItem[field]}
                                        onChange={(e) => handleChange(field, e.target.value)}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        sx={{
                                            fontSize: '0.875rem', // Adjust font size as needed (e.g., 0.875rem for smaller text)
                                            '& .MuiOutlinedInput-root': {
                                                height: '31px', // Adjust height as needed
                                                fontSize: '0.875rem', // Ensure input text matches font size
                                            },
                                            '& .MuiInputBase-input': {
                                                padding: '4px 2px', // Adjust padding for a compact look
                                            },
                                        }}
                                    />
                                </TableCell>
                            ))}
                            <TableCell sx={{ fontSize: '8px', padding: '4px', borderBottom: '1px solid #ccc' }}>
                                <TextField
                                    value={newItem.netWeight}
                                    onChange={(e) => handleChange('netWeight', e.target.value)}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    sx={{
                                        fontSize: '0.875rem', // Adjust font size as needed (e.g., 0.875rem for smaller text)
                                        '& .MuiOutlinedInput-root': {
                                            height: '31px', // Adjust height as needed
                                            fontSize: '0.875rem', // Ensure input text matches font size
                                        },
                                        '& .MuiInputBase-input': {
                                            padding: '4px 2px', // Adjust padding for a compact look
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
                                            options={['Earrings', 'Bangle', 'Chain', 'Ring']}
                                            value={item.type}
                                            onChange={(event, newValue) => handleChangeInRow(item.id, 'type', newValue)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        fontSize: '0.875rem',
                                                        '& .MuiOutlinedInput-root': {
                                                            height: '22px', // Compact height
                                                            fontSize: '0.65rem',
                                                        },
                                                        '& .MuiInputBase-input': {
                                                            padding: '2px 2px', // Compact padding
                                                        },
                                                    }}
                                                />
                                            )}
                                        />
                                    ) : (
                                        <span style={{ fontSize: '0.6rem' }}>{item.type}</span>
                                    )}
                                </TableCell>
                                {['no', 'grossWeight', 'stoneWeight', 'deptWeight', 'netWeight'].map((field) => (
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
                                            Save
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>

            </TableContainer>
        </Box >
    );
};

export default ItemDetailsTable;