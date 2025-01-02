import React, { useState } from "react";
import styles from "./setting.module.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../services/index"; // Import the updateUser function

function Setting() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));

  // State for form inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Handle form submission for updating user info

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const data = {
        name: username,
        email,
        oldPassword, // Include old password
        newPassword: newPassword, // New password to be updated
      };

      const response = await updateUser(data); // Call the API

      // Update local storage and state with the new token if provided
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("userId", response.id);
        localStorage.setItem("username", response.name);
        localStorage.setItem("userEmail", response.email);
        setToken(response.token); // Update state to trigger re-fetch
      }

      toast.success("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error.message);
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logging out...");
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <h2>Settings</h2>
      <form className={styles.form} onSubmit={handleUpdate}>
        {/* Username Input */}
        <div className={styles.inputContainer}>
          <img
            src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735386752/Frame_1036_huvxsr.png"
            alt="Icon"
            className={styles.inputIcon}
          />
          <input
            type="text"
            placeholder="Enter a username"
            className={styles.inputWithIcon}
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update state
          />
        </div>

        {/* Email Input */}
        <div className={styles.inputContainer}>
          <img
            src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735386752/lock_tedbre.png"
            alt="Icon"
            className={styles.inputIcon}
          />
          <input
            type="text"
            placeholder="Enter your email"
            className={styles.inputWithIcon}
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update state
          />
          <img
            src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735387914/Group_paawne.png"
            alt=""
            className={styles.inputIcon2}
          />
        </div>

        {/* Old Password Input */}
        <div className={styles.inputContainer}>
          <img
            src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735386752/lock_tedbre.png"
            alt="Icon"
            className={styles.inputIcon}
          />
          <input
            type="password"
            placeholder="Old Password"
            className={styles.inputWithIcon}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)} // Update state
          />
          <img
            src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735387914/Group_paawne.png"
            alt=""
            className={styles.inputIcon2}
          />
        </div>

        {/* New Password Input */}
        <div className={styles.inputContainer}>
          <img
            src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735386752/lock_tedbre.png"
            alt="Icon"
            className={styles.inputIcon}
          />
          <input
            type="password"
            placeholder="New Password"
            className={styles.inputWithIcon}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)} // Update state
          />
          <img
            src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735387914/Group_paawne.png"
            alt=""
            className={styles.inputIcon2}
          />
        </div>

        {/* Update Button */}
        <button className={styles.registerBtn} type="submit">
          Update
        </button>
      </form>

      {/* Logout Button */}
      <img
        src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735388629/Frame_6_lnev10.png"
        className={styles.imageLogout}
        alt="Logout"
        onClick={handleLogout}
      />
    </div>
  );
}

export default Setting;
