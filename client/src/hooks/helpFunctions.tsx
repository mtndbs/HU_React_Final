export const isValidPassword = (password: string) => {
  const passwordRegex = /^(?=.*[!@%$#^&*-_*(])(?=.*[A-Z]).+$/;
  return passwordRegex.test(password);
};

export const isValidIsraeliPhoneNumber = (phoneNumber: string): boolean => {
  const israeliNumberRegex = /^((((\+972)|0)(([234689]\d{7 })|([57]\d{8}))|(1[5789]\d{8}))|\*\d{3,6})$/;

  return israeliNumberRegex.test(phoneNumber);
};

export const titleCase = (title: string) => {
  return title
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
