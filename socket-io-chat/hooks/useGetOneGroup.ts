import { useEffect, useState } from "react";
import { GroupType } from "./useGroups";

const useGetOneGroup = (groupId: string) => {
    const [groupData, setGroup] = useState<GroupType>();
    const [error, setError] = useState("");
    useEffect(() => {
        console.log("Hello world");
        fetch("http://localhost:5000/api/groups/" + groupId)
            .then((response) => response.json())
            .then(data => setGroup((prev) => data))
            .catch(error => error instanceof Error && setError(error.message));
    }, []);

    return { groupData, error };
}

export default useGetOneGroup;