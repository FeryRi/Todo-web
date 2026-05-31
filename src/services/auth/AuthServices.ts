import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from './Auth';

export const login = async(email: string, password:string)=>{
    const userCredential = await signInWithEmailAndPassword(auth,email,password);
    return await userCredential.user.getIdToken();
};

export const logout=async()=>{
    try{
        await signOut(auth);
        return{success:true};
    } catch{
        return{success:false, error: "No se pudo cerrar sesión"};
    }
};