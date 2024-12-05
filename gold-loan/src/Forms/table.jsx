<TableContainer sx={{ mb: 2, height: 200, overflowY: 'auto', '&::-webkit-scrollbar': { width: '1px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '4px', '&:hover': { backgroundColor: '#555' } }, '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '4px' } }}>
    {/* Check if tableData is not empty */}
    {tableData.length === 0 ? (
        <p>No data available</p>
    ) : (<Table stickyHeader aria-label="sticky table">

        <TableHead>

            <TableRow sx={{ height: '5px', '& .MuiTableCell-root': { padding: '0px' } }}>
                <TableCell colSpan={8} sx={{ padding: '2px', borderBottom: '1px solid #ccc' }}>
                    {/* Left side: AddNomineeDetails and Error message */}
                    <Box display="flex" alignItems="center">
                        <AddNomineeDetails />

                    </Box>

                    {/* Right side: Add Item button */}
                    <Box mt={-5} display="flex" justifyContent="flex-end">
                        <Button variant="text" color="primary" startIcon={<AddIcon />} onClick={appendRow}>
                            Add Item
                        </Button>
                    </Box>

                </TableCell>

            </TableRow>

            <TableRow >
                {['Item Details', 'Qty', 'Gross Wt', 'Stone Wt', 'Dep Wt', 'Net Wt', 'Actions'].map((header) => (
                    <TableCell key={header} sx={{ fontSize: '10px', backgroundColor: '#e0e0e0 ', padding: '4px', borderBottom: '1px solid #ccc' }}>
                        {header}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>

        <TableBody>
            {items.map((item) => (
                <TableRow key={item.id}>

                    <TableCell sx={{ fontSize: '8px', padding: '2px', borderBottom: '1px solid #ccc' }}>
                        <Autocomplete
                            options={options}
                            // value={item.itemDetails}
                            onChange={(event, newValue) => handleChangeItem(item.id, newValue?._id, 'itemDetails', newValue)}
                            onInputChange={(event, newValue) => setSearchTerm(newValue)}
                            // value={(option) => option._id}
                            getOptionLabel={(option) => option.goldItem} // Adjust as needed
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    sx={{
                                        fontSize: '8px', // Adjust font size for TextField
                                        '& .MuiOutlinedInput-root': {
                                            height: '20px', // Adjust height for TextField
                                            fontSize: '8px', // Set input text font size
                                        },
                                        '& .MuiInputBase-input': {
                                            padding: '2px 2px', // Adjust padding for compact appearance
                                        },
                                    }}
                                />
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

                    {['quantity', 'grossWeight', 'stoneWeight', 'depreciation'].map((field) => (
                        <TableCell key={field} sx={{ fontSize: '8px', padding: '2px', borderBottom: '1px solid #ccc' }}>
                            <TextField
                                type="number"
                                value={item[field]}
                                onChange={(e) => handleChangeItem(item.id, item.goldItem, field, e.target.value)}
                                variant="outlined"
                                size="small"
                                fullWidth
                                sx={{
                                    fontSize: '0.875rem', // Adjust font size as needed (e.g., 0.875rem for smaller text)
                                    '& .MuiOutlinedInput-root': {
                                        height: '20px', // Adjust height as needed
                                        fontSize: '0.875rem', // Ensure input text matches font size
                                    },
                                    '& .MuiInputBase-input': {
                                        padding: '2px 2px', // Adjust padding for a compact look
                                    },
                                }}
                            />
                        </TableCell>
                    ))}

                    <TableCell sx={{ fontSize: '8px', padding: '2px', borderBottom: '1px solid #ccc' }}>
                        <TextField
                            type="number"
                            value={item.netWeight}
                            onChange={(e) => handleChangeItem(item.id, item.goldItem, 'netWeight', e.target.value)}
                            variant="outlined"
                            size="small"
                            fullWidth
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && item.netWeight !== '') {
                                    appendRow();
                                }
                            }}
                            InputProps={{
                                style: {
                                    fontSize: '0.8rem',  // Reduces the font size
                                    height: '20px',      // Reduces the height
                                    padding: '2px'
                                },
                            }}
                            InputLabelProps={{
                                style: {
                                    fontSize: '0.8rem',  // Reduces the label font size
                                },
                            }}
                        />
                    </TableCell>

                    <TableCell sx={{ padding: '2px', borderBottom: '1px solid #ccc' }}>
                        <IconButton size="small" color="error" onClick={() => handleDelete(item.id)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </TableCell>
                </TableRow>

            ))}
        </TableBody>
    </Table>
    )}
</TableContainer>
