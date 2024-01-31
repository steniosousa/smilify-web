import { createContext, useState } from "react";
import Api from "../service/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

interface AuthContextData {
  signed: boolean;
  user: object | null;
  Login(): Promise<void>;
  Logout(): null
}


const AuthContext = createContext<AuthContextData>({} as AuthContextData);
export const AuthProvider: any = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  async function Login() {
    try {
      const { data } = await Api.post('/login', {
        email: 'steniosousaf@gmail.com',
        password: '1029qpwo$',
      });
      if (data.firstAccess) {
        localStorage.setItem("user", data.webToken);
        localStorage.setItem("firstAccess", data.firstAccess);
        navigate('/profile')
        return
      }
      setUser(data);
      localStorage.setItem("webToken", data);
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
    <AuthContext.Provider value={{ signed: Boolean(user), user, Login, Logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;