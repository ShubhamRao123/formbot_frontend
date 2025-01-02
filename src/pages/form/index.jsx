import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFormSkeleton } from "../../services/formSkeleton";
import {
  incrementFormOpenCount,
  submitFormResponse,
} from "../../services/index";
import toast from "react-hot-toast";
import styles from "./form.module.css";

function Form() {
  const { folderID, formID } = useParams();
  const [formData, setFormData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [bgColors, setBgColors] = useState({});

  // Increment form open count
  // useEffect(() => {
  //   const formOpenKey = `form_${formID}_open_count`;
  //   const currentCount = parseInt(localStorage.getItem(formOpenKey), 10) || 0;
  //   localStorage.setItem(formOpenKey, currentCount + 1);
  // }, [formID]);

  useEffect(() => {
    const incrementOpenCount = async () => {
      try {
        await incrementFormOpenCount(formID);
      } catch (error) {
        console.error("Failed to increment form open count:", error.message);
      }
    };

    incrementOpenCount();
  }, [formID]);

  // Fetch form skeleton
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await getFormSkeleton(folderID, formID);
        setFormData(response.formSkeleton || {});
        initializeFormValues(response.formSkeleton?.inputs || []);
      } catch (error) {
        setError(error.message || "Failed to load form");
      }
    };

    fetchForm();
  }, [folderID, formID]);

  // Initialize form values

  const initializeFormValues = (inputs) => {
    const initialValues = {};
    const initialBgColors = {};
    inputs.forEach((input) => {
      initialValues[input.name] = ""; // Initialize each input with an empty string
      initialBgColors[input.name] = "#FFFFFF"; // Default background color
    });
    setFormValues(initialValues);
    setBgColors(initialBgColors);
  };

  // Handle input change
  const handleChange = (e, key) => {
    const { value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [key]: value, // Update only the specific input value
    }));
  };

  // Handle form submission
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     await submitFormResponse(formID, formValues);
  //     toast.success("Form submitted successfully!");
  //     // Increment form submit count
  //     const formSubmitKey = `form_${formID}_submit_count`;
  //     const currentCount =
  //       parseInt(localStorage.getItem(formSubmitKey), 10) || 0;
  //     localStorage.setItem(formSubmitKey, currentCount + 1);
  //     setFormValues({}); // Clear form values
  //   } catch (error) {
  //     setError(error.message || "Failed to submit form");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await submitFormResponse(formID, formValues);
      toast.success("Form submitted successfully!");

      // Fetch the updated submit count from the backend
      const updatedSubmitCount = await incrementFormOpenCount(formID);

      // Optionally, log or display the updated count
      console.log(`Updated submit count: ${updatedSubmitCount}`);

      setFormValues({}); // Clear form values
    } catch (error) {
      setError(error.message || "Failed to submit form");
    }
  };

  // Validate rating input (only if applicable)
  const validateRating = (value) => {
    const num = parseInt(value, 10);
    return num >= 1 && num <= 5;
  };

  // Render form or loading/error messages
  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!formData) {
    return <p>Loading...</p>;
  }

  // Handle single input submit
  const handleSingleInputSubmit = async (inputName) => {
    const singleInputValue = formValues[inputName];

    try {
      if (!singleInputValue) {
        alert("Input is empty. Please provide a value before submitting.");
        return;
      }

      await submitFormResponse(formID, { [inputName]: singleInputValue });
      toast.success(`Successfully submitted value for ${inputName}`);

      // Change background color of the input field
      setBgColors((prev) => ({
        ...prev,
        [inputName]: "#FF8E21", // Set the new background color
      }));
    } catch (error) {
      toast.error(`Failed to submit value for ${inputName}: ${error.message}`);
    }
  };
  return (
    <div>
      {/* <h1>{formData.name || "Untitled Form"}</h1> */}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        {formData.inputs.map((input, index) => {
          const inputName = input.name || `input-${index}`;
          switch (input.type) {
            case "Input":
              switch (input.inputType.toLowerCase()) {
                case "text":
                case "number":
                case "email":
                case "phone":
                case "date":
                  return (
                    <div key={inputName} className={styles.inputText}>
                      {/* <label>{input.label || input.inputType}</label> */}
                      <input
                        type={input.inputType.toLowerCase()}
                        name={inputName}
                        placeholder={input.placeholder || input.inputType}
                        value={formValues[inputName] || ""}
                        onChange={(e) => handleChange(e, inputName)}
                        required={input.required}
                      />
                      <div className={styles.sendButton}>
                        <img
                          src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735748291/send_vsbi4s.png"
                          alt=""
                          onClick={() => handleSingleInputSubmit(inputName)}
                        />
                      </div>
                    </div>
                  );
                case "rating":
                  return (
                    <div key={inputName} className={styles.ratings}>
                      {/* <label>{input.label || "Rating (1-5)"}</label> */}
                      <input
                        type="number"
                        name={inputName}
                        placeholder="Enter a rating (1-5)"
                        value={formValues[inputName] || ""}
                        onChange={(e) => {
                          if (validateRating(e.target.value)) {
                            handleChange(e, inputName);
                          } else {
                            alert("Rating must be between 1 and 5");
                          }
                        }}
                        required={input.required}
                      />
                      <img
                        src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735748291/send_vsbi4s.png"
                        alt=""
                        onClick={() => handleSingleInputSubmit(inputName)}
                      />
                    </div>
                  );
                case "button":
                  return (
                    <button
                      className={styles.submitButton}
                      key={inputName}
                      type="submit"
                    >
                      {input.label || "Submit"}
                    </button>
                  );
                default:
                  return (
                    <div key={inputName}>
                      <p>Unsupported input type: {input.inputType}</p>
                    </div>
                  );
              }
            case "BubbleText":
              return (
                <div className={styles.bubbleText} key={index}>
                  <img
                    src="https://res.cloudinary.com/dlmwurg10/image/upload/v1735556185/image_4_ezfuvk.png "
                    alt=""
                  />
                  <p>{input.content || "Text Bubble"}</p>
                </div>
              );
            case "BubbleImage":
              return (
                <div key={index} className={styles.bubbleImage}>
                  {input.imageUrl ? (
                    <img src={input.imageUrl} alt="Bubble" />
                  ) : (
                    <p>Image URL not provided</p>
                  )}
                </div>
              );
            default:
              return null;
          }
        })}
      </form>
    </div>
  );
}

export default Form;
