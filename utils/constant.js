export const CODE_EXCEPTION = 106;
export const CODE_SUCCESS = 0;
export const CODE_NOT_ACTIVATE = -2;
export const CODE_BAN = -3;
export const CODE_WRONG_PASS = -4;
export const CODE_NOT_FOUND = 106;

export const rules = {
  required: (value) => !!value || "Field is required",
  counter: (value) => value.length <= 20 || "Max 20 characters",
  email: (value) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || "Invalid e-mail";
  },
};
