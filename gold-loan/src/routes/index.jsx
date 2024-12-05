
import { Route, Routes } from 'react-router-dom';
import MainPage from '../pages/Dashboard';
import GlMaster from '../pages/GL Master';
import GoldLoanForm from '../Forms/GoldLoanForm';
import BillForm from '../pages/GL Transition';
import { ROUTES } from '../constant/route';


const PageRoutes = () => {
    return (
        <Routes>
            <Route path={ROUTES.HOME} element={<MainPage />} />
            <Route path={ROUTES.GOLD_LOAN} element={<GlMaster />} />
            <Route path={ROUTES.CUSTOMER_GOLD_LOAN} element={<GoldLoanForm />} />
            <Route path={ROUTES.GOLD_TRANSACTION} element={<BillForm />} />

            {/* <Route path="/goldloan-form/:customerId/:id" element={<GoldLoanForm />} /> Add the nomineeId param */}
        </Routes>
    )
}

export default PageRoutes;