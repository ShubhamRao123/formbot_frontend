import React, { useState } from "react";
import styles from "./login.module.css";
import { login } from "../../services";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formdata, setFormdata] = useState({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState({
    email: null,
    password: null,
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    let errors = false;
    setFormError({
      email: null,
      password: null,
    });

    if (
      !formdata.email ||
      formdata.email.length < 1 ||
      !formdata.email.includes("@") ||
      !formdata.email.includes(".")
    ) {
      setFormError((prev) => ({
        ...prev,
        email: "Email is invalid",
      }));
      errors = true;
    }

    if (!formdata.password) {
      setFormError((prev) => ({
        ...prev,
        password: "Password is required",
      }));
      errors = true;
    }

    if (errors) return;

    try {
      setLoading(true);
      const response = await login(formdata);
      toast.success(response.message);
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("userId", response.id);
        localStorage.setItem("username", response.name);
        localStorage.setItem("userEmail", response.email);
        navigate("/workspace");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Back Arrow */}
      <img
        className={styles.backArrow}
        src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735196870/arrow_back_uqd1x9.png"
        alt="Back"
        onClick={() => navigate(-1)}
      />

      {/* Decorative Background Images */}
      <img
        className={`${styles.backgroundImage} ${styles.topLeft}`}
        src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735188691/Group_2_vgdmkx.png"
        alt="Top Right Decoration"
      />
      <img
        className={`${styles.backgroundImage} ${styles.topRight}`}
        src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735188691/Ellipse_2_enaizf.png"
        alt="Top Right Decoration"
      />
      <img
        className={`${styles.backgroundImage} ${styles.bottomLeft}`}
        src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735188691/Ellipse_1_lijqaw.png"
        alt="Bottom Left Decoration"
      />

      <form className={styles.form}>
        <label className={styles.emailLabel} htmlFor="Email">
          Email
        </label>
        <input
          type="text"
          value={formdata.email}
          placeholder="Enter your email"
          onChange={(e) => setFormdata({ ...formdata, email: e.target.value })}
        />
        {formError.email && <p className={styles.error}>{formError.email}</p>}

        <label className={styles.psswdLabel} htmlFor="Password">
          Password
        </label>
        <input
          type="password"
          value={formdata.password}
          placeholder="**********"
          onChange={(e) =>
            setFormdata({ ...formdata, password: e.target.value })
          }
        />
        {formError.password && (
          <p className={styles.error}>{formError.password}</p>
        )}

        <p
          className={styles.loginBtn}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Logging In..." : "Log In"}
        </p>
        <p>OR</p>
        <p className={styles.googleLogin}>
          <img
            src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1734956840/Google_Icon_clbkxw.png"
            alt="Google Icon"
          />
          Sign In with Google
        </p>
        <p className={styles.signup}>
          Don't have an account?{" "}
          <span
            className={styles.signupLink}
            onClick={() => navigate("/register")}
          >
            Register now
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
