import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    //AuthProvider envielve a AppRouter porque 
    // AppRouter contiene los componentes que necesitan el contexto
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App
