export function clip_address(str) {
    return (str && typeof(str) === "string") ? str.slice(0, 6) + '...' + str.slice(-4) : "#some_hash#"
}
export function parseNumericValue(value) {
    // Use parseFloat or parseInt depending on the expected number format
    const parsedValue = parseFloat(value);

    // Check for NaN to determine if parsing was successful
    if (isNaN(parsedValue)) {
        console.error("Invalid numeric input. Please enter a valid number.");
        return 0; // Return a fallback value or the original input as needed
    }

    return parsedValue;
}

export const  reverseDate = (dateString) => {
    return dateString && typeof(dateString) === "string" ? dateString.split("-").reverse().join("-") : "";
};

export function clip_names(str) {
    return str.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase();
}

export function get_bg_color(stringInput) {
    let stringUniqueHash = [...stringInput].reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return `hsl(${stringUniqueHash % 360}, 95%, 35%)`;
}

export function clearStorage () {
    localStorage.clear();
    sessionStorage.clear();
}

export function getSimpleDate (d) {
    return d.getDate() + "-" + ( d.getMonth() + 1 ) + "-" + d.getFullYear();
}

export function calculateDaysBetween(date1_ms, date2_ms) {
    
    const date1Ms = new Date(date1_ms).getTime();
    const date2Ms = new Date(date2_ms).getTime();

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1Ms - date2Ms);

    // Convert back to days
    var days = difference_ms / (1000 * 60 * 60 * 24);

    // If less than 1 day, return in hours and minutes
    if (days < 1) {
        var hours = Math.floor(difference_ms / (1000 * 60 * 60));
        var minutes = Math.floor((difference_ms % (1000 * 60 * 60)) / (1000 * 60));
        return hours + " hours and " + minutes + " minutes";
    }

    // Else return in days
    return Math.round(days) + " days";
}

export function isAlphanumeric(str) {
    // This regular expression checks for only alphanumeric characters
    const alphanumericRegex = /^[a-zA-Z0-9]*$/;
    return alphanumericRegex.test(str);
}

export function removeEmptyKeys(obj) {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
        if (value !== "" && value !== null && value !== undefined) {
            if(key === "invoice_amount"){
                newObj[key] = parseFloat(value).toFixed(2);
            } else {
                newObj[key] = value;
            }
        }
    }
    return newObj;
}

export function formatDate(date) {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Try to extract timezone abbreviation from the date string
    const match = date.toString().match(/\(([A-Za-z\s]+)\)$/);
    const timezoneAbbr = match ? match[1].match(/[A-Z]/g).join('') : 'Local';

    return `${month} ${day} ${year} ${hours}:${minutes}:${seconds} ${timezoneAbbr}`;
}

export function extractDays(daysString) {
    // Use a regular expression to match the digits in the string
    const match = daysString.match(/\d+/);

    // If there's a match, convert it to an integer
    if (match) {
        return parseInt(match[0], 10);
    }

    // If there's no match, return NaN or a default value
    return NaN;
}

export function truncateText(str, limit) {
    if (str.length <= limit) {
        return str;
    }
    return str.slice(0, limit) + '...';
}

export function addQueryToUrl(key, value) {
    const url = new URL(window.location);
    url.searchParams.set(key, value); 
    window.history.pushState({}, '', url);
}

export function contentType(extension) {
    switch (extension.toLowerCase()) {
        case 'pdf':
            return 'application/pdf';
        case 'xlsx':
            return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        case 'xls':
            return 'application/vnd.ms-excel';
    }
}