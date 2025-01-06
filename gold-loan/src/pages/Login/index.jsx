import { Box, Button, Container, IconButton, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constant/route";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { login } from "../../services/customer/customer.service";
import { setToLS } from "../../utils/storage.utils";
import { STORAGE_KEYS } from "../../config/app.config";



const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleLogin = async (event) => {
        event.preventDefault();
        if (!email || !password) return;
        setLoading(true);
        setError(null);
        try {

            const response = await login(email, password);

            if (response?.isError || !response?.data?.member_token) {
                setError('Login failed. Please check your credentials or try again later.');
                return;
            }

            setToLS(STORAGE_KEYS.TOKEN, response.data.member_token) // Assuming the response contains the token
            alert('Successfully logged in!');
            navigate(ROUTES.HOME);

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
                flexGrow: 1,
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
                            type={showPassword ? 'text' : 'password'}
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
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">
                                        <IconButton onClick={handleClickShowPassword}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            }}
                        />
                        <Button
                            disabled={loading}
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
