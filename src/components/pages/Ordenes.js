import React, { useEffect, useState, useContext } from 'react'
import { FirebaseContext } from '../../firebase'
import Orden from '../ui/Orden'

const Ordenes = () => {

    //context con las operaciones de firebase
    const { firebase } = useContext(FirebaseContext)

    const [ordenes, setOrdenes] = useState([])
    useEffect(() => {
        const obtenerOrdenes = () => {
            firebase.db.collection('ordenes').where('completado', '==', false).onSnapshot(handleSnapshot)
        }
        obtenerOrdenes()
    }, [])

    function handleSnapshot(snapshot) {
        const ordenes = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        })
        setOrdenes(ordenes)
    }

    return (
        <div>
            <h1 className="text-3xl font-light mb-4">Ordeness</h1>
            <div className="sm:flex sm:flex-wrap -mx-3">
                {ordenes.map(orden => (
                    <Orden
                        key={orden.id}
                        orden={orden}
                    />
                ))}
            </div>
        </div>
    )
}

export default Ordenes
