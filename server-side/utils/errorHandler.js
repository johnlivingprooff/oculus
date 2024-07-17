const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { username: "", email: "", password: "" };

  // Incorrect email
  if (err.message === "Incorrect email") {
    errors.email = "that email is not registered";
  }

  // Incorrect password
  if (err.message === "Incorrect password") {
    errors.password = "that password is incorrect";
  }

  // duplicate errors
  if (err.code === 11000) {
    errors.email = "that email is already registered";
    return errors;
  }

  // Validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

module.exports = { handleErrors };