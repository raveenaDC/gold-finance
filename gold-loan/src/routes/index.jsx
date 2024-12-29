import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import MainPage from '../pages/Dashboard';
import GlMaster from '../pages/GL Master';
import GoldLoanForm from '../Forms/GoldLoanForm';
import GoldLoanBill from '../pages/GL Transition';
import GlLedgerReport from '../Report/GlLedgerReport';
import GlTransactionReport from '../Report/GlTransactionReport';
import GlCustomerDetails from '../Report/GlCustomerDetails';
import LoginPage from '../pages/Login';

import { ROUTES } from '../constant/route';


const PageRoutes = ({ onLoginSuccess }) => {
    return (
        <Routes>
            <Route path={ROUTES.LOGIN} element={<LoginPage onLoginSuccess={onLoginSuccess} />} />
            <Route path={ROUTES.HOME} element={<MainPage />} />
            <Route path={ROUTES.GOLD_LOAN} element={<GlMaster />} />
            <Route path={ROUTES.CUSTOMER_GOLD_LOAN} element={<GoldLoanForm />} />
            <Route path={ROUTES.GOLD_TRANSACTION} element={<GoldLoanBill />} />
            <Route path={ROUTES.GL_LEDGER_REPORT} element={<GlLedgerReport />} />
            <Route path={ROUTES.GL_Transaction_Report} element={<GlTransactionReport />} />
            <Route path={ROUTES.GL_Customer_Details} element={<GlCustomerDetails />} />
        </Routes>

    );
};

// const ProtectedRoute = ({ element, isAuthenticated }) => {
//     return isAuthenticated ? element : <Navigate to={ROUTES.LOGIN} replace />;
// };

// const PageRoutes = ({ isAuthenticated, onLoginSuccess }) => {
//     return (
//         <Routes>
//             <Route path={ROUTES.LOGIN} element={<LoginPage onLoginSuccess={onLoginSuccess} />} />
//             <Route path={ROUTES.HOME} element={<ProtectedRoute element={<MainPage />} isAuthenticated={isAuthenticated} />} />
//             <Route path={ROUTES.GOLD_LOAN} element={<ProtectedRoute element={<GlMaster />} isAuthenticated={isAuthenticated} />} />
//             <Route path={ROUTES.CUSTOMER_GOLD_LOAN} element={<ProtectedRoute element={<GoldLoanForm />} isAuthenticated={isAuthenticated} />} />
//             <Route path={ROUTES.GOLD_TRANSACTION} element={<ProtectedRoute element={<GoldLoanBill />} isAuthenticated={isAuthenticated} />} />
//             <Route path={ROUTES.GL_LEDGER_REPORT} element={<ProtectedRoute element={<GlLedgerReport />} isAuthenticated={isAuthenticated} />} />
//             <Route path={ROUTES.GL_Transaction_Report} element={<ProtectedRoute element={<GlTransactionReport />} isAuthenticated={isAuthenticated} />} />
//             <Route path={ROUTES.GL_Customer_Details} element={<ProtectedRoute element={<GlCustomerDetails />} isAuthenticated={isAuthenticated} />} />
//             <Route path="*" element={<h2>404: Page Not Found</h2>} />
//         </Routes>
//     );
// };


export default PageRoutes;
