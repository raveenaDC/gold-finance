import { requests } from "../../config/api.config";
import { HttpStatusCode } from 'axios';
import { API_BASE_URL, API_ENDPOINT } from "../../constant/apiEndpoints"

export const chart = async (accountName, credit, debit, depreciationRateOne, depreciationRateTwo, category, subcategory,) => {
    return await requests.post({
        url: API_ENDPOINT.CHART_OF_ACCOUNT, data: {
            accountName,
            credit,
            debit,
            depreciationRateOne,
            depreciationRateTwo,
            category,
            subcategory,
        }
    })

}

export const viewAccountHeadName = async () => {
    try {
        const response = await requests.get({
            url: API_ENDPOINT.GET_ACCOUNT_HEAD_NAME,
        });
        console.log("account", response);


        if (response?.status === 200 && !response?.isError) {
            return { isSuccess: true, result: response }; // Return success response


        } else {
            console.error("API response error:", response.statusText);
            return { isSuccess: false, result: response?.statusText };
        }

    } catch (error) {
        console.error("Error in updateCustomerRating:", error);
        return { isSuccess: false, result: null }; // Ensure consistent structure for error cases
    }

};

// export const viewAccountHeadName = async () => {
//     try {
//         const response = await fetch(API_BASE_URL + API_ENDPOINT.GET_ACCOUNT_HEAD_NAME);
//         const data = await response.json();
//         console.log("now checking valuews", data);
//         // if (!data?.isError && data.status === 200) {
//         //     return { isSuccess: true, items: data };
//         // }
//         return { isSuccess: false, items: null }
//     }

//     catch (e) {
//         console.error('Error fetching customer details:', e);
//         return { isSuccess: false, items: null }
//     }
// }

export const saverecieptpaymet = async (chartId, voucherNumber, accountName, description, isPaymentType, debit, credit, amountDate, accountType) => {
    try {
        const response = await requests.post({
            url: API_ENDPOINT.SAVE_PAYMENTS_RECIEPTS.replace("[chartId]", chartId),
            data: {
                chartId,
                voucherNumber,
                accountName,
                description,
                isPaymentType,
                debit,
                credit,
                amountDate,
                accountType
            }
        });

        if (response?.status === 201 && !response?.isError) {
            return { isSuccess: true }; // Return success response
        } else {
            console.error("API response error:", response.statusText);
            return { isSuccess: false, result: response?.statusText };
        }

    } catch (error) {
        console.error("Error during API call:", error);
        return { isSuccess: false, result: error.message };
    }
};
// export const getreceiptpayment = async() = {
//     try{
//         const response = await requests.post({
//             url: API_ENDPOINT.GET_PAYMENTS_RECIEPTS, data: {}

//         });

//     } catch(error) {
//         console.error("Error during API call:", error);
//         return { isSuccess: false, result: error.message };
//     }
// }

// };
