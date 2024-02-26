import React from 'react'
import { Link } from 'react-router-dom';
import { BsGithub, BsLinkedin, BsInstagram } from "react-icons/bs";


const Footer = () => {
  return (
    <>
      <footer className="py-4">
        <div className="container-xxl">
          <div className="row align-items-center">
            <div className="col-5">
              <div className="footer-top-data d-flex gap-30 align-items-center">
                <img src="images/newsletter.png" alt="newsletter" />
                <h2 className="mb-0 text-white">
                  Suscribete al boletin de noticias
                </h2>
              </div>
            </div>

            <div className="col-7">
              <div className="input-group">
                <input type="text" className="form-control py-1"
                  placeholder="Your Email" aria-label="Your Email"
                  aria-describedby="basic-addon2" />

                <span className="input-group-text p-2" id="basic-addon2">
                  Suscribete
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <footer className="py-4">
        <div className="container-xxl">
          <div className="row">
            <div className="col-4">
              <h4 className="text-white mb-4">Contactanos</h4>
              <div>
                <address className='text-white fs-6'>
                  Av 34 Villa Quien, <br /> Cualquier Lugar del Mundo <br />
                </address>
                <a className='mt-3 d-block mb-1 text-white' href="+541128797435">+54 1128797435</a>
                <a className='mt-2 d-block mb-0 text-white' href="gg@store.com">gg@store.com</a>

                <div className="social_icons d-flex align-items-center gap-30 mt-4">
                  <Link href="" className="text-white" >
                    <BsGithub className='fs-5' />
                  </Link>
                  <Link href="" className="text-white" >
                    <BsLinkedin className='fs-5' />
                  </Link>
                  <Link href="" className="text-white" >
                    <BsInstagram className='fs-5' />
                  </Link>

                </div>
              </div>
            </div>
            <div className="col-3">
              <h4 className="text-white mb-4">Informacion</h4>
              <div className="footer-link d-flex flex-column">
                <Link className='text-white py-2 mb-1'>Privacy Policy</Link>
                <Link className='text-white py-2 mb-1'>Refund Policy</Link>
                <Link className='text-white py-2 mb-1'>Shipping Policy</Link>
                <Link className='text-white py-2 mb-1'>Terms of Service</Link>
                <Link className='text-white py-2 mb-1'>Blogs</Link>
              </div>
            </div>
            <div className="col-3">
              <h4 className="text-white mb-4">Cuenta</h4>
              <div className="footer-link d-flex flex-column">
                <Link className='text-white py-2 mb-1'>Sobre Nosotros</Link>
                <Link className='text-white py-2 mb-1'>Faq</Link>
                <Link className='text-white py-2 mb-1'>Contact</Link>
              </div>
            </div>
            <div className="col-2">
              <h4 className="text-white mb-4">Enlaces Rapidos</h4>
              <div className="footer-link d-flex flex-column">
                <Link className='text-white py-2 mb-1'>Laptop</Link>
                <Link className='text-white py-2 mb-1'>Auricular</Link>
                <Link className='text-white py-2 mb-1'>Tablet</Link>
                <Link className='text-white py-2 mb-1'>Reloj</Link>
                <Link className='text-white py-2 mb-1'>Telefonos</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <footer className="py-4">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <p className="text-center mb-0 text-white">
                Copyright &copy; {new Date().getFullYear()} Gilberto Gutierrez
              </p>
            </div>
          </div>
        </div>
      </footer>

    </>
  )
}

export default Footer