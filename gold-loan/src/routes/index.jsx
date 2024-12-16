
import { Route, Routes } from 'react-router-dom';
import MainPage from '../pages/Dashboard';
import GlMaster from '../pages/GL Master';
import GoldLoanForm from '../Forms/GoldLoanForm';
import GoldLoanBill from '../pages/GL Transition';
import GlLedgerReport from '../Report/GlLedgerReport';
import GlTransactionReport from '../Report/GlTransactionReport';
import GlCustomerDetails from '../Report/GlCustomerDetails';
import { ROUTES } from '../constant/route';



const PageRoutes = () => {
    return (
        <Routes>
            <Route path={ROUTES.HOME} element={<MainPage />} />
            <Route path={ROUTES.GOLD_LOAN} element={<GlMaster />} />
            <Route path={ROUTES.CUSTOMER_GOLD_LOAN} element={<GoldLoanForm />} />
            <Route path={ROUTES.GOLD_TRANSACTION} element={<GoldLoanBill />} />
            <Route path={ROUTES.GL_LEDGER_REPORT} element={<GlLedgerReport />} />
            <Route path={ROUTES.GL_Transaction_Report} element={<GlTransactionReport />} />
            <Route path={ROUTES.GL_Customer_Details} element={<GlCustomerDetails />} />



            {/* <Route path="/goldloan-form/:customerId/:id" element={<GoldLoanForm />} /> Add the nomineeId param */}
        </Routes>
    )
}

export default PageRoutes;