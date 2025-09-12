import validator from 'validator';

const validateInput = (data, requiredFields = []) => {
    const sanitized = {};
    const errors = {};

    for (const [key, value] of Object.entries(data)) {
        if (typeof value !== "string") {
            sanitized[key] = "";
            errors[key] = `${key} must be a string`;
            continue;
        }
        // Set email to lowercase
        const trimmedValue = key.toLowerCase().includes("email") ? value.trim().toLowerCase() : value.trim();
        
        sanitized[key] = trimmedValue;

        if (requiredFields.includes(key) && !trimmedValue) {
            errors["key"] = `${key} is required`;
            continue;
        }
        if (
            key.toLowerCase().includes("email") &&  // handle keys like `newEmail`
            trimmedValue && 
            !validator.isEmail(trimmedValue)
        ) {
            errors[key] = "Invalid Email Address";
            continue;
        }
    }
    
    return {sanitized, errors};

};

export default validateInput;