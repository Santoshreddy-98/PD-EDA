import React from 'react';

const ColorCodingInfo = () => {
    const getColorInfo = () => {
        return [
            { percentage: 100, color: "#76d63e", label: "100%" },
            { percentage: 80, color: "#faa357", label: "80% - 99%" },
            { percentage: 50, color: "#f2fa57", label: "50% - 79%" },
            { percentage: 0, color: "#f27f77", label: "Below 50%" },
            { percentage: 0, color: "#efefef", label: "0% (or)NA" },

        ];
    };

    return (
        <div >
            <div style={{ float: "right" }}>
                <b>Info:</b>
                {getColorInfo().map((info) => (
                    <button className='btn btn-primary' key={info.label} style={{ backgroundColor: info.color, color: "black", margin: "10px" }}>
                        {info.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ColorCodingInfo;
