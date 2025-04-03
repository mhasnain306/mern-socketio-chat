import { useEffect, useState } from "react";
import { UserData } from "./useUsers";
import { GroupType } from "./useGroups";
import socket from "../src/socket";
import useGetOneGroup from "./useGetOneGroup";

export interface GroupMessage {
    _id?: string;
    content: string;
    fromId: string;
    groupId: string;
    sentAt: number;
}

const useGroupChat = (message: string, loggedInUser: UserData, group: GroupType) => {
    const oneGroup = group._id ? useGetOneGroup(group._id) : null;

    const [groupMessages, setGroupMessages] = useState<GroupMessage[]>([]);
    const [isUserGroupMember, setUserGroupMember] = useState(false);

    useEffect(() => {
        if (!oneGroup || !oneGroup.groupData) return;

        oneGroup.groupData.users.some(user => {
            if (user === loggedInUser._id) {
                setUserGroupMember(true);
                return true;
            }
            return false;
        });
    }, [oneGroup]);

    useEffect(() => {
        console.log("From useeffect useGroupmemeber-depend in useGroupChat");
        console.log(isUserGroupMember, message);
        if (isUserGroupMember) {
            const handleGroupChat = (message: GroupMessage) => {
                setGroupMessages((prev) => [...prev, message]);
            };

            socket.emit("joinGroup", group._id);
            socket.on("groupChat", handleGroupChat);
        }

        () => {
            socket.off("groupChat")
        }
    }, [isUserGroupMember]);
    useEffect(() => {
        const newMessage = {
            content: message,
            fromId: loggedInUser._id,
            groupId: group._id || "",
            sentAt: Date.now()
        };
        if (isUserGroupMember) {
            socket.emit("groupChat", newMessage, group._id);
        }
    }, [message]);

    return { groupMessages };
};

export default useGroupChat;