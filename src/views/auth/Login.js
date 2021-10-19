import React, { useState, useEffect } from "react";
import { auth, googleAuthProvider } from "../../firebase";
import { toast } from "react-toastify";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { checkToLogin } from "../../api/auth";
import "./styles/loginRegister.css";

const Login = ({ history }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState(
    "kdaly@baamboys.com/s.sharpe909@gmail.com"
  );
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    // Intended (Re-direct back to page from where login was requested)
    const intended = history.location.state;

    if (intended) {
      return;
    } else {
      if (user && user.token && user.role == "super-admin") {
        history.push("/super-admin/dashboard");
      } else if (user && user.token) {
        history.push("/admin/dashboard");
      }
    }
  }, [history, user]);

  const roleBasedRedirect = (res) => {
    // Intended (Re-direct back to page from where login was requested)
    const intended = history.location.state;
    if (intended) {
      history.push(intended.from);
    } else {
      if (res.data.role === "admin" || res.data.role === "manager")
        history.push("/admin/dashboard");
      else if (res.data.role === "super-admin")
        history.push("/super-admin/dashboard");
      else history.push("/user/dashboard");
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);

      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();

      checkToLogin(idTokenResult.token)
        .then((res) => {
          dispatch({
            type: "LOGGED_IN_USER",
            payload: {
              name: res.data.name,
              email: res.data.email,
              role: res.data.role,
              token: idTokenResult.token,
              _id: res.data._id,
            },
          });
          roleBasedRedirect(res);
        })
        .catch((err) => {
          toast.error(
            err.response
              ? err.response.data
              : "Some error occured please try later"
          );
          console.log(err);
          setLoading(false);
        });
    } catch (error) {
      toast.error(error.message);
      console.log(error);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    auth
      .signInWithPopup(googleAuthProvider)
      .then(async (result) => {
        const { user } = result;
        const idTokenResult = await user.getIdTokenResult();

        checkToLogin(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: res.data.name,
                email: res.data.email,
                role: res.data.role,
                token: idTokenResult.token,
                _id: res.data._id,
              },
            });
            roleBasedRedirect(res);
          })
          .catch((err) => {
            toast.error(
              err.response
                ? err.response.data
                : "Some error occured please try later"
            );
            console.log(err);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="login-register">
      <div className="row w-100">
        <div className="col-md-4">
          <div className="form-head text-center">
            <h3 className="mb-2">Login Account</h3>
            <span>Enter your email and password</span>
          </div>
          <div className="form-area">
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-4">
                <input
                  type="email"
                  className="form-control shadow-sm"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Your email"
                  autoFocus
                />
              </div>
              <div className="form-group mb-4">
                <input
                  type="password"
                  className="form-control shadow-sm"
                  value={password}
                  onChange={handlePassword}
                  placeholder="Your Password"
                />
              </div>
              <div className="form-footer">
                <Link to="/forgot/password" className="float-right">
                  Forgot password
                </Link>
                <Button
                  onClick={handleSubmit}
                  type="primary"
                  // icon={<MailOutlined />}
                  size="large"
                  disabled={!email || password.length < 6}
                >
                  Login
                </Button>
                <Button
                  onClick={(e) => e.preventDefault()}
                  type="primary"
                  size="large"
                >
                  <Link to="/register" className="float-right">
                    Registor
                  </Link>
                </Button>
                {/* <Button
                onClick={handleGoogleLogin}
                type="danger"
                className="mb-5"
                block
                shape="round"
                icon={<GoogleOutlined />}
                size="large"
              >
                Login with Google
              </Button> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
