import React, { createContext, useContext, useState } from 'react';

// Create the context
const NomineeContext = createContext();

// Custom hook to use the NomineeContext
export const useNominee = () => useContext(NomineeContext);

// Provider component
export const NomineeProvider = ({ children }) => {
    const [nominee, setNominee] = useState({
        nomineeId: null,
        firstName: '',
        lastName: '',
    });

    return (
        <NomineeContext.Provider value={{ nominee, setNominee }}>
            {children}
        </NomineeContext.Provider>
    );
};
