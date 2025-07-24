import { requests } from "../../config/api.config";
import { HttpStatusCode } from 'axios';
import { API_BASE_URL, API_ENDPOINT } from "../../constant/apiEndpoints"

export const savebankdetails = async (bankName,
    interestRate,
    otherCharges,
    duration,
    remark) => {
    return await requests.post({
        url: API_ENDPOINT.SAVE_BANK_DETAILS, data: {
            bankName,
            interestRate,
            otherCharges,
            duration,
            remark
        }
    })
}
export const getBankName = async () => {
    try {
        const response = await requests.get({
            url: API_ENDPOINT.GET_BANK_DETAIL,
        });
        console.log("BANKDETAILS", response);


        return { isSuccess: true, result: response }; // Return success response


        // } else {
        //     console.error("API response error:", response.statusText);
        //     return { isSuccess: false, result: response?.statusText };
        // }

    } catch (error) {
        console.error("Error in updateCustomerRating:", error);
        return { isSuccess: false, result: null }; // Ensure consistent structure for error cases
    }

};

export const getPledgeNumber = async () => {
    try {
        const response = await requests.get({
            url: API_ENDPOINT.GET_PLEDGE_NUMBER,
        });
        console.log("PLEDGENUMBER", response);
        return { isSuccess: true, result: response }; // Return success response
    } catch (error) {
        console.error("Error in updateCustomerRating:", error);
        return { isSuccess: false, result: null }; // Ensure consistent structure for error cases
    }
};

export const getPledgeDetails = async (pledgeId) => {
    try {
        const response = await requests.get({
            url: API_ENDPOINT.GET_PLEDGE_DETAILS.replace("[pledgeId]", pledgeId),
        });
        console.log("PLEDGEDETAILS0", response);
        return { isSuccess: true, result: response }; // Return success response
    } catch (error) {
        console.error("Error in updateCustomerRating:", error);
        return { isSuccess: false, result: null }; // Ensure consistent structure for error cases
    }
};

export const savePledgeTransaction = async (paidOtherCharges, pledgeId, paidAmount, paidPrinciple, paidInterest) => {
    try {
        const response = await requests.post({
            url: API_ENDPOINT.SAVE_PLEDGE_TRANSACTION,
            data: {
                paidOtherCharges, pledgeId, paidAmount, paidPrinciple, paidInterest

            }
        });
        // console.log("PLEDGETRANSACTION 1", response);
        return { isSuccess: true, result: response }; // Return success response
    } catch (error) {
        console.error("Error in updateCustomerRating:", error);
        return { isSuccess: false, result: null }; // Ensure consistent structure for error cases
    }
}

export const searchPledgeDetails = async (searchText) => {
    try {
        const response = await requests.post({
            url: API_ENDPOINT.SEARCH_PLEDGE_DETAILS,
            params: { searchText }
        });
        console.log("SEARCHPLEDGEDETAILS123", response);
        return { isSuccess: true, result: response }; // Return success response
    } catch (error) {
        console.error("Error in updateCustomerRating:", error);
        return { isSuccess: false, result: null }; // Ensure consistent structure for error cases
    }
}
