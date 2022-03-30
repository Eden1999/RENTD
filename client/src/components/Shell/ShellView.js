import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from '../../helpers/routes/ProtectedRoute';
import routes from '../../helpers/routes/routes';
import ShellAppBar from './AppBar/ShellAppBar';

function ShellView() {
    return (
        <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-zinc-800">
                <ShellAppBar />
                    <Routes>
                        { routes.map((route) => {
                            return (
                                <Route key={route.path} path='' element={<ProtectedRoute allowedUserType={route.allowed}/>}>
                                    <Route path={route.path} element={route.Component}/>
                                </Route>
                            )
                        })}
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
            </div>
        </BrowserRouter>
    );
}

export default ShellView;