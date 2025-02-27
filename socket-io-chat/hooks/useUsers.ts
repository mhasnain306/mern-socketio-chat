import { useState } from "react";

export interface UserData {
    _id: string
    name: string,
    email: string;
    password: string
}
const useUsers = () => {
    const [data, setData] = useState<UserData[] | null>(null);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const createUser = async (user: UserData) => {
        setLoading(true);
        try {
            console.log(user);

            const response = await fetch("http://localhost:5000/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            });
            const token = response.headers.get("x-auth-token");
            if (token) {
                if (localStorage.getItem("chatAppToken")) {
                    localStorage.removeItem("chatAppToken");
                }
                localStorage.setItem("chatAppToken", token);
            }
            const data = await response.json();
            console.log("The response data: ", data);

            setData(data);
            setLoading(false);
        } catch (error) {
            setLoading(false)
            if (error instanceof Error) {
                console.log(error);

                setError(error.message)
            }
        }
    }

    const signIn = async (user: UserData) => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            });

            const token = response.headers.get("X-Auth-Token");

            if (token) {
                if (localStorage.getItem("chatAppToken")) {
                    localStorage.removeItem("chatAppToken");
                }
                localStorage.setItem("chatAppToken", token);
            }
            const data = await response.json();

            setData(data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error instanceof Error) {
                console.log(error);
                setError(error.message)
            }
        }
    }

    const getUsers = async () => {
        setLoading(true);
        try {
            const result = await fetch("http://localhost:5000/api/users");
            const users = await result.json();

            setData(users);
            setLoading(false);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error);
                setError(error.message)
                setLoading(false);
            }
        }
    }
    return { createUser, signIn, getUsers, data, isLoading, error }
}

export default useUsers;