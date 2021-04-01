import { createContext } from "react";

const DateContext = createContext({ getNow: () => new Date(), offset: 0 });

export default DateContext;
