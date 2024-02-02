import { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import Swal from 'sweetalert2';
import Api from '../../service/api';

export default function FormElements() {
  const [name, setName] = useState('')
  const [cost, setCost] = useState('')
  const webToken = localStorage.getItem('webToken')
  async function registerService() {
    try {
      await Api.post('/service/create', {
        data: {
          name, cost
        },
        headers: {
          Authorization: webToken
        }
      })
      setName('')
      setCost('')
      await Swal.fire({
        icon: 'success',
        title: `Criação do serviço ${name} criado com sucesso`,
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
      <Breadcrumb pageName="Cadastrar serviços" />
      <div className="flex justify-center items-center ">
        <div className="w-2/3 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          {/* <!-- Input Fields --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Cadastro de Serviços
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Serviço:
                </label>
                <input
                  onChange={(i) => setName(i.target.value)}
                  type="text"
                  placeholder={name}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Valor do serviço:
                </label>
                <input
                  onChange={(i) => setCost(i.target.value)}
                  type='text'
                  placeholder={cost}
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input"
                />
              </div>

              <button type="button" className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray" onClick={registerService}>
                Criar
              </button>
            </div>
          </div>




        </div>
      </div>
    </>
  );
};

