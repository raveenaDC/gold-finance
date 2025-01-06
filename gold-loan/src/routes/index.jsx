import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../Redux/store'; // Your store file

import MainPage from '../pages/Dashboard';
import GlMaster from '../pages/GL Master';
import GoldLoanForm from '../Forms/GoldLoanForm';
import GoldLoanBill from '../pages/GL Transition';
import GlLedgerReport from '../Report/GlLedgerReport';
import GlTransactionReport from '../Report/GlTransactionReport';
import GlCustomerDetails from '../Report/GlCustomerDetails';
import ChartsOfAccounts from '../pages/Chart of Accounts';
import LoginPage from '../pages/Login';
import { ROUTES } from '../constant/route';
import AuthLayout from '../components/AuthLayout';


const PageRoutes = () => {
    return (
        <Provider store={store}>  {/* Wrap the entire app with Provider */}
            <Routes>
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route element={<AuthLayout />}>
                    <Route path={ROUTES.HOME} element={<MainPage />} />
                    <Route path={ROUTES.GOLD_LOAN} element={<GlMaster />} />
                    <Route path={ROUTES.CUSTOMER_GOLD_LOAN} element={<GoldLoanForm />} />
                    <Route path={ROUTES.GOLD_TRANSACTION} element={<GoldLoanBill />} />
                    <Route path={ROUTES.GL_LEDGER_REPORT} element={<GlLedgerReport />} />
                    <Route path={ROUTES.GL_Transaction_Report} element={<GlTransactionReport />} />
                    <Route path={ROUTES.GL_Customer_Details} element={<GlCustomerDetails />} />
                    <Route path={ROUTES.CHART_OF_ACCOUNTS} element={<ChartsOfAccounts />} />
                </Route>
                <Route path="*" element={<h2>404: Page Not Found</h2>} />
            </Routes>
        </Provider>
    );
};

export default PageRoutes;
