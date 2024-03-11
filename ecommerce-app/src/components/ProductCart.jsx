import React from 'react'
import ReactStars from "react-rating-stars-component";
import { Link } from 'react-router-dom';

const ProductCart = () => {
    return (
        <div className="col-3">
            <div className="product-card position-relative">
                <div className="wishlist-icon position-absolute">
                    <Link>
                        <img src="images/wish.svg" alt="wishlist" />
                    </Link>
                </div>
                <div className="product-image">
                    <img src="images/tab1.jpg" className='img-fluid' alt="product" />
                    <img src="images/tab.jpg" className='img-fluid' alt="product" />
                </div>
                <div className="product-details">
                    <h6 className="brand">Havels</h6>
                    <h5 className="product-title">
                        Kids Watches bulk 10 pck multi colored
                    </h5>
                    <ReactStars
                        count={5}
                        size={24}
                        value={3}
                        edit={false}
                        activeColor="#ffd700"
                    />
                    <p className="price">$20.000,00</p>
                </div>
                <div className="action-bar position-absolute">
                    <div className="d-flex flex-column gap-15">
                        <Link>
                            <img src="images/prodcompare.svg" alt="prodcompare" />
                        </Link>
                        <Link>
                            <img src="images/view.svg" alt="view" />
                        </Link>
                        <Link>
                            <img src="images/add-cart.svg" alt="addcart" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCart