import React from 'react'
import { Link } from 'react-router-dom';
import Marquee from "react-fast-marquee"
import BlogCard from '../components/BlogCard';
import ProductCart from '../components/ProductCart';
import SpecialProduct from '../components/SpecialProduct';

const Home = () => {
  return (
    <>
      <section className="home-wrapper-1 py-5">
        <div className="container-xxl">
          <div className="row">
            <div className="col-6">
              <div className="main-banner position-relative ">
                <img src="images/main-banner-1.jpg" alt="main banner" className="img-fluid rounded-3" />
                <div className="main-banner-content position-absolute">
                  <h4>SUPERCHARGED FOR PROS.</h4>
                  <h5>iPad S13+ Pro.</h5>
                  <p>Desde $9999.00 or $400/mo.</p>
                  <Link className='button'>OBTENLO YA</Link>
                </div>
              </div>
            </div>

            <div className="col-6">
              <div className="d-flex flex-wrap gap-10 justify-content-between align-items-center">
                <div className="small-banner position-relative ">
                  <img src="images/catbanner-01.jpg" alt="main banner" className="img-fluid rounded-3" />

                  <div className="small-banner-content position-absolute">
                    <h4>BEST SAKE.</h4>
                    <h5>iPad S13+ Pro.</h5>
                    <p>Desde $9999.00 <br /> or $400/mo.</p>

                  </div>
                </div>

                <div className="small-banner position-relative ">
                  <img src="images/catbanner-02.jpg" alt="main banner" className="img-fluid rounded-3" />

                  <div className="small-banner-content position-absolute">
                    <h4>NEW ARRIBAL.</h4>
                    <h5>iPad S13+ Pro.</h5>
                    <p>Desde $9999.00 <br /> or $400/mo.</p>

                  </div>
                </div>

                <div className="small-banner position-relative">
                  <img src="images/catbanner-03.jpg" alt="main banner" className="img-fluid rounded-3" />

                  <div className="small-banner-content position-absolute">
                    <h4>NEW ARRIBAL.</h4>
                    <h5>iPad S13+ Pro.</h5>
                    <p>Desde $9999.00 <br /> or $400/mo.</p>

                  </div>
                </div>

                <div className="small-banner position-relative ">
                  <img src="images/catbanner-04.jpg" alt="main banner" className="img-fluid rounded-3" />

                  <div className="small-banner-content position-absolute">
                    <h4>NEW ARRIBAL.</h4>
                    <h5>iPad S13+ Pro.</h5>
                    <p>Desde $9999.00 <br /> or $400/mo.</p>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-wrapper-2 py-5">
        <div className="container-xxl">
          <div className="col-12">
            <div className="servies d-flex align-items-center justify-content-between">
              <div className='d-flex align-items-center gap-15'>
                <img src="images/service.png" alt="services" />
                <div>
                  <h6>Envio Gratis</h6>
                  <p className='mb-0'>Para compras mayores a $10000</p>
                </div>
              </div>
              <div className='d-flex align-items-center gap-15'>
                <img src="images/service-02.png" alt="services" />
                <div>
                  <h6>Ofertas de regalo</h6>
                  <p className='mb-0'>Hasta un 25% de descuento</p>
                </div>
              </div>
              <div className='d-flex align-items-center gap-15'>
                <img src="images/service-03.png" alt="services" />
                <div>
                  <h6>Soporte</h6>
                  <p className='mb-0'>Asesores de venta</p>
                </div>
              </div>
              <div className='d-flex align-items-center gap-15'>
                <img src="images/service-04.png" alt="services" />
                <div>
                  <h6>Precios accesibles</h6>
                  <p className='mb-0'>Precios de Fabrica</p>
                </div>
              </div>
              <div className='d-flex align-items-center gap-15'>
                <img src="images/service-05.png" alt="services" />
                <div>
                  <h6>Secure Payments</h6>
                  <p className='mb-0'>100% Protected Payment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-wrapper-2 py-5">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="categories d-flex  justify-content-between flex-wrap align-items-center">
                <div className="d-flex gap align-items-center">
                  <div>
                    <h6>Camaras</h6>
                    <p>10 Items</p>
                  </div>
                  <img src="images/camera.jpg" alt="camera" />
                </div>
                <div className="d-flex gap align-items-center">
                  <div>
                    <h6>Smart Tv</h6>
                    <p>10 Items</p>
                  </div>
                  <img src="images/tv.jpg" alt="camera" />
                </div>
                <div className="d-flex gap align-items-center">
                  <div>
                    <h6>Smart Watches</h6>
                    <p>10 Items</p>
                  </div>
                  <img src="images/headphone.jpg" alt="camera" />
                </div>
                <div className="d-flex gap align-items-center">
                  <div>
                    <h6>Gaming</h6>
                    <p>10 Items</p>
                  </div>
                  <img src="images/camera.jpg" alt="camera" />
                </div>
                <div className="d-flex gap align-items-center">
                  <div>
                    <h6>Camaras</h6>
                    <p>10 Items</p>
                  </div>
                  <img src="images/camera.jpg" alt="camera" />
                </div>
                <div className="d-flex gap align-items-center">
                  <div>
                    <h6>Smart Tv</h6>
                    <p>10 Items</p>
                  </div>
                  <img src="images/tv.jpg" alt="camera" />
                </div>
                <div className="d-flex gap align-items-center">
                  <div>
                    <h6>Smart Watches</h6>
                    <p>10 Items</p>
                  </div>
                  <img src="images/headphone.jpg" alt="camera" />
                </div>
                <div className="d-flex gap align-items-center">
                  <div>
                    <h6>Gaming</h6>
                    <p>10 Items</p>
                  </div>
                  <img src="images/camera.jpg" alt="camera" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-">
              <h3 className="section-heading">Destacados</h3>
            </div>
            <ProductCart />
            <ProductCart />
            <ProductCart />
            <ProductCart />
          </div>
        </div>
      </section>

      <section className="famous-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-3">
              <div className="famous-card bg-dark">
                <h5>Big Screen</h5>
                <h6>Smart Watch Series 7</h6>
                <p>From $20000 or $2000/mo. for 12 mo.*</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="special-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h3 className="section-heading">Productos Especiales</h3>
            </div>
          </div>
          <div className="row">
            <SpecialProduct />
            <SpecialProduct />
            <SpecialProduct />
          </div>
        </div>
      </section>

      <section className="popular-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-">
              <h3 className="section-heading">Populares</h3>
            </div>
          </div>
          <div className="row">
            <ProductCart />
            <ProductCart />
            <ProductCart />
            <ProductCart />
          </div>
        </div>
      </section>

      <section className="marque-wrapper py-5">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="marquee-inner-wrapper card-wrapper">
                <Marquee className='d-flex'>
                  <div className='mx-4 w-25'>
                    <img src="images/brand-01.png" alt="brand" />
                  </div>
                  <div className='mx-4 w-25'>
                    <img src="images/brand-02.png" alt="brand" />
                  </div>
                  <div className='mx-4 w-25'>
                    <img src="images/brand-03.png" alt="brand" />
                  </div>
                  <div className='mx-4 w-25'>
                    <img src="images/brand-04.png" alt="brand" />
                  </div>
                  <div className='mx-4 w-25'>
                    <img src="images/brand-05.png" alt="brand" />
                  </div>
                  <div className='mx-4 w-25'>
                    <img src="images/brand-06.png" alt="brand" />
                  </div>
                  <div className='mx-4 w-25'>
                    <img src="images/brand-07.png" alt="brand" />
                  </div>
                  <div className='mx-4 w-25'>
                    <img src="images/brand-08.png" alt="brand" />
                  </div>
                </Marquee>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-">
              <h3 className="section-heading">Ultimas Novedades</h3>
            </div>
            <BlogCard />
            <BlogCard />
            <BlogCard />
            <BlogCard />
          </div>
        </div>
      </section>
    </>
  )
}

export default Home