import React, { useContext, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FirebaseContext } from '../../firebase'
import { useNavigate } from 'react-router-dom'
import FileUploader from 'react-firebase-file-uploader'

const NuevoPlato = () => {

    // State de las imagenes
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [urlImage, setUrlImage] = useState('')

    // Context con las operaciones de firebase
    const { firebase } = useContext(FirebaseContext)

    // Hook para redireccionar
    const navigate = useNavigate()

    // validacion y leer los datos del form
    const formik = useFormik({
        initialValues: {
            name: '',
            price: '',
            category: '',
            image: '',
            description: '',
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(3, 'Los platos deben tener al menos 3 caracteres')
                .required('El nombre del plato es obligatorio'),
            price: Yup.number()
                .min(1, 'Debes agregar un número')
                .required('El precio es obligatorio'),
            category: Yup.string()
                .required('La categoria es obligatoria'),
            description: Yup.string()
                .min(10, 'La descripción debe de ser más larga')
                .required('La descripcion es obligatoria'),
        }),

        onSubmit: plate => {
            try {
                plate.exist = true
                plate.image = urlImage
                firebase.db.collection('products').add(plate)

                // Redireccion
                navigate('/menu')
            } catch (error) {
                console.log(error)
            }
        }
    })
    // Imagenes
    const handleUploadStart = () => {
        setProgress(0)
        setUploading(true)

    }

    const handleUploadError = error => {
        setUploading(false)
        console.log(error)
    }

    const handleUploadSuccess = async name => {
        setProgress(100)
        setUploading(false)

        // Almacenar la URL de destino
        const url = await firebase
            .storage
            .ref("products")
            .child(name)
            .getDownloadURL()

        setUrlImage(url)
    }


    const handleProgress = progress => {
        setProgress(progress)
        console.log(progress)

    }
    return (
        <div>
            <h1 className="text-3xl font-light mb-4"> Agregar Plato</h1>

            <div className="flex justify-center mt-10">
                <div className="w-full max-w-3xl">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Nombre</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="name"
                                type="text"
                                placeholder="Nombre Plato"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.name && formik.errors.name ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
                                <p className="font-bold">Hubo un error</p>
                                <p>{formik.errors.name}</p>
                            </div>
                        ) : null}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Precio</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="price"
                                type="number"
                                placeholder="20€"
                                min="0"
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}

                            />
                        </div>

                        {formik.touched.price && formik.errors.price ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
                                <p className="font-bold">Hubo un error</p>
                                <p>{formik.errors.price}</p>
                            </div>
                        ) : null}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">Categoria</label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="price"
                                name="category"
                                value={formik.values.category}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}

                            >
                                <option value="">--Seleccione--</option>
                                <option value="breakfast">Desayuno</option>
                                <option value="lunch">Comida</option>
                                <option value="dinner">Cena</option>
                                <option value="drinks">Bebidas</option>
                                <option value="dessert">Postre</option>
                                <option value="salads">Ensaladas</option>
                            </select>

                        </div>

                        {formik.touched.category && formik.errors.category ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
                                <p className="font-bold">Hubo un error</p>
                                <p>{formik.errors.category}</p>
                            </div>
                        ) : null}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">Imagen</label>
                            <FileUploader
                                accept="image/*"
                                id="image"
                                name="image"
                                randomizeFilename
                                storageRef={firebase.storage.ref("products")}
                                onUploadStart={handleUploadStart}
                                onUploadError={handleUploadError}
                                onUploadSuccess={handleUploadSuccess}
                                onProgress={handleProgress}
                            />
                        </div>

                        {uploading && (
                            <div className="h-12 relative w-full border">
                                <div className="bg-green-500 absolute lef-0 top-0 text-white px-2 text-sm h-12 flex items-center" style={{ width: `${progress}%` }}>
                                    {progress} %
                                </div>
                            </div>
                        )}

                        {urlImage && (
                            <p className="bg-green-500 text-white p-3 text-center my-5">
                                La imagen se subió correctamente
                            </p>
                        )}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Descripcion</label>
                            <textarea
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-40"
                                id="description"
                                placeholder="Descripcion del plato"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                            </textarea>
                        </div>

                        {formik.touched.description && formik.errors.description ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
                                <p className="font-bold">Hubo un error</p>
                                <p>{formik.errors.description}</p>
                            </div>
                        ) : null}

                        <input
                            type="submit"
                            className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold"
                            value="Agregar Plato"
                        />
                    </form>
                </div>
            </div>

        </div>
    )
}

export default NuevoPlato
