export const API_BASE_URL = "http://localhost:4000";
export const API_ENDPOINT = {
    GET_DASHBOARD_DETAILS: "/dashboard/count/view/details",
    GET_CUSTOMER_DETAILS: "/customer/[customerId]/details/view",
    SAVE_CUSTOMER_LOAN_DETAILS: '/customer/gold/loan-details',
    GET_GOLD_ITEM_DETAILS: "/gold/view-items",
    UPDATE_CUSTOMER_RATINGS: "/customer/[customerId]/details/update",
    GET_CUSTOMER_GOLD_LOAN_DETAILS: "/customer/gold/loan-details/customer/[customerId]",
    GET_GOLD_DETAIL_TABLE: "/customer/gold/loan/[loanId]",
    LOGIN: "/member/login/api",
    GET_GOLD_BILL_HISTORY: "/billing/transaction/gold-loan/[loanId]/bills",
}