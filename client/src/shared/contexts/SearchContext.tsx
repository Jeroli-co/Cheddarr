import React, { createContext, useContext } from "react";
interface ISearchContext {}

const SearchContextDefaultImpl: ISearchContext = {
  onValueChange(_: string): void {},
};

const SearchContext = createContext<ISearchContext>(SearchContextDefaultImpl);

export const useSearchContext = () => useContext(SearchContext);

export const SearchContextProvider = (props: any) => {
  return (
    <SearchContext.Provider value={{}}>{props.children}</SearchContext.Provider>
  );
};
