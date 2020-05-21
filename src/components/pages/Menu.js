import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { FirebaseContext } from '../../firebase'
import Plato from '../ui/Plato'


const Menu = () => {

    const [plates, setPlates] = useState([])

    const { firebase } = useContext(FirebaseContext)

    // Consultar la base de datos al cargar
    useEffect(() => {
        const getPlates = () => {
            firebase.db.collection('products').onSnapshot(handleShanpshot)


        }
        getPlates()
    }, [])

    // handleShanpshot nos permite usar la base de datos en tiempo real de firestore
    const handleShanpshot = snapshot => {
        const plates = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        })

        // Almacenar los resultados en el state
        setPlates(plates)
    }


    return (
        <div>
            <h1 className="text-3xl font-light mb-4"> Menu</h1>
            <Link to="/nuevo-plato" className="bg-blue-800 hover:bg-blue-700, inline-block mb-5 p-2 text-white uppercase font-bold">
                Agregar Plato
            </Link>

            {plates.map(elm => (
                <Plato
                    key={elm.id}
                    plate={elm}
                />
            ))}
        </div>
    )
}

export default Menu
