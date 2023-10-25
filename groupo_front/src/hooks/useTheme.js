import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

/**
 * Hook personnalisé pour le Dark Theme :
 * @returns {object}
 */
export const useTheme = () => {

    const { theme, toggleTheme } = useContext(ThemeContext);

    return {
        theme: theme,
        toggleTheme: toggleTheme,
        btnTheme: theme ? 'btn-primary-dark' : "btn-primary",
        navTheme: theme ? "dark-nav" : "nav-color",
        formTheme: theme ? 'posts__container-dark' : 'form_1-color',
        connectTheme: theme && 'connect-dark',
        avatarTheme: theme && 'avatar-dark',
        btnTxtTheme: theme ? "Light" : "Dark",
        textareaTheme: theme && "textarea-dark",
        postTheme: theme && 'posts__container-dark'
    };
};