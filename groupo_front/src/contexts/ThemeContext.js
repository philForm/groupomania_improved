import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

const ThemeContextProvider = (props) => {

    const [theme, setTheme] = useState(false);

    const toggleTheme = () => {
        setTheme(theme => !theme)
    };


    const handleInputDark = (theme) => {

        const inputElt = document.body.getElementsByTagName('input')
        for (let item of inputElt) {
            if (theme)
                item.classList.add('textarea-dark')
            else
                item.classList.remove('textarea-dark')
        }
    }

    useEffect(() => {
        handleInputDark(theme)
    }, [theme])


    if (theme) {
        document.body.classList.add('dark_body');
        // document.getElementsByClassName('posts__container').add('dark_body')
    } else {
        document.body.classList.remove('dark_body');
        // document.getElementsByClassName('posts__container').remove('dark_body')

    }

    return (
        < ThemeContext.Provider value={{ theme, toggleTheme }} >
            {props.children}
        </ThemeContext.Provider>
    )

}

export default ThemeContextProvider;