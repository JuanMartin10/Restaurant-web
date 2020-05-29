import React, { useState, useEffect } from 'react'
import { FirebaseContext } from '../../firebase'
import { findAllByPlaceholderText } from '@testing-library/react'

const Orden = ({ orden }) => {

    const [tiempoentrega, guardarTiempoEntrega] = useState(0)

    // Context de firebase
    const { firebase } = useContext(FirebaseContext)
    const definirTiempo = id => {
        try {
            firebase.db.collection('ordenes')
                .doc(id)
                .update({
                    tiempoentrega
                })
        } catch (error) {
            console.log(error)
        }
    }
    const completarOrden = id => {
        try {
            firebase.db.collection('ordenes')
                .doc(id)
                .update(
                    { completado: true }
                )
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="sm:w-1/2 lg:w-1/3 px-2 mb-4">
            <div className="p-3 shadow-md bg-white">
                <h1 className="text-yellow-600 text-lg font-bold">
                </h1>
                {orden.orden.map(plato => (
                    <p className="text-gray-600">{plato.cantidad} {plato.nombre}</p>
                ))}
                <p className="text-gray-700 font-bold"> TOTAL A PAGAR: {orden.total}</p>

                {orden.tiempoentrega === 0 && (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Tiempo de entrega
                        </label>
                        <input
                            type="number"
                            className="shadow apparance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            min="1"
                            max='20'
                            placeholder="20"
                            value={tiempoentrega}
                            onChange={e => guardarTiempoEntrega(parseInt(e.target.value))}
                        />
                        <button
                            onClick={() => definirTiempo(orden.id)}
                            type="submit"
                            className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold"
                        >
                            Definir tiempo
                        </button>
                    </div>
                )}

                {!orden.completado && orden.tiempoentrega > 0(
                    <Button
                        type="button"
                        className="bg-blue-800 hover:bg-blue-700 w-full mt-5 p-2 text-white uppercase font-bold"
                        onClick={() => completarOrden(orden.id)}
                    >Marcar como lista</Button>
                )}

                {orden.tiempoentrega > 0 && (
                    <p className="text-gray-700">Tiempo de entrega:
                        <span className="font-bold">{orden.tiempoentrega} minutos</span>
                    </p>
                )}
            </div>
        </div>
    )
}

export default Orden
