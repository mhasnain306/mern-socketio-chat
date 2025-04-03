import { useState } from "react";

interface InteractedUser {
    name: string;
    _id: string;
}
export interface UserData {
    _id: string;
    name: string;
    email: string;
    password?: string;
    interactedWith?: InteractedUser[];
    interactedUserName: string;
    interactedUserId: string
}
const useUsers = () => {
    const [data, setData] = useState<UserData[] | null>(null);
    const [isUserInteractionUpdated, setUserInteractionUpdated] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [userData, setUserData] = useState<UserData>();

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

    const saveUserInteraction = async (user: UserData) => {
        const response = await fetch("http://localhost:5000/api/users/" + user._id);
        const result = await response.json();
        let isInteractedUser = false;
        result.interactedWith.some((iUser: InteractedUser) => {
            if (iUser._id === user.interactedUserId) {
                isInteractedUser = true;
                return true
            }
        });
        if (!isInteractedUser) {
            const updateData = {
                name: user.name,
                email: user.email,
                interactedUserName: user.interactedUserName,
                interactedUserId: user.interactedUserId
            }
            console.log("Update data for interacted user", updateData)
            try {
                const response = await fetch("http://localhost:5000/api/users/" + user._id, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updateData)
                })

                const result = await response.json();
                setUserInteractionUpdated(true);
            } catch (error) {
                console.log(error);
            }
        }
    }

    const getOneUser = async (userId: string) => {
        try {
            const response = await fetch("http://localhost:5000/api/users/" + userId);
            const user = await response.json();
            return user;
        } catch (error) {
            console.log(error)
        }
    }
    return { createUser, signIn, getUsers, getOneUser, userData, saveUserInteraction, data, isUserInteractionUpdated, isLoading, error }
}

export default useUsers;