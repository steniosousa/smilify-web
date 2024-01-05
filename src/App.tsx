import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ECommerce from './pages/Dashboard/ECommerce';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Loader from './common/Loader';
import routes from './routes';
import Swal from 'sweetalert2';
const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  async function firstAcess() {
    await Swal.fire({
      icon: 'info',
      title: "Edite sua conta",
      html:
        '<p>Edite sua senha dentro de 24h para manter a conta ativa</p>',

      showDenyButton: false,
      showCancelButton: false,
      showConfirmButton: true,
      denyButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar'
    })
    navigate("/profile");
  }

  useEffect(() => {
    const hashFromLocalStorage = localStorage.getItem('user');
    const firstAccess = localStorage.getItem("firstAccess");
    if (window.location.pathname != '/auth/signin' && !hashFromLocalStorage) {
      navigate("/auth/signin");
    }
    if (firstAccess) {
      firstAcess()
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
      <Routes>
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
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

    </>
  );
}

export default App;
