import { ReactNode, createContext, useState } from "react";

interface Props {
  children: ReactNode;
}

type SearchContextType = {
  searchValue: string;
  setSearchValue: (value: string) => void;
};
// Exporting the SET data function, its like , rain, with setSearchValue i can upload the data from inner components, and then down it every where i want
export const SearchContext = createContext<SearchContextType>({
  searchValue: "",
  setSearchValue: () => {},
});

export const SearchProvider = ({ children }: Props) => {
  const [searchValue, setSearchValue] = useState("");

  return <SearchContext.Provider value={{ searchValue, setSearchValue }}>{children}</SearchContext.Provider>;
};
