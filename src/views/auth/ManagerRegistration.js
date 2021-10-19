import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import { checkToLogin } from "../../api/auth";
import { managerCheckAndUpdate } from "../../api/user";
import { auth } from "../../firebase";

const ManagerRegistration = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [disable, setDisable] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.trim() !== confirmPass.trim())
      toast.error("Passwords don't match");
    else {
      setDisable(true);
      try {
        const checkRes = await managerCheckAndUpdate(email);
        if (checkRes.data) {
          const result = await auth.createUserWithEmailAndPassword(
            email,
            password
          );

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
              setDisable(false);
            });
          setDisable(false);
        } else {
          setDisable(false);
          toast.error("No records found");
        }
      } catch (error) {
        setDisable(false);
        toast.error(
          error.response
            ? error.response.data
            : "Some error occured please try later"
        );
        console.log(error);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Manager registration</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            className="form-control"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email here"
            disabled={disable}
            required
          />
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password here"
            disabled={disable}
            required
          />
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            type="password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            placeholder="Confirm Password"
            disabled={disable}
            required
          />
        </div>
        <button className="btn btn-primary">Set Password And Login</button>
      </form>
    </div>
  );
};

export default ManagerRegistration;
