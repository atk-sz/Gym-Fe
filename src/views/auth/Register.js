import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { sendRegistrationLink } from "../../api/registration";
import { useSelector } from "react-redux";

const Register = ({ history }) => {
  const [email, setEmail] = useState("");
  const [disable, setDisable] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (user && user.token) {
      history.push("/");
    }
  }, [history, user]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisable(true);
    sendRegistrationLink(email)
      .then((res) => {
        toast.success(res.data);
        setEmail("");
        history.push("/");
      })
      .catch((err) => {
        setDisable(false);
        console.log(err);
        toast.error(
          err.response
            ? err.response.data
            : "Some error has occurred please try later"
        );
      });
  };

  return (
    <div className="login-register">
      <div className="row w-100">
        <div className="col-md-4">
          <div className="form-head text-center">
            <h3 className="mb-2">Register</h3>
            <span>Enter your email</span>
          </div>
          <div className="form-area">
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={handleEmailChange}
                placeholder="Your email"
                required
                autoFocus
                disabled={disable}
                aria-describedby="registrationHelp"
              />
              <div id="registrationHelp" className="form-text">
                A registration link will be sent to this email id
              </div>
              <button
                disabled={disable}
                type="submit"
                className="btn btn-dark float-end"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
