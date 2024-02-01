import { createContext, useState } from "react";
import Api from "../service/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

interface AuthContextData {
  signed: boolean;
  user: string | null;
  Login(credentials: { email: string; password: string }): Promise<void>;
  Logout(): null;
  setUser: any
}


const AuthContext = createContext<AuthContextData>({} as AuthContextData);
export const AuthProvider: any = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  async function Login({ email, password }: { email: string, password: string }) {
    try {
      const { data } = await Api.post('/login', {
        email,
        password,
      });
      setUser(data);

      if (data.firstAccess) {
        localStorage.setItem("webToken", data.webToken);
        localStorage.setItem("firstAccess", data.firstAccess);
        navigate('/profile')
        return
      }
      localStorage.setItem("webToken", data);
      Api.defaults.headers.Authorization = data
      navigate('/')
    }
    catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: error.response.data,
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
    }
  }

  function Logout() {
    localStorage.clear();
    setUser(null);
    navigate('/auth/signin')
    return null
  }

  return (
    <AuthContext.Provider value={{ signed: Boolean(user), user, setUser, Login, Logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;