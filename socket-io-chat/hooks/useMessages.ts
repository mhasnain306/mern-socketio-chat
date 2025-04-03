import { useState } from "react";
import { MessageType } from "../components/Chat";
import { BASE_URL } from "../constants";

const useMessages = () => {
    const [messageData, setMessageData] = useState<MessageType | MessageType[] | null>(null);

    const saveMessage = async (message: MessageType) => {
        try {
            const response = await fetch(`${BASE_URL}/api/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(message)
            });

            const result = await response.json();

            setMessageData(result);
        } catch (error) {

        }
    }

    const getMessages = async (user1: string, user2: string) => {
        try {
            const response = await fetch(`${BASE_URL}/api/messages/${user1}/${user2}`);
            const result = await response.json();
            setMessageData(result);
        } catch (error) {
            if (error instanceof Error) {

            }
        }
    }

    const updateMessage = async (messageId: string, message: MessageType) => {
        const response = await fetch(`${BASE_URL}/api/messages/${messageId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(message)
        });
        return await response.json();
    }
    return { saveMessage, getMessages, updateMessage, messageData };
}

export default useMessages;