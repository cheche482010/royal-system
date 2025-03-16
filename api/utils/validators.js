export const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }
  
  export const validatePassword = (password) => {
    // At least 6 characters, at least one letter and one number
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
    return re.test(String(password))
  }
  
  export const sanitizeInput = (input) => {
    // Basic sanitization to prevent SQL injection
    if (typeof input === "string") {
      return input.replace(/['";]/g, "")
    }
    return input
  }
  
  