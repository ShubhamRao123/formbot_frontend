import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFormResponses, getFormStats } from "../../services/index"; // Assuming the response fetching service
import styles from "./response.module.css";
import { useNavigate } from "react-router-dom";
import PieChart from "../../compoent/pieChart/pieChart";

function Response() {
  const { folderID, formID } = useParams(); // Get folderID and formID from the URL params
  const [responses, setResponses] = useState([]);
  const [openCount, setOpenCount] = useState(0);
  const [submitCount, setSubmitCount] = useState(0);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("light");
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await getFormResponses(folderID, formID);
        setResponses(response.responses || []); // Assuming the response object contains 'responses' key
      } catch (error) {
        setError(error.message || "Failed to fetch form responses");
      }
    };

    fetchResponses();
  }, [folderID, formID]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getFormStats(formID);
        setOpenCount(stats.openCount);
        setSubmitCount(stats.submitCount);
      } catch (error) {
        setError(error.message || "Failed to fetch form stats");
      }
    };

    fetchStats();
  }, [formID]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  const handleNavigateToForm = (folderID, formID, formName) => {
    navigate(`/workspace/${folderID}/forms/${formID}`, { state: { formName } });
  };

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Toggle Theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Retrieve counts from localStorage
  // const formOpenKey = `form_${formID}_open_count`;
  // const formSubmitKey = `form_${formID}_submit_count`;
  // const openCount = parseInt(localStorage.getItem(formOpenKey), 10) || 0;
  // const submitCount = parseInt(localStorage.getItem(formSubmitKey), 10) || 0;
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {/* <h1>{formName}</h1> */}
        <div className={styles.headerButtons}>
          <p
            className={styles.headerButtonSave}
            // onClick={handleSave}
            // disabled={saving}
          >
            Save
          </p>
          <p
            className={styles.headerButtonShare}
            // onClick={handleShare}
          >
            Share
          </p>
          <img
            className={styles.headerButtonCancel}
            src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735383967/close_lfnbsx.png"
            alt=""
            onClick={() => navigate("/workspace")}
          />
        </div>
        <p
          className={styles.headerButtonResponse}
          // onClick={() => navigate(`/response/${folderID}/${formID}`)}
        >
          Response
        </p>
        <p className={styles.headerButtonFlow} onClick={() => navigate(-1)}>
          Flow
        </p>
        <span className={styles.themeTextDark}>Dark </span>

        <button
          className={`${styles.toggleBtn} ${toggle ? styles.toggle : ""}`}
          onClick={() => {
            setToggle(!toggle);
            toggleTheme();
          }}
        >
          <div
            className={`${styles.thumb} ${toggle ? styles.thumbActive : ""}`}
          ></div>
        </button>
        <span className={styles.themeTextLight}>Light </span>
      </header>
      <hr className={styles.separator1} />
      <div className={styles.stats}>
        <div className={styles.stats1}>
          <p>Views</p>
          <p>{openCount}</p>
        </div>
        <div className={styles.stats2}>
          <p>Starts </p>
          <p>{submitCount}</p>
        </div>
      </div>
      <div className={styles.responseSection}>
        {responses.length === 0 ? (
          <p>No Response yet collected</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Response</th>
                <th>Submitted At</th>
                {/* Dynamically generate table headers */}
                {responses
                  .reduce((headers, response) => {
                    const keys = Object.keys(response.data).filter(
                      (key) =>
                        key !== "undefined" && key !== "_id" && key !== ""
                    );
                    return [...new Set([...headers, ...keys])]; // Merge unique keys
                  }, [])
                  .map((key, idx) => (
                    <th key={idx}>{key}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {responses.map((response, index) => {
                const keys = responses.reduce((headers, resp) => {
                  const dataKeys = Object.keys(resp.data).filter(
                    (key) => key !== "undefined" && key !== "_id" && key !== ""
                  );
                  return [...new Set([...headers, ...dataKeys])];
                }, []);

                return (
                  <tr key={response._id || index}>
                    <td>{index + 1}</td>
                    <td>{new Date(response.submittedAt).toLocaleString()}</td>
                    {keys.map((key, idx) => (
                      <td key={idx}>{response.data[key] || "N/A"}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <div className={styles.footer}>
        <div className={styles.PieChart}>
          <PieChart openCount={openCount} submitCount={submitCount} />
        </div>
        <div className={styles.completionRate}>
          <p>Completion Rate </p>
          <p>
            {(openCount > 0 ? (submitCount / openCount) * 100 : 0).toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}

export default Response;
