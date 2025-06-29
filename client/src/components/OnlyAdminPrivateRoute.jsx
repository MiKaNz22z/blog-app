import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function OnlyAdminPrivateRoute() {
    const { currentUser } = useSelector((state) => state.user)
    return currentUser && currentUser.isAdmin ? <Outlet /> : <Navigate to='/sign-in'/>
}

export function OnlyAuthorPrivateRoute() {
    const { currentUser } = useSelector((state) => state.user)
    return currentUser && (currentUser.isAdmin || currentUser.isAuthor) ? <Outlet /> : <Navigate to='/sign-in'/>
}
