import React, { useEffect, useState } from "react";
import {
    Button,
    TextField,
    Grid,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    useMediaQuery,
} from "@mui/material";
import { viewReports } from "../services/system/system.service";

function GlLedgerReport() {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [asOnDate, setAsOnDate] = useState("");
    const [viewType, setViewType] = useState("Summary");
    const [glLedgerReports, setGlLedgerReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const isMobile = useMediaQuery("(max-width:600px)");

    const fetchGlLedgerReport = async () => {
        try {
            const response = await viewReports();
            console.log(response, "response in gl ledger report");

            if (!response?.isSuccess) {
                alert(response.result);
                return;
            }
            setGlLedgerReports(response.result.data.loanDetails);
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
        let filteredData = [];

        if (fromDate && toDate) {
            // Filter data between fromDate and toDate
            filteredData = glLedgerReports.filter(item => {
                const purchaseDate = new Date(item.purchaseDate);
                return purchaseDate >= new Date(fromDate) && purchaseDate <= new Date(toDate);
            });
        } else if (asOnDate) {
            // Filter data for a specific date (asOnDate)
            filteredData = glLedgerReports.filter(item => {
                const purchaseDate = new Date(item.purchaseDate).toDateString();
                return purchaseDate === new Date(asOnDate).toDateString();
            });
        } else {
            alert("Please select a valid date range or an As On Date.");
            return;
        }

        setGlLedgerReports(filteredData);
    };


    const handleViewChange = (type) => {
        setViewType(type);
    };

    return (
        <Box sx={styles.container}>
            <Typography
                variant={isMobile ? "body1" : "h6"}
                textAlign="center"
                gutterBottom
            >
                GL LEDGER REPORT
            </Typography>

            {/* Date Selectors */}
            <Grid container spacing={2} sx={styles.dateSelector}>
                {["From Date", "To Date", "As On Date"].map((label, index) => (
                    <Grid item xs={12} sm={4} md={2} key={index}>
                        <TextField
                            fullWidth
                            label={label}
                            type="date"
                            value={
                                label === "From Date"
                                    ? fromDate
                                    : label === "To Date"
                                        ? toDate
                                        : asOnDate
                            }
                            size="small"
                            onChange={(e) =>
                                label === "From Date"
                                    ? setFromDate(e.target.value)
                                    : label === "To Date"
                                        ? setToDate(e.target.value)
                                        : setAsOnDate(e.target.value)
                            }
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                ))}

                {/* Submit Button */}
                <Grid item xs={12} sm={4} md={1}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ ...styles.submitButton, mt: 0 }}

                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </Grid>

                {["Detailed", "Summary"].map((type) => (
                    <Grid item xs={12} sm={4} md={1} key={type} sx={styles.buttonGroup}>
                        <Button
                            variant={viewType === type ? "contained" : "outlined"}
                            color="secondary"
                            fullWidth
                            onClick={() => handleViewChange(type)}
                        >
                            {type}
                        </Button>
                    </Grid>
                ))}
            </Grid>

            {/* View Type Buttons */}
            {/* <Grid container spacing={2} justifyContent="center" sx={styles.buttonGroup}>

            </Grid> */}

            {/* Render Table */}
            {
                viewType === "Summary" ? (
                    <SummaryView data={glLedgerReports} />
                ) : (
                    <DetailedView data={glLedgerReports} />
                )
            }
        </Box >
    );
}

// Summary View
const SummaryView = ({ data }) => {
    return (
        <Box sx={styles.tableContainer}>
            <Typography variant="h6" gutterBottom>
                Summary View
            </Typography>
            <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {[
                                "GL No",
                                "Date",
                                "Full Name",
                                "Amount",
                                "Int Plan",
                                "Days",
                                "Paid Amount",
                                "Int Paid",
                                "Int To Pay",
                            ].map((header) => (
                                <TableCell key={header}>{header}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.glNo}>
                                <TableCell>{item.glNo}</TableCell>
                                <TableCell>{new Date(item.purchaseDate).toLocaleDateString()}</TableCell>
                                <TableCell>{item.customerData?.firstName}</TableCell>
                                <TableCell>{item.principleAmount}</TableCell>
                                <TableCell>{item.interestMode}</TableCell>
                                <TableCell>{item.days}</TableCell>
                                <TableCell>{item.amountPaid}</TableCell>
                                <TableCell>{item.interestPaid}</TableCell>
                                <TableCell>{item.intToPay}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

// Detailed View
const DetailedView = ({ data }) => {
    return (
        <Box sx={styles.tableContainer}>
            <Typography variant="h6" gutterBottom>
                Detailed View
            </Typography>
            <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {[
                                "GL No",
                                "Date",
                                "Full Name",
                                "Amount",
                                "Int Plan",
                                "Days",
                                "Txn Date",
                                "Paid Amount",
                                "Int Paid",
                                "Int Paid Date",
                                "Int To Pay",
                            ].map((header) => (
                                <TableCell key={header}>{header}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.glNo}>
                                <TableCell>{item.glNo}</TableCell>
                                <TableCell>{new Date(item.purchaseDate).toLocaleDateString()}</TableCell>
                                <TableCell>{item.customerData?.firstName}</TableCell>
                                <TableCell>{item.principleAmount}</TableCell>
                                <TableCell>{item.interestMode}</TableCell>
                                <TableCell>{item.days}</TableCell>
                                <TableCell>{new Date(item.lastTransactionDate).toLocaleDateString()}</TableCell>
                                <TableCell>{item.amountPaid}</TableCell>
                                <TableCell>{item.interestPaid}</TableCell>
                                <TableCell>{item.lastTransactionDate}</TableCell>
                                <TableCell>{item.intToPay}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

// Styles
const styles = {
    container: {
        padding: { xs: "10px", md: "20px" },
    },
    dateSelector: {
        marginBottom: "15px",
    },
    submitButton: {
        marginTop: "5px",
    },
    buttonGroup: {
        marginBottom: "20px",
    },
    tableContainer: {
        marginTop: "20px",
        padding: "10px",
    },
};

export default GlLedgerReport;
