import React from 'react'
import { Link } from 'react-router-dom'
import FooterData from "./FooterData"
function FooterLastNews() {
  return (
          <div>
          <h4 className=" mt-3 mb-5 ms-4">Last News</h4>
              {FooterData.map(({ src, title, date }) => <React.Fragment key={title}>
                  <div className="d-flex mb-2 ms-4">
                      <div className="w-25 mt-2">
                          <img src={'/'+src} alt={title} className="w-100  rounded" />
                      </div>
                      <div className="ms-3">
                          <p className="d-block mb-1">{title}</p>
                          <p className='text-muted'>{date}</p>
                      </div>
                  </div>
              </React.Fragment>)}
              <div className="ms-5">
                  <Link to={"/blog"} className="blogLink">view all blogs</Link>
              </div>
          </div>
  )
}

export default FooterLastNews