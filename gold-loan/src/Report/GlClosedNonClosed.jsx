import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Tabs,
    Tab,
    Box,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    Typography,
} from "@mui/material";
import { viewReports } from "../services/system/system.service";


const mockData = [
    {
        glNo: "001",
        date: "2024-12-01",
        fullName: "John Doe",
        itemDetails: { itemName: "Ring", nos: 2 },
        netWt: "15g",
        principal: 25000,
        principalPaid: 10000,
        paidInt: 500,
        balanceInt: 1000,
        lastTransactionDate: "2025-01-15",
        isClosed: false,
    },
    {
        glNo: "002",
        date: "2024-11-20",
        fullName: "Jane Smith",
        itemDetails: { itemName: "Necklace", nos: 1 },
        netWt: "30g",
        principal: 45000,
        principalPaid: 45000,
        paidInt: 1500,
        balanceInt: 0,
        lastTransactionDate: "2025-01-10",
        isClosed: true,
    },
];



const GoldLoanTabView = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [activeTab, setActiveTab] = useState(0);
    const [filteredData, setFilteredData] = useState(mockData);
    const [closedData, setClosedData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchGlLedgerReport = async () => {
        try {
            const response = await viewReports();
            console.log("response in closed", response);

            if (!response?.isSuccess) {
                alert(response.result);
                return;
            }
            setClosedData(response.result.data.loanDetails);
        } catch (error) {
            console.error("Error fetching GL Ledger Report:", error);
            alert("Failed to fetch GL Ledger Report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGlLedgerReport();
    }, []);

    const handleSubmit = () => {
        const filtered = mockData
            .filter((item) => {
                const placedDate = new Date(item.date);
                return (
                    (!startDate || placedDate >= new Date(startDate)) &&
                    (!endDate || placedDate <= new Date(endDate))
                );
            })
            .sort((a, b) => a.glNo.localeCompare(b.glNo));
        setFilteredData(filtered);
    };

    const renderTable = (isClosed) => (
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>GL No</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Item Details</TableCell>
                    <TableCell>Net Wt</TableCell>
                    <TableCell>Principal Amount</TableCell>
                    <TableCell>Principal Paid</TableCell>
                    <TableCell>Paid Int</TableCell>
                    <TableCell>Balance Int</TableCell>
                    <TableCell>Last Transaction Date</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {closedData
                    .filter((item) => item.isClosed === isClosed)
                    .map((row) => (
                        <TableRow key={row.glNo}>
                            <TableCell>{row.glNo}</TableCell>
                            <TableCell>{row.purchaseDate}</TableCell>
                            <TableCell>{(row.customerData?.firstName || '') + ' ' + (row.customerData?.lastName || '')}</TableCell>
                            <TableCell>
                                {row.goldItemDetails.map((gold, index) => (
                                    <div key={index}>
                                        {gold.goldItem.goldItem} (Net Weight: {gold.netWeight})
                                    </div>
                                ))}
                            </TableCell>
                            <TableCell> {row.goldItemDetails.map((gold, index) => (
                                <div key={index}>
                                    {gold.netWeight}
                                </div>
                            ))}</TableCell>
                            <TableCell>{row.principleAmount}</TableCell>
                            <TableCell>{row.amountPaid}</TableCell>
                            <TableCell>{row.interestPaid}</TableCell>
                            <TableCell>{row.balanceInterest}</TableCell>
                            <TableCell>{row.lastTransactionDate}</TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        </Table>
    );

    return (
        <Box p={2} >
            <Typography
                variant="body2"
                mt={2}
                mb={2}
                align="center"
                fontWeight="bold"
            >
                Gold Closed / Non Closed Details
            </Typography>

            {/* Date Inputs */}
            <Box display="flex" gap={2} alignItems="center" mb={2}>
                <TextField
                    label="Start Date"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <TextField
                    label="End Date"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Submit
                </Button>
            </Box>

            {/* Tabs */}
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                <Tab label="Closed" />
                <Tab label="Non Closed" />
            </Tabs>

            {/* Tab Content */}
            <Paper sx={{ mt: 2, p: 1 }}>
                {activeTab === 0 && renderTable(true)}
                {activeTab === 1 && renderTable(false)}
            </Paper>
        </Box>
    );
};

export default GoldLoanTabView;
