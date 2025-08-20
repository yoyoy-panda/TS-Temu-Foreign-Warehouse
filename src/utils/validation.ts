export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email: string): boolean => {
  return emailRegex.test(email);
};

export const phoneRegex = /^\d{7,15}$/;

export const isValidPhone = (phone: string): boolean => {
  return phoneRegex.test(phone);
};
