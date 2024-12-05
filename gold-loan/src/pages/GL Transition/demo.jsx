import React, { useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS
import "ag-grid-community/styles/ag-theme-alpine.css"; // Theme CSS
import "./style.css";

const CustomerBillingGrid = () => {
    const [rowData, setRowData] = useState([
        { name: "", contact: "", address: "", loan: 0, interest: 0, total: 0 },
    ]);

    const [columnDefs] = useState([
        { headerName: "Customer Name", field: "name", editable: true },
        { headerName: "Contact", field: "contact", editable: true },
        { headerName: "Address", field: "address", editable: true },
        {
            headerName: "Loan Amount",
            field: "loan",
            editable: true,
            valueParser: (params) => parseFloat(params.newValue) || 0,
        },
        {
            headerName: "Interest",
            field: "interest",
            editable: true,
            valueParser: (params) => parseFloat(params.newValue) || 0,
        },
        {
            headerName: "Total Amount",
            field: "total",
            valueGetter: (params) =>
                (parseFloat(params.data.loan) || 0) + (parseFloat(params.data.interest) || 0),
        },
    ]);

    const gridRef = useRef();

    const handleAddRow = () => {
        setRowData([
            ...rowData,
            { name: "", contact: "", address: "", loan: 0, interest: 0, total: 0 },
        ]);
    };

    const handleDeleteRow = () => {
        const selectedNodes = gridRef.current.api.getSelectedNodes();
        const selectedData = selectedNodes.map((node) => node.data);
        const newData = rowData.filter((row) => !selectedData.includes(row));
        setRowData(newData);
    };

    return (
        <div style={{ width: "100%", margin: "0 auto", padding: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <button onClick={handleAddRow} style={{ padding: "8px 16px", fontSize: "1rem" }}>
                    Add Row
                </button>
                <button onClick={handleDeleteRow} style={{ padding: "8px 16px", fontSize: "1rem" }}>
                    Delete Selected Rows
                </button>
            </div>
            <div
                className="ag-theme-alpine"
                style={{
                    width: "100%",
                    height: "70vh", // Use relative height
                    maxWidth: "1200px", // Limit max width for large screens
                    margin: "0 auto", // Center the grid
                }}
            >
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    rowSelection="single"
                    domLayout="autoHeight"
                    defaultColDef={{
                        flex: 1,
                        minWidth: 100,
                        resizable: true,
                        sortable: false,
                        filter: false, // Enable column filters
                    }}
                    rowHeight={20} // Adjust row height for better visibility
                />
            </div>
        </div>
    );
};

export default CustomerBillingGrid;
