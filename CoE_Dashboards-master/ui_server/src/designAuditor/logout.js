export const logout =async()=>{
    await localStorage.removeItem("auth")
    window.location.href = "/DAloginpage";
    console.log("logout successfully")
}

export const getBackgroundColor = (summaryPercentage) => {
    if (summaryPercentage === 100) return '#76d63e';
    if (summaryPercentage >= 80) return '#faa357';
    if (summaryPercentage >= 50) return '#f2fa57';
    if (summaryPercentage < 50 && summaryPercentage > 0) return '#f27f77';
    if (summaryPercentage === 0) return '#efefef';
    return '#efefef';
};
// Function to extract a parameter from a URL
export const getRequiredParameter = (paramPosition) => {
    const url = window.location.href
    const urlParts = url.split('/');
    // Get the parameter at the specified position from the end
    const parameter = urlParts[urlParts.length - paramPosition];
    return parameter;
}

// Time format :
export const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false // Use 24-hour format
};
