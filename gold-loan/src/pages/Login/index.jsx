import React, { useState } from "react";
import {
    Container,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    TextField,
    Button,
    Link,
    Box,
    IconButton,
    InputAdornment
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ROUTES } from "../../constant/route";
import { login } from "../../services/customer/customer.service";
import { setToLS } from "../../utils/storage.utils";
import { STORAGE_KEYS } from "../../config/app.config";

function App() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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

            setToLS(STORAGE_KEYS.TOKEN, response.data.member_token);
            alert('Successfully logged in!');
            navigate(ROUTES.HOME);

        } catch (error) {
            setError('Login failed. Please check your credentials or try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container sx={{ my: 5 }}>
            <Card>
                <Grid container>
                    <Grid item md={6}>
                        <CardMedia
                            component="img"
                            image="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                            alt="login form"
                            sx={{ borderRadius: '0 0 0 4px', height: '100%' }}
                        />
                    </Grid>
                    <Grid item md={6}>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', px: 3 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2, mb: 1 }}>
                                <LockIcon sx={{ color: '#ff6219', fontSize: '2rem', mr: 2 }} />
                                <Typography variant="h4" component="span" sx={{ fontWeight: 'bold' }}>
                                    Logo
                                </Typography>
                            </Box>

                            <Typography variant="h6" sx={{ fontWeight: 'normal', my: 2, letterSpacing: '1px' }}>
                                Sign into your account
                            </Typography>

                            <Box component="form" noValidate autoComplete="off" onSubmit={handleLogin}>
                                <TextField
                                    label="Email address"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    size="small"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <TextField
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    size="small"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleClickShowPassword}>
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <Button
                                    disabled={loading}
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ my: 2 }}
                                >
                                    Login
                                </Button>
                            </Box>

                            <Link href="#" variant="body2" underline="none" sx={{ mb: 1, display: 'block', mt: 2 }}>
                                Forgot password?
                            </Link>
                            <Typography variant="body2" sx={{ color: '#393f81', mt: 2 }}>
                                Don't have an account?{' '}
                                <Link href="#" variant="body2" sx={{ color: '#393f81' }}>
                                    Register here
                                </Link>
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', mt: 3 }}>
                                <Link href="#" variant="body2" underline="none" sx={{ mr: 1 }}>
                                    Terms of use.
                                </Link>
                                <Link href="#" variant="body2" underline="none">
                                    Privacy policy
                                </Link>
                            </Box>
                        </CardContent>
                    </Grid>
                </Grid>
            </Card>
        </Container>
    );
}

export default App;
