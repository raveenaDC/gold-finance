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
    Autocomplete,
    Box,
    Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';

const ItemDetailsTable = () => {
    const [items, setItems] = useState([
        { id: 1, type: 'gold', description: '', no: '', grossWeight: '', stoneWeight: '', netWeight: '' },
    ]);

    const handleAddRow = () => {
        const newItem = {
            id: items.length + 1,
            type: 'Select',
            description: '',
            no: '',
            grossWeight: '',
            stoneWeight: '',
            netWeight: '',
        };
        setItems([...items, newItem]);
    };

    const handleChange = (id, field, value) => {
        const updatedItems = items.map((item) => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        });
        setItems(updatedItems);
    };

    const handleNetWeightKeyDown = (id, e) => {
        if (e.key === 'Enter') {
            const currentItem = items.find(item => item.id === id);
            if (currentItem.netWeight) {
                handleAddRow();
            }
        }
    };

    const handleDelete = (id) => {
        const updatedItems = items.filter((item) => item.id !== id);
        setItems(updatedItems);
    };

    return (
        <Box sx={{ p: 2 }}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow
                            sx={{
                                height: '40px', // Adjust height as needed
                                '& .MuiTableCell-root': {
                                    padding: '4px', // Adjust padding to reduce cell height
                                },
                            }}
                        >
                            <TableCell colSpan={7} align="right">
                                <Button
                                    variant="text"
                                    color="primary"
                                    onClick={handleAddRow}
                                    startIcon={<AddIcon />}
                                    sx={{ fontSize: '0.875rem', minHeight: 'auto', padding: '4px 8px' }} // Reduce button padding
                                >
                                    Add Item
                                </Button>
                            </TableCell>
                        </TableRow>

                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell>Type</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>No</TableCell>
                            <TableCell>Gross Weight</TableCell>
                            <TableCell>Stone Weight</TableCell>
                            <TableCell>Net Weight</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow
                                key={item.id}
                                sx={{
                                    height: '40px', // Adjust the row height
                                    '& .MuiTableCell-root': {
                                        padding: '4px', // Reduce padding for cells
                                    },
                                }}
                            >
                                <TableCell>
                                    <Autocomplete
                                        options={['gold', 'bangle', 'chain']}
                                        value={item.type}
                                        onChange={(event, newValue) => handleChange(item.id, 'type', newValue)}
                                        freeSolo
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                required
                                                size="small"
                                                variant="standard" // Apply standard variant for no outline
                                                sx={{ width: '120px' }}
                                            />
                                        )}
                                    />
                                </TableCell>

                                <TableCell>
                                    <TextField
                                        required
                                        value={item.description}
                                        onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                                        size="small"
                                        variant="standard" // Removes the outline
                                        sx={{ width: '120px' }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        required
                                        type="number"
                                        value={item.no}
                                        onChange={(e) => handleChange(item.id, 'no', e.target.value)}
                                        size="small"
                                        variant="standard" // Removes the outline
                                        sx={{ width: '70px' }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        required
                                        type="number"
                                        value={item.grossWeight}
                                        onChange={(e) => handleChange(item.id, 'grossWeight', e.target.value)}
                                        size="small"
                                        variant="standard" // Removes the outline
                                        sx={{ width: '90px' }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        required
                                        type="number"
                                        value={item.stoneWeight}
                                        onChange={(e) => handleChange(item.id, 'stoneWeight', e.target.value)}
                                        size="small"
                                        variant="standard" // Removes the outline
                                        sx={{ width: '90px' }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        required
                                        type="number"
                                        value={item.netWeight}
                                        onKeyDown={(e) => handleNetWeightKeyDown(item.id, e)}
                                        onChange={(e) => handleChange(item.id, 'netWeight', e.target.value)}
                                        size="small"
                                        variant="standard" // Removes the outline
                                        sx={{ width: '90px' }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton color="error" onClick={() => handleDelete(item.id)}>
                                        <DeleteIcon />
                                    </IconButton>
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


