import { createContext, useState } from "react";

export const ThemeContext = createContext();

const ThemeContextProvider = (props) => {

    const [theme, setTheme] = useState(false);

    const toggleTheme = () => {
        setTheme(theme => !theme)
    };


    if (theme) {
        document.body.classList.add('dark_body');
    } else {
        document.body.classList.remove('dark_body');

    }

    return (
        < ThemeContext.Provider value={{ theme, toggleTheme }} >
            {props.children}
        </ThemeContext.Provider>
    )

}

export default ThemeContextProvider;