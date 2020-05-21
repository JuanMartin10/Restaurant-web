import React, { useContext, useRef } from 'react'
import { FirebaseContext } from '../../firebase'

const Plato = ({ plate }) => {

    // Existencia ref para acceder al valor directamente
    const existRef = useRef(plate.exist)

    // Context de firebase para cambios en la base de datos
    const { firebase } = useContext(FirebaseContext)

    const { id, name, image, exist, category, price, description } = plate

    // Modificar la existencia del plato en firebase
    const updateAvailable = () => {
        const exist = (existRef.current.value === "true")

        console.log(exist)

        try {
            firebase.db.collection('products')
                .doc(id)
                .update({
                    exist
                })
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <div className="w-full px-3 mb-4">
            <div className="p-5 shadow-md bg-white">
                <div className="lg:flex">
                    <div className="lg:w-5/12 xl:w-3/12">
                        <img src={image} alt="Imagen plato"></img>

                        <div className="sm:flex sm:-mx-2 pl-2">
                            <label className="block mt-5 sm:w-2/4">
                                <span className="block text-gray-800 mb-2">Existencia</span>

                                <select
                                    className=" bg-white shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    value={exist}
                                    ref={existRef}
                                    onChange={() => updateAvailable()}
                                >
                                    <option value="true">Disponible</option>
                                    <option value="false">No Disponible</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    <div className="lg:w-7/12 xl:w-9/12 pl-5">
                        <p className="font-bold text-2xl text-yellow-600 mb-4">{name}</p>
                        <p className="text-gray-600 mb-4">Categoria:
                            <span className="text-gray-700 font-bold"> {category.toUpperCase()}</span>
                        </p>
                        <p className="text-gray-600 mb-4">{description}</p>
                        <p className="text-gray-600 mb-4">Precio:
                            <span className="text-gray-700 font-bold"> {price} €</span>
                        </p>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Plato
