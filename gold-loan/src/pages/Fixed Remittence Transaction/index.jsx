import React from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    Container,
    Grid,
    Paper,
} from "@mui/material";
import wallpaper from '../../assets/a wallpaper for the windows with a consistent logo and a key sign.png';




const Desktop1 = () => {
    return (
        <Box
            sx={{
                backgroundColor: "#483b62",
                height: "700px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
            }}
        >
            {/* Background Image */}
            <Box
                component="img"
                src={wallpaper}
                alt="Background Logo"
                sx={{
                    position: "absolute",
                    left: "150px",
                    top: "50px",
                    width: "400px",
                    height: "500px",
                    borderRadius: "35px",
                    objectFit: "cover",
                }}
            />

            {/* Login Container */}
            <Paper
                elevation={8}
                sx={{
                    position: "absolute",
                    top: "80px",
                    right: "90px",
                    width: "300px",
                    height: "410px",
                    backgroundColor: "rgba(44, 36, 62, 0.7)",
                    borderRadius: "12px",
                    border: "2px solid #483b62",
                    backdropFilter: "blur(2px)",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "24px",
                    gap: "16px",
                }}
            >
                {/* Logo Name */}
                <Typography
                    variant="h2"
                    sx={{
                        fontFamily: "Lobster, cursive",
                        color: "rgba(126, 106, 166, 0.59)",
                        fontSize: "44px",
                    }}
                >
                    LOGONAME
                </Typography>

                {/* Username Field */}
                <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="USERNAME"
                    InputProps={{
                        style: { color: "rgba(0, 0, 0, 0.48)", fontSize: "14px" },
                    }}
                    sx={{
                        mt: 2,
                        backgroundColor: "#fffefe",
                        borderRadius: "9px",
                        "& .MuiOutlinedInput-root": {
                            borderColor: "#000000",
                        },
                    }}
                />

                {/* Password Field */}
                <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="PASSWORD"
                    type="password"
                    InputProps={{
                        style: { color: "rgba(0, 0, 0, 0.48)", fontSize: "14px" },
                    }}
                    sx={{
                        backgroundColor: "#fffefe",
                        borderRadius: "9px",
                        "& .MuiOutlinedInput-root": {
                            borderColor: "#000000",
                        },
                    }}
                />

                {/* Login Button */}
                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        mt: 8,
                        height: "45px",
                        backgroundColor: "#694D75",
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        fontSize: "18px",
                        borderRadius: "32px", // Reduced corner radius
                        "&:hover": {
                            backgroundColor: "#483b62",
                        },

                    }}

                >
                    LOGIN
                </Button>

            </Paper>

            {/* Copyright */}
            <Typography
                sx={{
                    position: "absolute",
                    left: "18px",
                    bottom: "20px",
                    color: "#291e3f",
                    fontSize: "20px",
                    fontFamily: "Poppins, sans-serif",
                }}
            >
                @ COPYRIGHT HAASHTAAGS SOLUTIONS
            </Typography>
        </Box>
    );
};

export default Desktop1;
