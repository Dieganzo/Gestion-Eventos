import React from 'react';
import { Link } from 'react-router-dom';

function ListaEventos({eventos, alEditar, alEliminar, esAdmin}) {
  return (
    <div className="lista-eventos">
      {eventos.map((evento) => (
        <article className="tarjeta-evento" key={evento.id}>
          <div className="evento-cabecera">
            <div className="evento-icono">
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
            d="M8 2.75V4.5M16 2.75V4.5M4 9H20M5.5 20.5H18.5C19.3284 20.5 20 19.8284 20 19V6C20 5.17157 19.3284 4.5 18.5 4.5H5.5C4.67157 4.5 4 5.17157 4 6V19C4 19.8284 4.67157 20.5 5.5 20.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            />
            <path
            d="M7.98438 12.75H7.99437M7.98438 16.75H7.99437M11.9941 12.75H12.0041M11.9941 16.75H12.0041M16.0039 12.75H16.0139M16.0039 16.75H16.0139"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            />
            </svg>
            </div>

            <div>
              <h3>{evento.nombre}</h3>
              <p>{evento.descripcion || 'Sin descripción'}</p>
            </div>
          </div>

          <div className="evento-acciones">
           <Link
             className="boton-ver-evento"
            to={`/eventos/${evento.id}`}
            >
             Ver evento <span>›</span>
            </Link>

            {esAdmin && (
            <button
            className="boton-icono"
            type="button"
            onClick={() => alEditar(evento)}
            title="Editar evento"
            >
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                >
                <path
                    d="M19.3028 3.7801C18.4241 2.90142 16.9995 2.90142 16.1208 3.7801L14.3498 5.5511C14.3442 5.55633 14.3387 5.56166 14.3333 5.5671C14.3279 5.57253 14.3225 5.57803 14.3173 5.58359L5.83373 14.0672C5.57259 14.3283 5.37974 14.6497 5.27221 15.003L4.05205 19.0121C3.9714 19.2771 4.04336 19.565 4.23922 19.7608C4.43508 19.9567 4.72294 20.0287 4.98792 19.948L8.99703 18.7279C9.35035 18.6203 9.67176 18.4275 9.93291 18.1663L20.22 7.87928C21.0986 7.0006 21.0986 5.57598 20.22 4.6973L19.3028 3.7801ZM14.8639 7.15833L6.89439 15.1278C6.80735 15.2149 6.74306 15.322 6.70722 15.4398L5.8965 18.1036L8.56029 17.2928C8.67806 17.257 8.7852 17.1927 8.87225 17.1057L16.8417 9.13619L14.8639 7.15833ZM17.9024 8.07553L19.1593 6.81862C19.4522 6.52572 19.4522 6.05085 19.1593 5.75796L18.2421 4.84076C17.9492 4.54787 17.4743 4.54787 17.1814 4.84076L15.9245 6.09767L17.9024 8.07553Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                />
            </svg>
            </button>
            )}

            {esAdmin && (
            <button
            className="boton-icono"
            type="button"
            onClick={() => alEliminar(evento)}
            title="Eliminar evento"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                >
                <path
                    d="M14.7223 12.7585C14.7426 12.3448 14.4237 11.9929 14.01 11.9726C13.5963 11.9522 13.2444 12.2711 13.2241 12.6848L12.9999 17.2415C12.9796 17.6552 13.2985 18.0071 13.7122 18.0274C14.1259 18.0478 14.4778 17.7289 14.4981 17.3152L14.7223 12.7585Z"
                    fill="currentColor"
                />
                <path
                    d="M9.98802 11.9726C9.5743 11.9929 9.25542 12.3448 9.27577 12.7585L9.49993 17.3152C9.52028 17.7289 9.87216 18.0478 10.2859 18.0274C10.6996 18.0071 11.0185 17.6552 10.9981 17.2415L10.774 12.6848C10.7536 12.2711 10.4017 11.9522 9.98802 11.9726Z"
                    fill="currentColor"
                />
                <path
                    d="M10.249 2C9.00638 2 7.99902 3.00736 7.99902 4.25V5H5.5C4.25736 5 3.25 6.00736 3.25 7.25C3.25 8.28958 3.95503 9.16449 4.91303 9.42267L5.54076 19.8848C5.61205 21.0729 6.59642 22 7.78672 22H16.2113C17.4016 22 18.386 21.0729 18.4573 19.8848L19.085 9.42267C20.043 9.16449 20.748 8.28958 20.748 7.25C20.748 6.00736 19.7407 5 18.498 5H15.999V4.25C15.999 3.00736 14.9917 2 13.749 2H10.249ZM14.499 5V4.25C14.499 3.83579 14.1632 3.5 13.749 3.5H10.249C9.83481 3.5 9.49902 3.83579 9.49902 4.25V5H14.499ZM5.5 6.5C5.08579 6.5 4.75 6.83579 4.75 7.25C4.75 7.66421 5.08579 8 5.5 8H18.498C18.9123 8 19.248 7.66421 19.248 7.25C19.248 6.83579 18.9123 6.5 18.498 6.5H5.5ZM6.42037 9.5H17.5777L16.96 19.7949C16.9362 20.191 16.6081 20.5 16.2113 20.5H7.78672C7.38995 20.5 7.06183 20.191 7.03807 19.7949L6.42037 9.5Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                />
                </svg>
            </button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

export default ListaEventos;