const isPassword = (value: string) => {
  const persianRegex = /^[\u0600-\u06FF\s]+$/;
  const passwordRegex =
    /^(?=.*\d)(?=.*[A-Z])(?!.*[^a-zA-Z0-9!@#$%^&*\-()+=])(.{8,})$/;
  const isPersian = persianRegex.test(value);
  const atLeast8Character = value.length >= 8;
  const isCorrect = passwordRegex.test(value);

  return atLeast8Character && !isPersian && isCorrect;
};

const isPhoneNumber = (value: string) => {
  const phoneRegex =
    /(0|\+98)?([ ]|-|[()]){0,2}9[0|1|2|3|4]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}/;
  return phoneRegex.test(value);
};

const isEmail = (value: string) => {
  const emailRegex =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
  return emailRegex.test(value);
};

const validations = {
  isPassword,
  isPhoneNumber,
  isEmail,
};
export default validations;
