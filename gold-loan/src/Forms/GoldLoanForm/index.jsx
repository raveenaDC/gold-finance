import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import {
    Box, TextField, Button, IconButton, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Autocomplete, Grid,
    Typography, ToggleButtonGroup, ToggleButton, FormControl,
    InputLabel, Select, MenuItem, Divider, Rating
} from '@mui/material';
import { CustomerForm } from '../../Forms';
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constant/route";
import { Card, CardContent, Avatar, FormControlLabel, Switch, } from '@mui/material';
import { LinearProgress } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SaveIcon from '@mui/icons-material/Save';

import AddNomineeDetails from '../../components/NomineeSearch';
import { incrementGLNo } from '../../Redux/GlNoSlice';
import { incrementVoucherNo } from '../../Redux/voucherNoSlice';

import { useParams } from 'react-router-dom';
import { submitDocument } from '../../api';
import { useNominee } from '../../configure/NomineeContext';
import { getCustomerDetails, updateCustomerRating } from '../../services/customer/customer.service';
import { getgolditemdetails, getcustomergoldloandetails } from '../../services/goldItems/goldItems.service';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const GoldLoanForm = () => {
    const dispatch = useDispatch();
    const webcamRef = useRef(null);
    const formRef = useRef();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        principleAmount: '',
        insurance: '',
        processingFee: '',
        packingFee: '',
        appraiser: '',
        otherCharges: '',
        range: '',
        interestMode: 'simple',
        interestPercentage: '14',
    });

    const [items, setItems] = useState([]);
    const [newItem, setNewItems] = useState({
        id: 1,
        type: 'Select',
        quantity: '',
        grossWeight: '',
        stoneWeight: '',
        depreciation: '',
        netWeight: '',
    });

    const [customerData, setCustomerData] = useState(null);
    const [options, setOptions] = useState([]);
    const [fileImage, setFileImage] = useState({ goldImage: null, capture: null });
    const [usingWebcam, setUsingWebcam] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentMode, setPaymentMode] = useState('Cash');
    const [purchaseDate, setSelectedDate] = useState(null);
    const [rating, setRating] = useState(0);
    const [interestType, setInterestType] = useState('simple');
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [loanDetails, setLoanDetails] = useState([]);

    const glNo = useSelector((state) => state.glNo.glNo);
    const voucherNo = useSelector((state) => state.voucherNo.voucherNo);
    const { date, goldRate, companyGoldRate } = useSelector((state) => state.rateSetting);

    const { customerId } = useParams();
    const { nominee } = useNominee();
    const nId = nominee.nomineeId;

    const [showErrors, setShowErrors] = useState(false);
    const [errors, setErrors] = useState({
        principleAmount: false,
        insurance: false,
        processingFee: false,
        packingFee: false,
        appraiser: false,
        otherCharges: false,
        nId: false,
        goldImage: false,
    });

    const totalNetWeight = items.reduce((total, item) => total + (parseFloat(item.netWeight) || 0), 0);
    const totalGrossWeight = items.reduce((total, item) => total + (parseFloat(item.grossWeight) || 0), 0);
    const totalStoneWeight = items.reduce((total, item) => total + (parseFloat(item.stoneWeight) || 0), 0);
    const totalDepWeight = items.reduce((total, item) => total + (parseFloat(item.depreciation) || 0), 0);
    const totalQuantity = items.reduce((total, item) => total + (parseFloat(item.quantity) || 0), 0);
    const recommendedAmount = totalNetWeight * goldRate;
    const maxGoldAmount = totalNetWeight * companyGoldRate;
    const totalCharges = (parseFloat(form.otherCharges) || 0) + (parseFloat(form.appraiser) || 0) + (parseFloat(form.insurance) || 0) + (parseFloat(form.processingFee) || 0) + (parseFloat(form.packingFee) || 0);

    const calculateNetWeight = (quantity, grossWeight, stoneWeight, depreciation) => {
        const grossWt = parseFloat(grossWeight) || 0;
        const stoneWt = parseFloat(stoneWeight) || 0;
        const depWt = parseFloat(depreciation) || 0;
        const netWeight = grossWt - (stoneWt + depWt);
        return netWeight;
    };

    const handleAddRow = () => {
        if (newItem.netWeight !== "") {
            setItems((prevItems) => [
                ...prevItems,
                { ...newItem, id: prevItems.length + 1 }
            ]);
            setNewItems({
                id: newItem.id + 1,
                type: 'Select',
                quantity: '',
                grossWeight: '',
                stoneWeight: '',
                depreciation: '',
                netWeight: '',
            });
        }
    };

    const handleChange = (field, value, type, goldItemId) => {
        setNewItems((prevState) => {
            const updatedItem = {
                ...prevState,
                [field]: value,
            };

            if (goldItemId) {
                updatedItem.goldItem = goldItemId;
            }

            if (["quantity", "grossWeight", "stoneWeight", "depreciation"].includes(field)) {
                updatedItem.netWeight = calculateNetWeight(
                    updatedItem.quantity || 0,
                    updatedItem.grossWeight || 0,
                    updatedItem.stoneWeight || 0,
                    updatedItem.depreciation || 0
                );
            }

            if (field === "goldItem" && value) {
                updatedItem.type = options.find((option) => option._id === value)?.goldItem || "Select";
            }

            return updatedItem;
        });
    };

    const handleChangeItem = (id, gId, field, value) => {
        setItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === id) {
                    const updatedItem = {
                        ...item,
                        [field]: value,
                    };
                    if (gId) {
                        updatedItem.goldItem = gId;
                        updatedItem.type = options.find((option) => option._id === gId)?.goldItem || item.type;
                    }
                    if (["quantity", "grossWeight", "stoneWeight", "depreciation"].includes(field)) {
                        updatedItem.netWeight = calculateNetWeight(
                            updatedItem.quantity,
                            updatedItem.grossWeight,
                            updatedItem.stoneWeight,
                            updatedItem.depreciation
                        );
                    }
                    return updatedItem;
                }
                return item;
            })
        );
    };

    const handleChangeInRow = (id, field, value) => {
        const updatedItems = items.map((item) => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value };
                if (["quantity", "grossWeight", "stoneWeight", "depreciation"].includes(field)) {
                    updatedItem.netWeight = calculateNetWeight(
                        updatedItem.quantity || 0,
                        updatedItem.grossWeight || 0,
                        updatedItem.stoneWeight || 0,
                        updatedItem.depreciation || 0
                    );
                }
                return updatedItem;
            }
            return item;
        });
        setItems(updatedItems);
    };

    const toggleEditMode = (id) => {
        const updatedItems = items.map((item) => {
            if (item.id === id) {
                return { ...item, isEditing: !item.isEditing };
            }
            return item;
        });
        setItems(updatedItems);
    };

    const handleDelete = (id) => {
        const updatedItems = items.filter((item) => item.id !== id);
        setItems(updatedItems);
    };

    const handleSaveRow = (id) => {
        toggleEditMode(id);
    };

    const handleChangeForm = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleSwitchChange = (event) => {
        const newMode = event.target.checked ? 'Debit' : 'Cash';
        setPaymentMode(newMode);
    };

    const handleInterestChange = (event, newType) => {
        setInterestType(newType);
        if (newType === 'multiple') {
            setForm(prevState => ({
                ...prevState,
                interestMode: 'monthly'
            }));
        } else {
            setForm(prevState => ({
                ...prevState,
                interestMode: newType
            }));
        }
    };

    const handleChangeMode = (event) => {
        const { value } = event.target;
        setForm(prevState => ({
            ...prevState,
            interestMode: value
        }));
    };

    const handleButtonClick = () => {
        const fileInput = document.getElementById("goldImage");
        fileInput.addEventListener("change", (e) => {
            const { files, name } = e.target;
            if (files && files[0]) {
                setFileImage({ ...fileImage, [name]: files[0] });
            }
        }, { once: true });
        fileInput.click();
    };

    const handleCloseImage = () => {
        setFileImage({ ...fileImage, goldImage: null });
    };

    const handleCloseCapture = () => {
        setFileImage({ ...fileImage, capture: null });
    };

    const calculateProfileCompletion = (customerData) => {
        const totalFields = 24;
        let completedFields = 0;

        if (customerData.primaryNumber) completedFields++;
        if (customerData.secondaryNumber) completedFields++;
        if (customerData.address) completedFields++;
        if (customerData.email) completedFields++;
        if (customerData.aadhar) completedFields++;
        if (customerData.aadharImage) completedFields++;
        if (customerData.bankName) completedFields++;
        if (customerData.bankUserName) completedFields++;
        if (customerData.city) completedFields++;
        if (customerData.gender) completedFields++;
        if (customerData.ifsc) completedFields++;
        if (customerData.image) completedFields++;
        if (customerData.lastName) completedFields++;
        if (customerData.nearBy) completedFields++;
        if (customerData.panCardName) completedFields++;
        if (customerData.panCardNumber) completedFields++;
        if (customerData.passBookImage) completedFields++;
        if (customerData.pin) completedFields++;
        if (customerData.place) completedFields++;
        if (customerData.signature) completedFields++;
        if (customerData.state) completedFields++;
        if (customerData.upId) completedFields++;
        if (customerData.gst) completedFields++;

        return parseFloat(((completedFields / totalFields) * 100).toFixed(1));
    };

    const handleShowMissingDetails = (customerData) => {
        const missingDetails = [];
        if (!customerData.primaryNumber) missingDetails.push('Mobile number');
        if (!customerData.secondaryNumber) missingDetails.push('Secondary mobile number');
        if (!customerData.address) missingDetails.push('Address');
        if (!customerData.email) missingDetails.push('Email');
        if (!customerData.aadhar) missingDetails.push('Aadhar');
        if (!customerData.aadharImage) missingDetails.push('AadharImage');
        if (!customerData.bankName) missingDetails.push('bankName');
        if (!customerData.bankUserName) missingDetails.push('bankUserName');
        if (!customerData.city) missingDetails.push('city');
        if (!customerData.gender) missingDetails.push('gender');
        if (!customerData.ifsc) missingDetails.push('ifsc');
        if (!customerData.image) missingDetails.push('image');
        if (!customerData.lastName) missingDetails.push('lastName');
        if (!customerData.nearBy) missingDetails.push('nearBy');
        if (!customerData.panCardName) missingDetails.push('panCardName');
        if (!customerData.panCardNumber) missingDetails.push('panCardNumber');
        if (!customerData.passBookImage) missingDetails.push('passBookImage');
        if (!customerData.pin) missingDetails.push('pin');
        if (!customerData.place) missingDetails.push('place');
        if (!customerData.signature) missingDetails.push('signature');
        if (!customerData.state) missingDetails.push('state');
        if (!customerData.upId) missingDetails.push('upId');
        if (!customerData.gst) missingDetails.push('gst');

        alert(`Missing details: ${missingDetails.join(', ')}`);
    };

    const fetchCustomerData = async () => {
        try {
            const response = await getCustomerDetails(customerId);
            if (response.isSuccess && response.userDetails) {
                setCustomerData(response.userDetails);
                setRating(response.userDetails.rating);
            }
        } catch (error) {
            console.error('Error fetching customer details:', error);
        }
    };

    const fetchGoldItems = async () => {
        try {
            const response = await getgolditemdetails();
            if (response.isSuccess && response.items) {
                setOptions(response.items);
            }
        } catch (error) {
            console.error("Error fetching customer data:", error);
            setLoading(false);
        }
    };

    const fetchCustomerGoldDetailsData = async () => {
        try {
            const response = await getcustomergoldloandetails(customerId);
            const items = response.items || [];
            setLoanDetails(items);
        } catch (error) {
            console.error('Error fetching customer details:', error);
        }
    };

    useEffect(() => {
        fetchGoldItems();
        fetchCustomerData();
        fetchCustomerGoldDetailsData();
    }, [customerId]);

    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setSelectedDate(formattedDate);
    }, []);

    useEffect(() => {
        setTableData([
            { column1: 'Data 1', column2: 'Data 2' },
            { column1: 'Data 3', column2: 'Data 4' },
            { column1: 'Data 5', column2: 'Data 6' }
        ]);
    }, []);

    const handleRatingChange = async (event, newValue) => {
        try {
            setRating(newValue);
            const response = await updateCustomerRating(customerId, newValue);
            if (response.isSuccess) {
                setCustomerData((prevData) => ({ ...prevData, rating: newValue }));
            }
        } catch (error) {
            setLoading(false);
        }
    };

    const captureImage = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setFileImage({ ...fileImage, capture: imageSrc });
        setUsingWebcam(false);
    }, [webcamRef, fileImage]);

    const base64ToBlob = (base64Data, contentType = '') => {
        const byteCharacters = atob(base64Data.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: contentType });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {
            principleAmount: form.principleAmount === '',
            insurance: form.insurance === '',
            processingFee: form.processingFee === '',
            packingFee: form.packingFee === '',
            appraiser: form.appraiser === '',
            otherCharges: form.otherCharges === '',
            nId: !nId || nId === '',
            goldImage: !(fileImage.goldImage || fileImage.capture),
        };

        setErrors(newErrors);
        setShowErrors(true);

        if (Object.values(newErrors).includes(true)) {
            return;
        }

        const invalidRow = items.some(item => {
            return (
                item.quantity === '' ||
                item.grossWeight === '' ||
                item.stoneWeight === '' ||
                item.depreciation === ''
            );
        });

        if (invalidRow) {
            return alert('Please fill out all fields correctly before adding a new item.');
        }

        const formData = new FormData();
        formData.append('principleAmount', form.principleAmount);
        formData.append('appraiser', form.appraiser);
        formData.append('insurance', form.insurance);
        formData.append('interestMode', form.interestMode);
        formData.append('packingFee', form.packingFee);
        formData.append('processingFee', form.processingFee);
        formData.append('goldImage', fileImage.goldImage);
        formData.append("nomineeId", nId);
        formData.append("otherCharges", form.otherCharges);
        formData.append("totalNetWeight", totalNetWeight);
        formData.append("interestPercentage", form.interestPercentage);
        formData.append("paymentMode", paymentMode);
        formData.append("companyGoldRate", companyGoldRate);
        formData.append("glNo", glNo);
        formData.append("voucherNo", voucherNo);
        formData.append("customerId", customerId);
        formData.append("purchaseDate", purchaseDate);
        formData.append("goldRate", goldRate);
        formData.append("totalCharges", totalCharges);

        if (fileImage.capture) {
            let blob = base64ToBlob(fileImage.capture, 'image/jpeg');
            const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
            const filename = `webcam_image_${timestamp}.jpg`;
            const fileWithFileName = new File([blob], filename, { type: 'image/jpeg' });
            fileImage.goldImage = fileWithFileName;
            formData.append('goldImage', fileImage.goldImage);
        }

        items.forEach((item, index) => {
            formData.append(`itemDetails[${index}].goldItem`, item.goldItem);
            formData.append(`itemDetails[${index}].netWeight`, item.netWeight);
            formData.append(`itemDetails[${index}].grossWeight`, item.grossWeight);
            formData.append(`itemDetails[${index}].quantity`, item.quantity);
            formData.append(`itemDetails[${index}].depreciation`, item.depreciation);
            formData.append(`itemDetails[${index}].stoneWeight`, item.stoneWeight);
        });

        try {
            const response = {
                info: formData,
                method: 'post',
                path: 'customer/gold/loan-details'
            };

            let res = await submitDocument(response);
            alert(res.message);

            setForm({
                principleAmount: '',
                insurance: '',
                processingFee: '',
                packingFee: '',
                appraiser: '',
                otherCharges: '',
                range: '',
            });
            setNewItems({
                id: 1,
                type: 'Select',
                quantity: '',
                grossWeight: '',
                stoneWeight: '',
                depreciation: '',
                netWeight: '',
            });
            setFileImage({
                goldImage: null,
                capture: null,
            });

            if (res.status === 201) {
                dispatch(incrementGLNo());
                dispatch(incrementVoucherNo());
                navigate(ROUTES.GOLD_LOAN);
            } else {
                console.error("Failed to submit form:", res.message);
            }
        } catch (error) {
            console.error("Error submitting form:", error.message);
            alert(error.message);
        }
    };

    const handleDownloadPDF = async () => {
        const input = document.getElementById('table-section');
        if (input) {
            const canvas = await html2canvas(input, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
            pdf.save("table-details.pdf");
        }
    };

    return (
        <Box sx={{ display: 'flex', p: 2, width: '100%', mx: 'auto', mt: 1, flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Left Section: Form */}
            <Box sx={{ flex: 2, p: 1, mt: -4 }} ref={formRef}>
                <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', fontWeight: '600' }}>
                    GOLD LOAN
                </Typography>

                <Box id="table-section" display="flex" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                    <Typography variant="overline">GL No: {glNo}</Typography>
                    <TextField
                        label="Select Date"
                        type="date"
                        value={purchaseDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                        sx={{
                            height: '35px',
                            '& .MuiInputBase-root': { minHeight: '20px', fontSize: '0.7rem', padding: '4px 8px' },
                            '& .MuiInputLabel-root': { fontSize: '0.77rem' },
                        }}
                    />
                </Box>

                <TableContainer sx={{ mb: 2, height: 200, overflowY: 'auto' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow sx={{ height: '5px', '& .MuiTableCell-root': { padding: '0px' } }}>
                                <TableCell colSpan={8} sx={{ padding: '2px', borderBottom: '1px solid #ccc' }}>
                                    <Box display="flex" alignItems="center">
                                        <AddNomineeDetails />
                                    </Box>
                                    <Box mt={-5} display="flex" justifyContent="flex-end" alignItems="center">
                                        <Box display="flex" alignItems="center" mx={2}>
                                            <Typography variant="body2" component="span" sx={{ mr: 0 }}>
                                                Ornaments
                                            </Typography>
                                            <IconButton color="primary" onClick={() => setUsingWebcam(!usingWebcam)} sx={{ mr: -3 }}>
                                                <PhotoCamera />
                                            </IconButton>
                                        </Box>
                                        <input type="file" id="goldImage" name="goldImage" style={{ display: 'none' }} accept="image/*" />
                                        <IconButton color="primary" onClick={handleButtonClick}>
                                            <FileUploadIcon />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                {['Item Details', 'No', 'Gross Wt', 'Stone Wt', 'Dep Wt', 'Net Wt', 'Actions'].map((header) => (
                                    <TableCell key={header} sx={{ fontSize: '12px', backgroundColor: '#f0f0f0', padding: '4px', borderBottom: '1px solid #ccc' }}>
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow sx={{ height: '10px' }}>
                                <TableCell sx={{ fontSize: '6px', padding: '1px', borderBottom: '1px solid #ccc' }}>
                                    <Autocomplete
                                        options={options}
                                        getOptionLabel={(option) => option.goldItem || "Select"}
                                        onChange={(event, newValue) => {
                                            const goldItemId = newValue?._id || "";
                                            const goldItemLabel = newValue?.goldItem || "Select";
                                            handleChange("goldItem", goldItemId, "goldItem", goldItemId);
                                            handleChange("type", goldItemLabel, "goldItem", goldItemId);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                size="small"
                                                placeholder="Select Gold Item"
                                            />
                                        )}
                                        sx={{
                                            '& .MuiAutocomplete-inputRoot': { fontSize: '0.675rem', height: 20 },
                                            '& .MuiInputBase-input': { padding: '1px 1px' },
                                            width: 130,
                                        }}
                                    />
                                </TableCell>
                                {['quantity', 'grossWeight', 'stoneWeight', 'depreciation'].map((field) => (
                                    <TableCell key={field} sx={{ fontSize: '8px', padding: '4px', borderBottom: '1px solid #ccc' }}>
                                        <TextField
                                            value={newItem[field] || ""}
                                            onChange={(e) => handleChange(field, e.target.value, "goldItem", newItem.goldItem || "")}
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            sx={{
                                                fontSize: '0.875rem',
                                                '& .MuiOutlinedInput-root': { height: '20px', fontSize: '0.875rem' },
                                                '& .MuiInputBase-input': { padding: '1px 1px' },
                                            }}
                                        />
                                    </TableCell>
                                ))}
                                <TableCell sx={{ fontSize: '8px', padding: '4px', borderBottom: '1px solid #ccc' }}>
                                    <TextField
                                        value={newItem.netWeight || ""}
                                        onChange={(e) => handleChange('netWeight', e.target.value, "goldItem", newItem.goldItem || "")}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        sx={{
                                            fontSize: '0.875rem',
                                            '& .MuiOutlinedInput-root': { height: '20px', fontSize: '0.875rem' },
                                            '& .MuiInputBase-input': { padding: '1px 1px' },
                                        }}
                                    />
                                </TableCell>
                                <TableCell sx={{ padding: '4px' }}>
                                    <IconButton size="small" color="primary" onClick={handleAddRow}>
                                        <AddIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                            {items.map((item) => (
                                <TableRow key={item.id} onDoubleClick={() => toggleEditMode(item.id)} sx={{ height: '10px', '&:hover': { backgroundColor: '#f5f5f5' } }}>
                                    <TableCell sx={{ padding: '2px', fontSize: '0.65rem', height: '10px' }}>
                                        {item.isEditing ? (
                                            <Autocomplete
                                                options={options}
                                                getOptionLabel={(option) => option.goldItem || "Select"}
                                                value={options.find((opt) => opt._id === item.goldItem) || null}
                                                onChange={(event, newValue) => {
                                                    const goldItemId = newValue?._id || "";
                                                    handleChangeItem(item.id, goldItemId, "goldItem", newValue?.goldItem || "Select");
                                                }}
                                                renderInput={(params) => (
                                                    <TextField {...params} variant="outlined" size="small" placeholder="Select Gold Item" />
                                                )}
                                                sx={{
                                                    '& .MuiAutocomplete-inputRoot': { fontSize: '0.675rem', height: 20 },
                                                    '& .MuiInputBase-input': { padding: '1px 1px' },
                                                    width: 130,
                                                }}
                                            />
                                        ) : (
                                            <span style={{ fontSize: "0.6rem" }}>{item.type}</span>
                                        )}
                                    </TableCell>
                                    {['quantity', 'grossWeight', 'stoneWeight', 'depreciation', 'netWeight'].map((field) => (
                                        <TableCell key={field} sx={{ padding: '2px', fontSize: '0.65rem', height: '10px' }}>
                                            {item.isEditing ? (
                                                <TextField
                                                    value={item[field]}
                                                    onChange={(e) => handleChangeInRow(item.id, field, e.target.value)}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        fontSize: '0.875rem',
                                                        '& .MuiOutlinedInput-root': { height: '22px', fontSize: '0.75rem' },
                                                        '& .MuiInputBase-input': { padding: '2px 2px' },
                                                    }}
                                                />
                                            ) : (
                                                <span style={{ fontSize: '0.7rem' }}>{item[field]}</span>
                                            )}
                                        </TableCell>
                                    ))}
                                    <TableCell sx={{ padding: '0px' }}>
                                        <IconButton size="small" color="error" onClick={() => handleDelete(item.id)} sx={{ padding: '1px' }}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                        {item.isEditing && (
                                            <IconButton size="small" color="primary" onClick={() => handleSaveRow(item.id)} sx={{ padding: '1px' }}>
                                                <SaveIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '-15px', backgroundColor: '#ffffff' }}>
                    <tbody>
                        <tr>
                            <td style={{ padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>No: 5</td>
                            <td style={{ padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>Qty: {totalQuantity.toFixed(2)}</td>
                            <td style={{ padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>Gr Wt: {totalGrossWeight.toFixed(2)}</td>
                            <td style={{ padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>St Wt:{totalStoneWeight.toFixed(2)}</td>
                            <td style={{ padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>Dpt Wt: {totalDepWeight.toFixed(2)}</td>
                            <td style={{ padding: '6px', border: '1px solid #ddd', fontSize: '12px' }}>Net Wt: {totalNetWeight.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>

                <Grid container spacing={0.5} sx={{ mb: 2 }}>
                    {[
                        { label: 'Principle Amount', name: 'principleAmount' },
                        { label: 'Processing Fee', name: 'processingFee' },
                        { label: 'Packing Fee', name: 'packingFee' },
                        { label: 'Appraiser Fee', name: 'appraiser' },
                        { label: 'Insurance Fee', name: 'insurance' },
                        { label: 'Other Charges', name: 'otherCharges' }
                    ].map((field, index) => (
                        <Grid item xs={4} key={index}>
                            <TextField
                                type="number"
                                label={field.label}
                                name={field.name}
                                value={form[field.name]}
                                error={errors[field.name]}
                                helperText={errors[field.name] ? `${field.label} must be a valid number` : ''}
                                onChange={handleChangeForm}
                                fullWidth
                                margin="dense"
                                size="small"
                                sx={{
                                    '& .MuiInputLabel-root': { fontSize: '12.5px', marginBottom: '0px' },
                                    '& .MuiInputBase-root': { fontSize: '12.5px', paddingTop: '0px', paddingBottom: '0px' }
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>

                <Typography variant="subtitle1" sx={{ mb: 1 }}>Interest Calculation</Typography>
                <Box sx={{ textAlign: 'right', mt: -4 }}>
                    <FormControlLabel
                        control={<Switch checked={paymentMode === 'Debit'} onChange={handleSwitchChange} color="primary" />}
                        label={paymentMode === 'Debit' ? 'Debit' : 'Cash'}
                    />
                </Box>

                <ToggleButtonGroup
                    color="primary"
                    value={interestType}
                    exclusive
                    onChange={handleInterestChange}
                    size="small"
                    sx={{ mt: 0, textAlign: 'left' }}
                >
                    <ToggleButton value="simple">Simple</ToggleButton>
                    <ToggleButton value="multiple">Multiple</ToggleButton>
                    <ToggleButton value="range">Range</ToggleButton>
                </ToggleButtonGroup>

                {interestType === 'multiple' && (
                    <Box sx={{ mt: 1 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Mode</InputLabel>
                            <Select
                                name="interestMode"
                                value={form.interestMode}
                                label="Mode"
                                onChange={handleChangeMode}
                                sx={{ width: '50%', textAlign: 'left', font: '8px' }}
                            >
                                <MenuItem value="days">Days</MenuItem>
                                <MenuItem value="weekly">Weekly</MenuItem>
                                <MenuItem value="monthly">Monthly</MenuItem>
                                <MenuItem value="quarterly">Quarterly</MenuItem>
                                <MenuItem value="halfyearly">Half Yearly</MenuItem>
                            </Select>
                        </FormControl>
                        {form.mode && (
                            <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                                Selected Mode: {
                                    form.mode === 'weekly' ? 'Weekly' :
                                        form.mode === 'monthly' ? 'Monthly' :
                                            form.mode === 'quarterly' ? 'Quarterly' :
                                                form.mode === 'halfyearly' ? 'Half Yearly' :
                                                    form.mode === 'days' ? 'Days' :
                                                        ''
                                }
                            </Typography>
                        )}
                    </Box>
                )}

                {interestType === 'range' && (
                    <Box sx={{ mt: 1 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Mode</InputLabel>
                            <Select
                                name="interestMode"
                                value={form.interestMode}
                                label="Mode"
                                onChange={handleChangeMode}
                                sx={{ width: '50%', textAlign: 'left', font: '8px' }}
                            >
                                <MenuItem value="rangeA">Range A</MenuItem>
                                <MenuItem value="rangeB">Range B</MenuItem>
                            </Select>
                        </FormControl>
                        {form.mode && (
                            <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                                Selected Mode: {
                                    form.mode === 'rangeA' ? 'rangeA' :
                                        form.mode === 'rangeB' ? 'rangeB' :
                                            ''
                                }
                            </Typography>
                        )}
                    </Box>
                )}

                <Grid container justifyContent="flex-end" sx={{ mt: 2, position: 'sticky', bottom: 0, backgroundColor: 'white', zIndex: 1 }}>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Grid>
                    <IconButton color="primary" onClick={handleDownloadPDF} sx={{ ml: 2 }}>
                        <PictureAsPdfIcon />
                    </IconButton>
                </Grid>
            </Box>

            {/* Right Section: Image and Summary */}
            <Box sx={{ flex: 1, p: 1, mt: -2 }}>
                <Box
                    mt={2}
                    sx={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '600px',
                        height: '200px',
                        backgroundColor: '#f4f4f9',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '16px',
                        overflow: 'hidden',
                    }}
                >
                    {usingWebcam && (
                        <Box mt={2}>
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                width="100%"
                                height="130px"
                            />
                            <Button variant="outlined" color="primary" onClick={captureImage} sx={{ mt: 2 }} size='small'>
                                Capture Image
                            </Button>
                        </Box>
                    )}

                    {fileImage.goldImage && !fileImage.capture && (
                        <div style={{ marginTop: '10px' }}>
                            <img src={URL.createObjectURL(fileImage.goldImage)} alt="Selected" style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover' }} />
                            <IconButton onClick={handleCloseImage} style={{ position: 'absolute', top: 0, right: 0, padding: '0' }}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                    )}
                    {fileImage.capture && (
                        <Box mt={2} position="relative">
                            <img src={fileImage.capture} alt="Captured Image" style={{ maxWidth: '100%', height: '180px' }} />
                            <IconButton onClick={handleCloseCapture} style={{ position: 'absolute', top: 0, right: 0, padding: '0' }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    )}
                </Box>

                {showErrors && errors.goldImage && (
                    <Typography sx={{ mt: 2, color: 'red', fontSize: '0.975rem' }}>
                        Gold image or captured image is required
                    </Typography>
                )}

                <Box sx={{ flex: 1, p: 2 }}>
                    <Typography variant="subtitle1">Summary Table</Typography>
                    <TableContainer component={Paper} sx={{ mb: 3 }}>
                        <Table>
                            <TableHead>
                                <Typography variant="overline"> Vr No: {voucherNo}</Typography>
                            </TableHead>
                            <TableBody sx={{ '& .MuiTableRow-root': { height: '30px' } }}>
                                <TableRow>
                                    <TableCell sx={{ fontSize: '0.675rem', padding: '2px 4px' }}>Current Gold Rate</TableCell>
                                    <TableCell sx={{ fontSize: '0.675rem', padding: '2px 4px' }}>{goldRate}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ fontSize: '0.675rem', padding: '2px 4px' }}>Gold Loan Rate</TableCell>
                                    <TableCell sx={{ fontSize: '0.675rem', padding: '2px 4px' }}>{companyGoldRate}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ fontSize: '0.675rem', padding: '2px 4px' }}>Max Gold Value</TableCell>
                                    <TableCell sx={{ fontSize: '0.675rem', padding: '2px 4px' }}>{recommendedAmount.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ fontSize: '0.675rem', padding: '2px 4px' }}>Max Gold Loan Value</TableCell>
                                    <TableCell sx={{ fontSize: '0.675rem', padding: '2px 4px' }}>{maxGoldAmount.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ fontSize: '0.675rem', padding: '2px 4px' }}>CGST</TableCell>
                                    <TableCell sx={{ fontSize: '0.675rem', padding: '2px 4px' }}>0.00</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ fontSize: '0.675rem', padding: '2px 4px' }}>SGST</TableCell>
                                    <TableCell sx={{ fontSize: '0.675rem', padding: '2px 4px' }}>0.00</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ fontSize: '0.675rem', padding: '2px 4px' }}>Total Charges</TableCell>
                                    <TableCell sx={{ fontSize: '0.675rem', padding: '2px 4px' }}>{totalCharges}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>

            {/* Customer Details */}
            <Box sx={{ flex: 1, p: 2 }}>
                {customerData && (
                    <Card
                        sx={{
                            width: { xs: '100%', sm: '365px' }, // Full width on mobile, fixed width on larger screens
                            borderRadius: 2,
                            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
                            backgroundColor: '#ffffff',
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on mobile, row on larger screens
                            padding: 2,
                            gap: 2,
                            mt: { xs: 2, sm: -1 }, // Adjust margin for mobile
                        }}
                    >
                        {/* Avatar Section */}
                        <Box
                            sx={{
                                width: { xs: '100%', sm: '30%' }, // Full width on mobile, 30% on larger screens
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#e8f5e9',
                                borderRadius: 2,
                                padding: { xs: 1, sm: 0 }, // Add padding on mobile
                            }}
                        >
                            <Avatar
                                alt="Profile"
                                src={`http://localhost:4000${customerData.image.path}`}
                                sx={{
                                    width: { xs: 80, sm: 90 }, // Smaller avatar on mobile
                                    height: { xs: 80, sm: 100 },
                                    border: '4px solid #ffffff',
                                    objectFit: 'cover',
                                }}
                            />
                        </Box>

                        {/* Details Section */}
                        <Box
                            sx={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                padding: { xs: 0, sm: 1 }, // Adjust padding for mobile
                            }}
                        >
                            {/* Header */}
                            <Box>
                                <Typography
                                    variant="body1"
                                    fontWeight="bold"
                                    sx={{ color: '#004d40', fontSize: { xs: '1rem', sm: '1.125rem' } }} // Adjust font size for mobile
                                >
                                    {customerData.firstName} {customerData.lastName}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="black"
                                    sx={{ mb: 1, fontSize: { xs: '0.875rem', sm: '0.9375rem' } }} // Adjust font size for mobile
                                >
                                    {customerData.state}, INDIA
                                </Typography>
                            </Box>

                            {/* Rating */}
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Rating
                                    name="profile-rating"
                                    value={customerData.rating}
                                    onChange={handleRatingChange}
                                    precision={0.5}
                                    size={window.innerWidth < 600 ? 'small' : 'medium'} // Smaller rating stars on mobile
                                />
                            </Box>

                            {/* Contact Information */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 0,
                                    color: 'black',
                                }}
                            >
                                <Box sx={{ display: 'flex', fontSize: { xs: '0.75rem', sm: '0.8125rem' }, alignItems: 'flex-start' }}>
                                    <Box sx={{ display: 'flex', width: '55px', justifyContent: 'space-between' }}>
                                        <strong style={{ textAlign: 'left' }}>Address</strong>
                                        <strong>:&nbsp;</strong>
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        {customerData.address}, {customerData.place}, {customerData.pin}
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', fontSize: { xs: '0.75rem', sm: '0.8125rem' }, alignItems: 'flex-start' }}>
                                    <Box sx={{ display: 'flex', width: '55px', justifyContent: 'space-between' }}>
                                        <strong style={{ textAlign: 'left' }}>Mobile</strong>
                                        <strong>:&nbsp;</strong>
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        {customerData.primaryNumber}, {customerData.secondaryNumber}
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', fontSize: { xs: '0.75rem', sm: '0.8125rem' }, alignItems: 'flex-start' }}>
                                    <Box sx={{ display: 'flex', width: '55px', justifyContent: 'space-between' }}>
                                        <strong style={{ textAlign: 'left' }}>Email</strong>
                                        <strong>:&nbsp;</strong>
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        {customerData.email}
                                    </Box>
                                </Box>

                                {/* Profile Completion */}
                                <Box sx={{ mt: 0.5 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ mt: 0, fontSize: { xs: '0.75rem', sm: '0.8125rem' } }} // Adjust font size for mobile
                                    >
                                        <strong> Profile Completion</strong>: {calculateProfileCompletion(customerData)}%
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={calculateProfileCompletion(customerData)}
                                        sx={{
                                            height: 5,
                                            borderRadius: 10,
                                            cursor: 'pointer',
                                            backgroundColor: '#e0f2f1',
                                            '& .MuiLinearProgress-bar': { backgroundColor: '#689689' },
                                        }}
                                        onClick={() => handleShowMissingDetails(customerData)}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Card>
                )}

                <Box sx={{ maxWidth: 360, margin: '0 auto', mt: 1, textAlign: { xs: 'center', sm: 'left' }, px: { xs: 2, sm: 0 } }}>
                    <TableContainer
                        component={Paper}
                        sx={{
                            mb: 0,
                            overflow: 'auto',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            maxHeight: '400px',
                            '&::-webkit-scrollbar': { width: '4px', height: '4px' },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '2px' },
                            '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' },
                            '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1' },
                        }}
                    >
                        <Table>
                            <TableBody>
                                <TableRow sx={{ padding: '2px 0' }}>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Table Name</TableCell>
                                    {loanDetails.map((detail, index) => (
                                        <TableCell key={index} sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Value</TableCell>
                                    ))}
                                </TableRow>
                                <TableRow sx={{ padding: '0px 0' }}>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Date</TableCell>
                                    {loanDetails.map((detail, index) => (
                                        <TableCell key={index} sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>
                                            {new Date(detail.purchaseDate).toISOString().split('T')[0]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                                <TableRow sx={{ padding: '2px 0' }}>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>GL Number</TableCell>
                                    {loanDetails.map((detail, index) => (
                                        <TableCell key={index} sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>{detail.glNo}</TableCell>
                                    ))}
                                </TableRow>

                                <TableRow sx={{ padding: '0px 0' }}>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Principle Amount</TableCell>
                                    {loanDetails.map((detail, index) => (
                                        <TableCell key={index} sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>{detail.principleAmount}</TableCell>
                                    ))}
                                </TableRow>
                                <TableRow sx={{ padding: '0px 0' }}>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Principle Paid</TableCell>
                                    {loanDetails.map((detail, index) => (
                                        <TableCell key={index} sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>{detail.amountPaid}</TableCell>
                                    ))}
                                </TableRow>
                                <TableRow sx={{ padding: '0px 0' }}>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Interest Rate</TableCell>
                                    {loanDetails.map((detail, index) => (
                                        <TableCell key={index} sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>
                                            {Number(detail.interestRate).toFixed(2)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                                <TableRow sx={{ padding: '0px 0' }}>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}> Total Charges</TableCell>
                                </TableRow>
                                <TableRow sx={{ padding: '0px 0' }}>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Balance Amount</TableCell>
                                    {loanDetails.map((detail, index) => (
                                        <TableCell key={index} sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>
                                            {Number(detail.balanceAmount).toFixed(2)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                                <TableRow sx={{ padding: '0px 0' }}>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Total Net (wt)</TableCell>
                                    {loanDetails.map((detail, index) => (
                                        <TableCell key={index} sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>{detail.totalNetWeight}</TableCell>
                                    ))}
                                </TableRow>

                                <TableRow sx={{ padding: '0px 0' }}>
                                    <TableCell sx={{ fontSize: '0.675rem', lineHeight: 0.1 }}>Profit/Loss</TableCell>
                                    {loanDetails.map((detail, index) => {
                                        const balanceAmount = Number(detail.balanceAmount);
                                        const profitOrLoss = Number(detail.profitOrLoss);

                                        let color = 'black';
                                        if (balanceAmount < .3 * profitOrLoss) {
                                            color = 'green';
                                        } else if (balanceAmount > 0.8 * profitOrLoss) {
                                            color = 'red';
                                        } else if (balanceAmount < 0.8 * profitOrLoss) {
                                            color = 'orange';
                                        }

                                        return (
                                            <TableCell
                                                key={index}
                                                sx={{
                                                    fontSize: '0.675rem',
                                                    lineHeight: 0.1,
                                                    color: color,
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {profitOrLoss.toFixed(2)}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </Box>
    );
};

export default GoldLoanForm;