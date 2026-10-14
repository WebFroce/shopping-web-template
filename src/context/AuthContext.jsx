import {
    createContext,
    useEffect,
    useState
} from "react";

import api from "../api/api";


export const AuthContext =
    createContext();


export function AuthProvider({ children }) {

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        const loadUser = async () => {

            const token =
                localStorage.getItem(
                    "authToken"
                );


            if (!token) {

                setLoading(false);
                return;

            }


            try {

                const response =
                    await api.get(
                        "/api/auth/profile/"
                    );

                setUser(
                    response.data
                );

            } catch (error) {

                console.error(
                    "خطا در دریافت کاربر:",
                    error
                );

                localStorage.removeItem(
                    "authToken"
                );

                setUser(null);

            } finally {

                setLoading(false);

            }

        };


        loadUser();

    }, []);


    const login = async (
        username,
        password
    ) => {

        const response =
            await api.post(
                "/api/auth/login/",
                {
                    username,
                    password,
                }
            );


        const {
            token,
            user
        } = response.data;


        localStorage.setItem(
            "authToken",
            token
        );


        setUser(user);

        return user;
    };


    const register = async ({
        username,
        email,
        password,
        passwordConfirm,
    }) => {

        await api.post(
            "/api/auth/register/",
            {
                username,
                email,
                password,
                password_confirm: passwordConfirm,
            }
        );

        return login(username, password);
    };


    const logout = async () => {

        try {

            await api.post(
                "/api/auth/logout/"
            );

        } catch (error) {

            console.error(
                "خطا هنگام خروج:",
                error
            );

        } finally {

            localStorage.removeItem(
                "authToken"
            );

            setUser(null);

        }

    };


    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: Boolean(user),
    };


    return (

        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>

    );
}
