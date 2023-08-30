export const isValidPassword = (password: string) => {
  const passwordRegex = /^(?=.*[!@%$#^&*-_*(])(?=.*[A-Z]).+$/;
  return passwordRegex.test(password);
};

export const isValidIsraeliPhoneNumber = (phoneNumber: string): boolean => {
  const israeliNumberRegex = /^((((\+972)|0)(([234689]\d{7 })|([57]\d{8}))|(1[5789]\d{8}))|\*\d{3,6})$/;

  return israeliNumberRegex.test(phoneNumber);
};

export const titleCase = (title: string) => {
  if (title) {
    return title
      .split(" ")
      .map((word) => (word && word[0] ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word))
      .join(" ");
  }
};

const inputProgressMsg = (total: number, current: number): string => {
  console.log(total);
  console.log(current);

  if (current + 1 === total) {
    return "Here we go!";
  }
  if (current > total / 2) {
    return `You're verry close to end!`;
  } else {
    return "Minute and you're logged!";
  }
};

export const inputProgress = (array: Array<any>): string => {
  const valuedInputs = [];
  array.forEach((item) => {
    if (item.length > 2) {
      valuedInputs.push(item);
    }
  });
  let current = valuedInputs.length;
  let total = array.length;

  console.log(inputProgressMsg(total, current));
  return inputProgressMsg(total, current) as string;
};
