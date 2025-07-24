import { requests } from "../../config/api.config";
import { HttpStatusCode } from 'axios';
import { API_BASE_URL, API_ENDPOINT } from "../../constant/apiEndpoints"

export const saveDesignation = async (roleName) => {
    return await requests.post({
        url: API_ENDPOINT.SAVE_DESIGINATION_ROLE, data: {
            roleName
        }
    })
}

export const viewDesignationRole = async () => {
    try {
        const response = await requests.get({
            url: API_ENDPOINT.GET_DESIGNATION_ROLES,
        });
        console.log("designation", response);

        if (response?.status === 200 && !response?.isError) {
            return { isSuccess: true, result: response }; // Return success response


        } else {
            console.error("API response error:", response.statusText);
            return { isSuccess: false, result: response?.statusText };
        }

    } catch (error) {
        console.error("Error in Designation role:", error);
        return { isSuccess: false, result: null }; // Ensure consistent structure for error cases
    }

};

export const saveAdditionalFees = async (processingFee,
    packingFee,
    appraiser,
    insurance,
    firstLetter,
    secondLetter) => {
    return await requests.post({
        url: API_ENDPOINT.SAVE_ADDITONAL_FEES,
        data: {
            processingFee,
            packingFee,
            appraiser,
            insurance,
            firstLetter,
            secondLetter
        }
    });
}

export const viewAdditionalFees = async () => {
    try {
        const response = await requests.get({
            url: API_ENDPOINT.GET_ADDITONAL_FEES,
        });
        console.log("fees", response);

        if (response?.status === 200 && !response?.isError) {
            return { isSuccess: true, result: response }; // Return success response
        } else {
            console.error("API response error:", response.statusText);
            return { isSuccess: false, result: response?.statusText };
        }

    } catch (error) {
        console.error("Error in Additional fees:", error);
        return { isSuccess: false, result: null }; // Ensure consistent structure for error cases
    }

};

export const saveGoldRate = async (goldRate, companyGoldRate, settingsDate) => {
    return await requests.post({
        url: API_ENDPOINT.SAVE_GOLDRATE,
        data: { goldRate, companyGoldRate, settingsDate }
    });
}

export const viewReports = async () => {
    try {
        const response = await requests.get({
            url: API_ENDPOINT.GET_REPORTS,
        });
        console.log("reports1233", response);

        if (response?.status === 200 && !response?.isError) {
            return { isSuccess: true, result: response }; // Return success response
        } else {
            console.error("API response error:", response.statusText);
            return { isSuccess: false, result: response?.statusText };
        }

    } catch (error) {
        console.error("Error in Reports:", error);
        return { isSuccess: false, result: null }; // Ensure consistent structure for error cases
    }

}