import React, { useState } from "react";
import './AddGoldLoan.css';

function AddGoldLoan() {
    const [interestType, setInterestType] = useState('simple'); // Default to 'simple'

    const handleInterestChange = (type) => {
        setInterestType(type);
    };

    return (
        <div>

            {/* interest calculator */}

            <div className="interest-calculator">
                <h2>Interest Calculation</h2>

                <div className="button-group">
                    <button
                        className={`toggle-button ${interestType === 'simple' ? 'active' : ''}`}
                        onClick={() => handleInterestChange('simple')}
                    >
                        Simple
                    </button>
                    <button
                        className={`toggle-button ${interestType === 'multiple' ? 'active' : ''}`}
                        onClick={() => handleInterestChange('multiple')}
                    >
                        Multiple
                    </button>
                </div>

                {interestType === 'multiple' && (
                    <div className="mode-section">
                        <h3>Mode</h3>
                        <select>
                            <option value="days">Days</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="halfyearly">Half-Yearly</option>
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AddGoldLoan;
