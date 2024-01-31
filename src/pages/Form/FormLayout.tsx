import { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function FormLayout() {
  const [room, setRoom] = useState('')
  const [email, setEmail] = useState('')

  async function registerDentist() {
    if (room === '' || email === "") {
      await Swal.fire({
        icon: 'warning',
        title: "Preencha todos os campos",
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
      return
    }
    const key = localStorage.getItem('webToken')
    try {
      const roomInInt = parseInt(room)
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:3333/create/dentist',
        headers: {
          'Authorization': key
        },
        data: {
          room: roomInInt,
          email
        }
      };

      await axios.request(config)
      setRoom('')
      setEmail('')
      await Swal.fire({
        icon: 'success',
        title: "Criação bem sucedida",
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
    } catch (error: any) {
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

  return (
    <>
      <Breadcrumb pageName="Cadastrar dentista" />

      <div className="flex justify-center items-center ">

        <div className=" w-2/3 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Informações do profissional
            </h3>
          </div>
          <form action="#">
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Email
                </label>
                <input
                  onChange={(i) => setEmail(i.target.value)}
                  type="email"
                  placeholder="Informe o endereço de email do profissional"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Nº da Sala
                </label>
                <input
                  onChange={(i) => setRoom(i.target.value)}
                  type="text"
                  placeholder="Informe a sala do dentista"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
              <button type="button" className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray" onClick={registerDentist}>
                Criar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

