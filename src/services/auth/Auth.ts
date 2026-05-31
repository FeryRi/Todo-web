import { getAuth } from "firebase/auth";
import { app } from "./Firebase";
export const auth=getAuth(app);