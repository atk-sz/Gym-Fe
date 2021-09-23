import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ForgotPassword = ({ history }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (user && user.token) {
      history.push("/");
    }
  }, [history, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const config = {
      url: process.env.REACT_APP_PASSWORD_RESET_REDIRECT_URL,
      handleCodeInApp: true,
    };

    await auth
      .sendPasswordResetEmail(email, config)
      .then(() => {
        setEmail("");
        setLoading(false);
        toast.success(
          `Email is sent to ${email}, Click the link to reset password`
        );
      })

      .catch((error) => {
        console.log(error);
        setLoading(false);
        toast.error(error.message);
      });
  };

  return (
    <div className="login-register">
      <div className="row w-100">
        <div className="col-md-4">
          <div className="form-head text-center">
            <h3 className="mb-2">Forgot Password</h3>
            <span>Enter your email</span>
          </div>
          <div className="form-area  text-center">
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                className="form-control mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                autoFocus
              />
              <button
                className="btn btn-primary"
                type="submit"
                disabled={!email}
              >
                Send Link
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
