import React from "react";
import { Link } from "react-router-dom";

let imgs = [
    "https://sccnhub.com/images/easyblog_articles/316/b2ap3_large_Cattura_il_Sole.jpg",
];
 

export default function LandingPage() {
  return (
    <div className="container-fluid landing-page">
      <div className="row h-100 align-items-center">
        <div className="col-lg-6 col-md-8 mx-auto">
          <div className="d-flex align-items-start">
            <img src={imgs[0]} alt="Renewable Energy" className="img-fluid me-1" />
            <div>
              <div className="card">
                <div className="card-body">
                  <h1 className="card-title mb-4">Welcome to the Renewable Energy Community</h1>
                  <p className="card-text">
                    Join our community of renewable energy enthusiasts and make a positive impact on the environment.
                  </p>
                  <div className="text-center">
                    <Link to="/login" className="btn btn-success me-3">Login</Link>
                    <Link to="/register" className="btn btn-success">Register</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
