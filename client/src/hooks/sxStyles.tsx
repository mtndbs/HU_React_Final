// import { useState } from "react";

// interface ReturnType {
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }

// export function useInputText(initialValue: string): ReturnType {
//   const [value, setValue] = useState(initialValue);

//   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//     setValue(e.target.value);
//   }

//   return {
//     value,
//     onChange: handleChange,
//   };
// }

export function sxStyles(): any {
  const value = {
    marginBottom: "50px",
    width: "40vw",
    display: "flex",
    // border: "solid 1px black",

    flexDirection: "column",
    justifyContent: "space-between",
    "@media (max-width: 600px)": {
      width: "80vw",
      marginRight: "50px",

      flexDirection: "column",
    },
  };

  return value;
}
