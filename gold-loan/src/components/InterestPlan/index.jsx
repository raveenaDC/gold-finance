import React, { useState } from "react";
import { Box, Button, TextField, Typography, Modal } from "@mui/material";

const InterestPlanModal = () => {
    const [open, setOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        planName: "",
        dayFrom: "",
        dayTo: "",
        interest: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted Interest Plan:", formValues);
        // Add your API call or form submission logic here
        setOpen(false);
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Typography variant="body2" onClick={handleOpen}>
                Interest Plan
            </Typography>

            <Modal open={open} onClose={handleClose}>
                <Box sx={styles.modalBox}>
                    <Typography variant="h6" sx={styles.title}>
                        Interest Plan
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Plan Name"
                            name="planName"
                            value={formValues.planName}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Day From"
                            name="dayFrom"
                            type="number"
                            value={formValues.dayFrom}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Day To"
                            name="dayTo"
                            type="number"
                            value={formValues.dayTo}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Interest %"
                            name="interest"
                            type="number"
                            value={formValues.interest}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <Box sx={styles.actions}>
                            <Button onClick={handleClose} sx={styles.cancelButton}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary">
                                Submit
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

const styles = {
    modalBox: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        borderRadius: "8px",
    },
    title: {
        marginBottom: 2,
        textAlign: "center",
    },
    actions: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: 2,
    },
    cancelButton: {
        color: "#f44336",
    },
};

export default InterestPlanModal;
