import { createContext, useReducer, useEffect } from "react";
import axios from "axios";

import { authReducer } from "../reducers/authReducer";
import setAuthToken from "../utils/utils";
import {
    apiUrl,
    LOCAL_STORAGE_TOKEN_NAME,
    SET_AUTH,
} from "../constants/constants";

export const AuthContext = createContext(undefined);

const AuthContextProvider = ({ children }) => {
    const [authState, dispatch] = useReducer(
        authReducer,
        {
            authLoading: true,
            isAuthenticated: false,
            user: {},
        },
        undefined
    );

    // Authenticate user
    const loadUser = async () => {
        if (localStorage[LOCAL_STORAGE_TOKEN_NAME]) {
            setAuthToken(localStorage[LOCAL_STORAGE_TOKEN_NAME]);
        }

        try {
            const response = await axios.get(`${apiUrl}/auth`);
            if (response.data.success) {
                dispatch({
                    type: SET_AUTH,
                    payload: {
                        isAuthenticated: true,
                        user: response.data.user,
                    },
                });
            }
        } catch (error) {
            localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
            setAuthToken(null);
            dispatch({
                type: SET_AUTH,
                payload: {
                    isAuthenticated: false,
                    user: {},
                },
            });
        }
    };

    useEffect(() => loadUser(), []);

    // Login
    const loginUser = async (userForm) => {
        try {
            const response = await axios.post(`${apiUrl}/auth/login`, userForm);
            if (response.data.success) {
                localStorage.setItem(
                    LOCAL_STORAGE_TOKEN_NAME,
                    response.data.accessToken
                );
            }
            await loadUser();
            return response.data;
        } catch (error) {
            if (error.response.data) {
                return error.response.data;
            } else {
                return { success: false, message: error.message };
            }
        }
    };

    // Register
    const registerUser = async (userForm) => {
        try {
            const response = await axios.post(
                `${apiUrl}/auth/register`,
                userForm
            );
            if (response.data.success) {
                localStorage.setItem(
                    LOCAL_STORAGE_TOKEN_NAME,
                    response.data.accessToken
                );
            }
            await loadUser();
            return response.data;
        } catch (error) {
            if (error.response.data) {
                return error.response.data;
            } else {
                return { success: false, message: error.message };
            }
        }
    };

    // Logout
    const logoutUser = () => {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
        dispatch({
            type: SET_AUTH,
            payload: { isAuthenticated: false, user: {} },
        });
    };

    const authContextData = {
        authState,
        loginUser,
        registerUser,
        logoutUser,
    };

    return (
        <AuthContext.Provider value={authContextData}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
