import { createContext,useState,useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({children}) {
    const [user,setUser] = useState(null);
    const [cargando,setCargando] = useState(true);
    

    const apiUrl = import.meta.env.VITE_API_URL;
    const meUrl = `${apiUrl}/auth/me`;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            setCargando(false);
            return;
        }

        fetch(meUrl,{
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => (res.ok ? res.json(): null))
        .then(user => {
            setUser({
                token: token,
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
                first_name: user.first_name,
                last_name: user.last_name,
                birth_date: user.birth_date,
                country: user.country,
                verified: user.verified
            });
            setCargando(false);
        })
        .catch(() => setCargando(false));
    },[])

    return (
        <UserContext.Provider value={{user,setUser,cargando}}>
            {children}
        </UserContext.Provider>
    )
}