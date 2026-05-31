import{ BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import{About, Home, Search, Tasks} from '../pages';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Lists from '../pages/Lists/Lists';
import PrivateRoute from './PrivateRoute';


export default function AppRouter() {
    return (
        //utiliza barra de busqueda y dom para direccionar a las paginas
        //simula estar en diferentes paginas sin recargar la pagina
        <BrowserRouter>
            <Routes>
                {/* Rutas públicas */}
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />

                {/* Rutas protegidas */}
                <Route element={<PrivateRoute />}>
                    <Route path='/' element={<Home/>} />
                    <Route path='/about' element={<About/>} />
                    <Route path='/search' element={<Search/>} />
                    <Route path='/lists/:id' element={<Lists/>}/>
                    <Route path='/tasks/:id' element={<Tasks/>} />
                </Route>

                {/*Cualquier ruta desconocida va a home */}
                <Route path='*' element={<Navigate to = '/' replace/>} />
            </Routes>  
        </BrowserRouter>
    );
}