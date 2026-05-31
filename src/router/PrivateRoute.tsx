import { Navigate,Outlet } from "react-router-dom";

export default function PrivateRoute(){
    const token=localStorage.getItem('userToken');

    // Si no hay token, manda al login
    if(!token){
        return <Navigate to='/login' replace/>;
    }

    // De lo contrario, renderiza la ruta solicitada
    return <Outlet /> 
}