import { createContext, useState } from "react";

export const ThemeContext = createContext();

const ThemeContextProvider = (props) => {

    const [theme, setTheme] = useState(false);

    const toggleTheme = () => {
        setTheme(theme => !theme)
    };

    const handleDarkTheme = {
        btnTheme: theme ? 'btn-primary-dark' : "btn-primary",
        navTheme: theme ? "dark-nav" : "nav-color",
        formTheme: theme ? 'posts__container-dark' : 'form_1-color',
        connectTheme: theme && 'connect-dark',
        avatarTheme: theme && 'avatar-dark',
        btnTxtTheme: theme ? "Light" : "Dark",
        textareaTheme: theme && "textarea-dark",
        postTheme: theme && 'posts__container-dark'
    };


    if (theme) {
        document.body.classList.add('dark_body');
    } else {
        document.body.classList.remove('dark_body');

    }

    return (
        < ThemeContext.Provider value={{ theme, toggleTheme, handleDarkTheme }} >
            {props.children}
        </ThemeContext.Provider>
    )

}

export default ThemeContextProvider;