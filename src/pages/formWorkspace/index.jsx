import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "./formWorkspace.module.css";
import { saveFormSkeleton } from "../../services/formSkeleton";

function FormWorkspace() {
  const { folderID, formID } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation(); // Access the state passed during navigation
  const [formElements, setFormElements] = useState([]);
  const [formName, setFormName] = useState(state?.formName || "Untitled Form");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("light");
  const [toggle, setToggle] = useState(false);

  const handleShare = () => {
    const shareLink = `${window.location.origin}/form/${folderID}/${formID}`;
    console.log(window.location.origin);
    navigator.clipboard.writeText(shareLink);
    alert(`Link copied to clipboard: ${shareLink}`);
  };

  // const handleShare = () => {
  //   const protocol = window.location.protocol;
  //   const shareLink = `${protocol}//${window.location.host}/form/${folderID}/${formID}`;
  //   console.log(shareLink);
  //   navigator.clipboard.writeText(shareLink);
  //   alert(`Link copied to clipboard: ${shareLink}`);
  // };

  const handleDragStart = (e, element) => {
    e.dataTransfer.setData("element", JSON.stringify(element));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const element = JSON.parse(e.dataTransfer.getData("element"));
    if (element.type === "Input") {
      setFormElements([
        ...formElements,
        { ...element, label: "", placeholder: "" },
      ]);
    } else if (
      element.type === "BubbleText" ||
      element.type === "BubbleImage"
    ) {
      setFormElements([...formElements, { ...element }]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDelete = (index) => {
    const updatedElements = formElements.filter((_, i) => i !== index);
    setFormElements(updatedElements);
  };

  const handleUpdateElement = (index, updatedProperties) => {
    setFormElements((prevElements) =>
      prevElements.map((element, i) =>
        i === index ? { ...element, ...updatedProperties } : element
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        folderID,
        formID,
        name: formName,
        inputs: formElements,
      };
      await saveFormSkeleton(folderID, formID, payload);
      alert("Form skeleton saved successfully!");
    } catch (err) {
      alert(`Failed to save form skeleton: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

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

  const imageSrc =
    theme === "light"
      ? "https://res.cloudinary.com/dfrujgo0i/image/upload/v1735473163/delete_qd5eax.png"
      : "https://res.cloudinary.com/dfrujgo0i/image/upload/v1735530742/delete_1_z45njx.png";

  return (
    <div className={styles.container}>
      {/* Theme Toggle Button */}
      <header className={styles.header}>
        <h1>{formName}</h1>
        <div className={styles.headerButtons}>
          <p
            className={styles.headerButtonSave}
            onClick={handleSave}
            disabled={saving}
          >
            Save
          </p>
          <p className={styles.headerButtonShare} onClick={handleShare}>
            Share
          </p>
          <img
            className={styles.headerButtonCancel}
            src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735383967/close_lfnbsx.png"
            alt=""
          />
        </div>
        <p
          className={styles.headerButtonResponse}
          onClick={() => navigate(`/response/${folderID}/${formID}`)}
        >
          Response
        </p>
        <p
          className={styles.headerButtonFlow}
          onClick={() => navigate(`/response/${folderID}/${formID}`)}
        >
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
      <div className={styles.workspace}>
        {/* Left Panel: Draggable Elements */}
        <div className={styles.leftPanel}>
          <h2 className={styles.bubbleHeading}>Bubbles</h2>
          <div className={styles.gridContainer1}>
            <div
              className={styles.draggable}
              draggable
              onDragStart={(e) =>
                handleDragStart(e, { type: "BubbleText", content: "" })
              }
            >
              <img
                src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735468535/SVG_10_ubn07d.png"
                alt=""
              />
              Text
            </div>
            <div
              className={styles.draggable}
              draggable
              onDragStart={(e) =>
                handleDragStart(e, { type: "BubbleImage", imageUrl: "" })
              }
            >
              <img
                src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735468535/SVG_11_ndbkau.png"
                alt=""
              />
              Image
            </div>
            <div className={styles.draggable1}>
              <img
                src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735468535/SVG_12_xprzdg.png"
                alt=""
              />
              Video
            </div>
            <div className={styles.draggable2}>
              <img
                src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735468535/Container_gpetxb.png"
                alt=""
              />
              GIF
            </div>
          </div>
          <h2 className={styles.inputsHeading}>Inputs</h2>
          <div className={styles.gridContainer}>
            {[
              // "Text",
              {
                type: "Text",
                img: "https://res.cloudinary.com/dfrujgo0i/image/upload/v1735467312/SVG_3_krki9u.png",
              },
              // "Number",
              // "Email",
              // "Phone",
              // "Date",
              // "Rating",
              // "Button",
              {
                type: "Number",
                img: "https://res.cloudinary.com/dfrujgo0i/image/upload/v1735467449/SVG_4_jejyel.png",
              },
              {
                type: "Email",
                img: "https://res.cloudinary.com/dfrujgo0i/image/upload/v1735467449/SVG_5_fu9qpt.png",
              },
              {
                type: "Phone",
                img: "https://res.cloudinary.com/dfrujgo0i/image/upload/v1735467449/SVG_6_z2xevz.png",
              },
              {
                type: "Date",
                img: "https://res.cloudinary.com/dfrujgo0i/image/upload/v1735467448/SVG_7_ehppxv.png",
              },
              {
                type: "Rating",
                img: "https://res.cloudinary.com/dfrujgo0i/image/upload/v1735467449/SVG_8_qfsi4v.png",
              },
              {
                type: "Button",
                img: "https://res.cloudinary.com/dfrujgo0i/image/upload/v1735467448/SVG_9_mib1sd.png",
              },
            ].map(({ type, img }) => (
              <div
                key={type}
                className={styles.draggable}
                draggable
                onDragStart={(e) =>
                  handleDragStart(e, { type: "Input", inputType: type })
                }
              >
                <img src={img} alt={`${type} icon`} className={styles.icon} />
                {type}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Dropped Elements */}
        <div
          className={styles.rightPanel}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className={styles.formArea}>
            <div className={styles.formStart}>
              <img
                src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735470948/Vector_2_sz45gr.png"
                alt=""
              />
              <p>Start</p>
            </div>
            {formElements.map((element, index) => (
              <div key={index} className={styles.formElement}>
                {element.type === "Input" ? (
                  element.inputType.toLowerCase() === "button" ? (
                    <div className={styles.bubbleText}>
                      <p>{element.placeholder || element.inputType}</p>
                      <button>{element.placeholder || "Submit"}</button>
                    </div>
                  ) : (
                    <div className={styles.bubbleText}>
                      <p>{element.placeholder || element.inputType}</p>
                      <input
                        type={element.inputType.toLowerCase()}
                        placeholder={element.placeholder || element.inputType}
                      />
                    </div>
                  )
                ) : element.type === "BubbleText" ? (
                  <div className={styles.bubbleText}>
                    <p>Bubble Text</p>
                    <input
                      type="text"
                      value={element.content}
                      onChange={(e) =>
                        handleUpdateElement(index, { content: e.target.value })
                      }
                      placeholder="Enter text for the bubble"
                    />
                  </div>
                ) : element.type === "BubbleImage" ? (
                  <div className={styles.bubbleText}>
                    <p>Image</p>
                    <input
                      type="text"
                      value={element.imageUrl}
                      onChange={(e) =>
                        handleUpdateElement(index, { imageUrl: e.target.value })
                      }
                      placeholder="Enter image URL"
                    />
                    {/* {element.imageUrl && (
                    <img src={element.imageUrl} alt="Bubble" />
                  )} */}
                  </div>
                ) : null}
                <img
                  src={imageSrc}
                  className={styles.deleteButton}
                  onClick={() => handleDelete(index)}
                ></img>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormWorkspace;
