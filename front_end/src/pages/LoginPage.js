import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  localStorage.setItem("authenticated", false);
  
  
  const navigate = useNavigate();

  const logInUser = () => {
    if (email.length === 0) {
      alert("Please enter a valid email!");
    } else if (password.length === 0) {
      alert("Password cannot be blank!");
    } else {
      axios.post('http://127.0.0.1:8001/api/login/', {
        email: email,
        password: password
      })
        .then(function (response) {
          localStorage.setItem("authenticated", true);
          console.log(response);
          console.log(response.data);
          navigate("/home", { state: { userData: response.data } });
        })
        .catch(function (error) {
          localStorage.setItem("authenticated", false);
          console.log(error, 'error');
          if (error.response && error.response.status === 401) {
            alert("Invalid credentials");
          }
        });
    }
  }

  let imgs = [
    "https://sccnhub.com/images/easyblog_articles/316/b2ap3_large_Cattura_il_Sole.jpg",
  ];

  return (
    <div>
      <div className="container h-100">
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-9 col-lg-6 col-xl-5">
              <img src={imgs[0]} className="img-fluid" alt="background" />
            </div>
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <form>
                <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                  <p className="lead fw-normal mb-0 me-3">Log Into Your Account</p>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="form3Example3"
                    className="form-control form-control-lg"
                    placeholder="Enter a valid email address"
                  />
                  <label className="form-label" htmlFor="form3Example3">Email address</label>
                </div>

                <div className="form-outline mb-3">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="form3Example4"
                    className="form-control form-control-lg"
                    placeholder="Enter password"
                  />
                  <label className="form-label" htmlFor="form3Example4">Password</label>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <div className="form-check mb-0">
                    <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
                    <label className="form-check-label" htmlFor="form2Example3">
                      Remember me
                    </label>
                  </div>
                  <a href="#!" className="text-body">Forgot password?</a>
                </div>

                <div className="text-center text-lg-start mt-4 pt-2">
                  <button type="button" className="btn btn-primary btn-lg" onClick={logInUser}>Login</button>
                  <p className="small fw-bold mt-2 pt-1 mb-0">Don't have an account? <a href="/register" className="link-danger">Register</a></p>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
