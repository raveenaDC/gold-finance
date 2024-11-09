import React, { useState } from 'react';
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
            <TableContainer component={Paper} sx={{ mb: 2, height: 300, overflowY: 'auto' }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={8} sx={{ padding: '4px', borderBottom: '1px solid #ccc' }}>
                                {/* Add Item button */}
                                <Box display="flex" justifyContent="flex-end">
                                    <Button
                                        variant="contained"
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
                                <TableCell key={header} sx={{ fontSize: '12px', backgroundColor: '#f0f0f0', padding: '4px' }}>
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* New Item Input Row */}
                        <TableRow>
                            <TableCell sx={{ padding: '4px' }}>
                                <Autocomplete
                                    options={['Earrings', 'Bangle', 'Chain', 'Ring']}
                                    value={newItem.type}
                                    onChange={(event, newValue) => handleChange('type', newValue)}
                                    renderInput={(params) => (
                                        <TextField {...params} variant="outlined" size="small" fullWidth sx={{ fontSize: '12px' }} />
                                    )}
                                />
                            </TableCell>
                            {['no', 'grossWeight', 'stoneWeight', 'deptWeight'].map((field) => (
                                <TableCell key={field} sx={{ padding: '4px' }}>
                                    <TextField
                                        value={newItem[field]}
                                        onChange={(e) => handleChange(field, e.target.value)}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        sx={{ fontSize: '12px' }}
                                    />
                                </TableCell>
                            ))}
                            <TableCell sx={{ padding: '4px' }}>
                                <TextField
                                    value={newItem.netWeight}
                                    onChange={(e) => handleChange('netWeight', e.target.value)}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    sx={{ fontSize: '12px' }}
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
                            <TableRow key={item.id} onDoubleClick={() => toggleEditMode(item.id)}>
                                <TableCell sx={{ padding: '4px' }}>
                                    {item.isEditing ? (
                                        <Autocomplete
                                            options={['Earrings', 'Bangle', 'Chain', 'Ring']}
                                            value={item.type}
                                            onChange={(event, newValue) => handleChangeInRow(item.id, 'type', newValue)}
                                            renderInput={(params) => (
                                                <TextField {...params} variant="outlined" size="small" fullWidth sx={{ fontSize: '12px' }} />
                                            )}
                                        />
                                    ) : (
                                        item.type
                                    )}
                                </TableCell>
                                {['no', 'grossWeight', 'stoneWeight', 'deptWeight', 'netWeight'].map((field) => (
                                    <TableCell key={field} sx={{ padding: '4px' }}>
                                        {item.isEditing ? (
                                            <TextField
                                                value={item[field]}
                                                onChange={(e) => handleChangeInRow(item.id, field, e.target.value)}
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                sx={{ fontSize: '12px' }}
                                            />
                                        ) : (
                                            item[field]
                                        )}
                                    </TableCell>
                                ))}
                                <TableCell sx={{ padding: '4px' }}>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                    {item.isEditing && (
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => handleSaveRow(item.id)}
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
        </Box>
    );
};

export default ItemDetailsTable;
