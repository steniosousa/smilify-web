import { Suspense, lazy, useContext, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ECommerce from './pages/Dashboard/ECommerce';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Loader from './common/Loader';
import routes from './routes';
import AuthContext from './contexto/AuthContext';
import Api from './service/api';
const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { signed, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const webToken = localStorage.getItem('webToken')
    const role = localStorage.getItem('role')
    
    if (webToken) {
      Api.defaults.headers.Authorization = webToken
      setUser({ webToken, role })
    } else {
      navigate('/auth/signin')
    }

    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerClassName="overflow-auto"
      />
      {!signed ? (
        <Routes>
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />
        </Routes>
      ) : (
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route index element={<ECommerce />} />
            {routes.map((routes, index) => {
              const { path, component: Component } = routes;
              return (
                <Route
                  key={index}
                  path={path}
                  element={
                    <Suspense fallback={<Loader />}>
                      <Component />
                    </Suspense>
                  }
                />
              );
            })}
          </Route>
        </Routes>
      )}
    </>
  );
}

export default App;
