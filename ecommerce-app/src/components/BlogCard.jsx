import React from 'react'
import { Link } from 'react-router-dom'

const BlogCard = () => {
  return (
    <div className='col-3'>
        <div className="blog-card">
            <div className="card-img">
                <img src="images/blog-1.jpg" className='img-fluid' alt="blog" />
            </div>
            <div className="blog-content">
                <p className='date'>10 Marzo, 2024</p>
                <h5 className='title'>Buena nueva</h5>
                <p className='desc'>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
                    Error distinctio, omnis vel at recusandae repudiandae voluptates. 
                    Optio, ab nobis recusandae adipisci quam placeat tempore atque saepe enim
                     sunt quisquam delectus?
                </p>
                <Link to="/" className='button'>Ver</Link>
            </div>
        </div>
    </div>
  )
}

export default BlogCard