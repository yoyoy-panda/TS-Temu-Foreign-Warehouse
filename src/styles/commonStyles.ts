export const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "text.primary" },
    "&:hover fieldset": { borderColor: "primary.main" },
    "&.Mui-focused fieldset": { borderColor: "primary.main" },
  },
  "& .MuiInputLabel-root": { color: "text.primary" },
  "& .MuiInputBase-input": { color: "text.primary" },
  
  // Hide the number input spinner buttons
  "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
};
