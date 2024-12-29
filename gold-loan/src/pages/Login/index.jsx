import React, { useState } from "react";
import { TextField, Button, Box, Typography, Container, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constant/route";
import { submitData } from "../../api";

const LoginPage = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        const data = {
            email,
            password,
        };
        const customerData = {
            info: data,
            method: 'post',
            path: "member/login/api",
        };

        try {
            const response = await submitData(customerData);
            localStorage.setItem("token", response.member_token); // Assuming the response contains the token
            if (onLoginSuccess) {
                onLoginSuccess();
                alert('Successfully logged in!');
                navigate(ROUTES.HOME);
            }
        } catch (error) {
            setError('Login failed. Please check your credentials or try again later.');
        } finally {
            setLoading(false);
        }
    };


    return (

        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#2F2F2F", // Charcoal Grey
            }}
        >
            <Container maxWidth="xs">
                <Paper
                    elevation={3}
                    sx={{
                        padding: 3,
                        borderRadius: 2,
                        backgroundColor: "#FFFFFF",
                        maxWidth: "100%",
                        width: "360px",
                    }}
                >
                    <Typography
                        variant="h5"
                        component="h1"
                        sx={{ textAlign: "center", marginBottom: 2, color: "#FFD700" }} // Gold text for the title
                    >
                        Login
                    </Typography>
                    <Box component="form" noValidate autoComplete="off" onSubmit={handleLogin}>
                        <TextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": { borderColor: "#FFD700" }, // Gold border
                                    "&:hover fieldset": { borderColor: "#B8860B" }, // Dark Gold on hover
                                },
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": { borderColor: "#FFD700" }, // Gold border
                                    "&:hover fieldset": { borderColor: "#B8860B" }, // Dark Gold on hover
                                },
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                marginTop: 2,
                                backgroundColor: "#B8860B", // Dark Gold
                                color: "#FFFFFF", // White text
                                "&:hover": {
                                    backgroundColor: "#FFD700", // Gold on hover
                                },
                            }}
                        >
                            Login
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>


    );
};

export default LoginPage;
