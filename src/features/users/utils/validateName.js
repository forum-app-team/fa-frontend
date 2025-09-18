
const validateName = (name) => {
  const errors = {};
  const sanitized = {
    firstName: name.firstName?.trim() || "",
    lastName: name.lastName?.trim() || "",
  };

  if (!sanitized.firstName) {
    errors.firstName = "First name required";

  } else if (!/^[a-zA-Z\s'-]+$/.test(sanitized.firstName)) {
    errors.firstName = "First name contains invalid characters";
  }

  if (!sanitized.lastName) {
    errors.lastName = "Last name required";
  } else if (!/^[a-zA-Z\s'-]+$/.test(sanitized.lastName)) {
    errors.lastName = "Last name contains invalid characters";
  }

  return { sanitized, errors };
};

export {validateName};
