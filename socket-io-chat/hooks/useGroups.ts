import { useState } from "react";
import { BASE_URL } from "../constants";

export interface GroupType {
    _id?: string;
    name: string;
    users: string[];
}
const useGroups = () => {
    const [groupData, setGroupData] = useState<GroupType | null>(null);
    const saveGroup = async (groupInput: GroupType) => {
        try {
            const response = await fetch(`${BASE_URL}/api/groups`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(groupInput)
            });

            const group = await response.json();
            setGroupData(group)
        } catch (error) {
            console.log(error);
        }
    }

    const getGroups = async () => {
        const response = await fetch(`${BASE_URL}/api/groups`);
        const groups = await response.json();
        return groups;
    }

    const getUserGroups = async (userId: string) => {
        let userGroups: GroupType[] = [];
        const groupsData = await getGroups();
        groupsData.map(group => {
            group.users.map(uId => {

                if (uId === userId)
                    userGroups.push(group);
            })
        })
        return userGroups;
    }
    return { saveGroup, getUserGroups, groupData }
}

export default useGroups