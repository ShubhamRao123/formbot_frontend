import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services";
import toast from "react-hot-toast";
import styles from "./register.module.css";

function Register() {
  const navigate = useNavigate();

  const [formdata, setFormdata] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const [formError, setFormError] = useState({
    email: null,
    name: null,
    password: null,
    confirmPassword: null,
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    let errors = false;
    setFormError({
      email: null,
      name: null,
      password: null,
      confirmPassword: null,
    });

    if (
      !formdata.email ||
      formdata.email.length < 1 ||
      !formdata.email.includes("@") ||
      !formdata.email.includes(".")
    ) {
      setFormError((prev) => ({ ...prev, email: "Email is invalid" }));
      errors = true;
    }

    if (!formdata.name || formdata.name.length === 0) {
      setFormError((prev) => ({ ...prev, name: "Name is required" }));
      errors = true;
    }

    if (!formdata.password) {
      setFormError((prev) => ({ ...prev, password: "Password is required" }));
      errors = true;
    }

    if (formdata.password !== formdata.confirmPassword) {
      setFormError((prev) => ({
        ...prev,
        confirmPassword: "enter same password in both fields",
      }));
      errors = true;
    }

    if (errors) {
      return;
    }

    try {
      setLoading(true);
      const response = await register(formdata);
      toast.success(response.message);
      navigate("/login");
    } catch (error) {
      toast.error("An error occurred while creating the account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <img
        className={styles.backArrow}
        src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735196870/arrow_back_uqd1x9.png"
        alt="Back"
        onClick={() => navigate(-1)}
      />
      <img
        className={`${styles.backgroundImage} ${styles.topLeft}`}
        src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735188691/Group_2_vgdmkx.png"
        alt="Top Left Decoration"
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
      <form className={styles.form} onSubmit={handleRegister}>
        <label className={styles.nameLabel} htmlFor="text">
          Username
        </label>
        <input
          type="text"
          value={formdata.name}
          placeholder="Enter a username"
          onChange={(e) => setFormdata({ ...formdata, name: e.target.value })}
        />
        {formError.name && <p className={styles.error}>{formError.name}</p>}

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

        <label className={styles.passwordLabel} htmlFor="Password">
          Password
        </label>
        <input
          type="password"
          value={formdata.password}
          placeholder="Password"
          onChange={(e) =>
            setFormdata({ ...formdata, password: e.target.value })
          }
        />
        {formError.password && (
          <p className={styles.error}>{formError.password}</p>
        )}

        <label
          className={`${styles.confirmpsswdLabel} ${
            formError.confirmPassword ? styles.errorLabel : ""
          }`}
          htmlFor="Password"
        >
          Confirm Password
        </label>
        <input
          type="password"
          value={formdata.confirmPassword}
          placeholder="Confirm Password"
          className={formError.confirmPassword ? styles.errorInput : ""}
          onChange={(e) =>
            setFormdata({ ...formdata, confirmPassword: e.target.value })
          }
        />
        {formError.confirmPassword && (
          <p className={styles.error}>{formError.confirmPassword}</p>
        )}

        <button className={styles.registerBtn} disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
        <p>OR</p>
        <p className={styles.googleLogin}>
          <img
            src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1734956840/Google_Icon_clbkxw.png"
            alt="Google Icon"
          />
          Sign In with Google
        </p>
        <p className={styles.signup}>
          Already have an account ?{" "}
          <span
            className={styles.signupLink}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;
