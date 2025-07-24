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
    InputAdornment,
    CircularProgress
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ROUTES } from "../../constant/route";
import { login } from "../../services/customer/customer.service";
import { setToLS } from "../../utils/storage.utils";
import { STORAGE_KEYS } from "../../config/app.config";
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

const Footer = () => (
    <Box
        sx={{
            backgroundColor: '#333',
            color: '#fff',
            textAlign: 'center',
            padding: '12px',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            fontSize: '14px'
        }}
    >
        <Typography variant="body2" sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: { xs: '12px', sm: '14px' } }}>
            © HAASHTAAGS SOLUTIONS 2021 |
            <EmailIcon fontSize="small" sx={{ verticalAlign: 'middle' }} />
            haashtaagsolutions@gmail.com |
            <PhoneIcon fontSize="small" sx={{ verticalAlign: 'middle' }} />
            +91 7907422798, +91 9061903905
        </Typography>
    </Box>
);

const LoginForm = ({ email, setEmail, password, setPassword, showPassword, handleClickShowPassword, handleLogin, loading, error }) => (
    <Box component="form" noValidate autoComplete="off" onSubmit={handleLogin} sx={{ width: '100%' }}>
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
                        <IconButton onClick={handleClickShowPassword} edge="end" aria-label="toggle password visibility">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
        {error && (
            <Typography variant="body2" color="error" sx={{ mt: 2, textAlign: 'center' }}>
                {error}
            </Typography>
        )}
        <Button
            disabled={loading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 2, backgroundColor: '#ff6219', '&:hover': { backgroundColor: '#e65a1a' } }}
        >
            {loading ? <CircularProgress size={24} /> : 'Login'}
        </Button>
    </Box>
);

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
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: '#f0f2f5',
            width: '100%'
        }}>
            {/* Main Content */}
            <Container sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
            }}>
                <Card sx={{
                    width: '100%',
                    maxWidth: '800px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                    <Grid container>
                        {/* Left Side: 3D Art for Gold Loan */}
                        <Grid item md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
                            <CardMedia
                                component="img"
                                image="https://img.freepik.com/free-vector/golden-coins-stack-3d-illustration_107791-16644.jpg?w=826&t=st=1714125707~exp=1714126307~hmac=3c8f1c1b5d5c5a5b5e5c5d5c5a5b5e5c5d5c5a5b5e5c5d5c5a5b5e5c5d5c5a5b"
                                alt="Gold Loan Art"
                                sx={{ height: '100%', objectFit: 'cover' }}
                            />
                        </Grid>

                        {/* Right Side: Compact Login Box */}
                        <Grid item xs={12} md={6}>
                            <CardContent sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '40px 24px',
                                height: '100%'
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    width: '100%',
                                    maxWidth: '320px'
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <LockIcon sx={{ color: '#ff6219', fontSize: '2rem', mr: 1 }} />
                                        <Typography variant="h5" component="span" sx={{ fontWeight: 'bold' }}>
                                            Logo
                                        </Typography>
                                    </Box>

                                    <Typography variant="h6" sx={{ fontWeight: 'normal', mb: 3, textAlign: 'center' }}>
                                        Sign into your account
                                    </Typography>

                                    <LoginForm
                                        email={email}
                                        setEmail={setEmail}
                                        password={password}
                                        setPassword={setPassword}
                                        showPassword={showPassword}
                                        handleClickShowPassword={handleClickShowPassword}
                                        handleLogin={handleLogin}
                                        loading={loading}
                                        error={error}
                                    />

                                    <Link href="#" variant="body2" underline="none" sx={{ mb: 2, display: 'block', textAlign: 'center' }}>
                                        Forgot password?
                                    </Link>
                                    <Typography variant="body2" sx={{ color: '#393f81', textAlign: 'center' }}>
                                        Don't have an account?{' '}
                                        <Link href="#" variant="body2" sx={{ color: '#393f81', fontWeight: 'bold' }}>
                                            Register here
                                        </Link>
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>
            </Container>

            {/* Fixed Footer */}
            <Footer />
        </Box>
    );
}

export default App;