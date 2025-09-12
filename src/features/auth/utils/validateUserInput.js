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
            errors[key] = `${key} is required`;
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

    // check 'confirm' fields and remove them before sending out the request
    Object.keys(sanitized)
        .filter((key) => key.startsWith("confirm")) // grab pairs of `attr` & `confirmAttr`
        .forEach((confirmKey) => {
            const originalKey =
                // remove 'confirm' prefix, lowercase the first letter
                confirmKey.charAt(7).toLowerCase() + confirmKey.slice(8); 
            if (
                sanitized[originalKey] && 
                sanitized[confirmKey] && 
                sanitized[originalKey] !== sanitized[confirmKey]
            ) {
                errors[confirmKey] = `${originalKey} does not match`;
            }
            delete sanitized[confirmKey];
        });

    return { sanitized, errors };

};

export default validateInput;