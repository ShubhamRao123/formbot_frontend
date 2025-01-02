const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const register = async (data) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "An error occurred");
    }

    return response.json();
  } catch (error) {
    console.error("Register API error:", error.message);
    throw error;
  }
};

export const login = async (data) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "An error occurred during login");
    }

    return response.json();
  } catch (error) {
    console.error("Login API error:", error.message);
    throw error;
  }
};

// Update user data
export const updateUser = async (data) => {
  try {
    const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage after login

    if (!token) {
      throw new Error("No token found, please login");
    }

    const response = await fetch(`${BACKEND_URL}/api/user/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "An error occurred during update");
    }

    return response.json(); // Return updated user data or success message
  } catch (error) {
    console.error("Update API error:", error.message);
    throw error;
  }
};

// folder services

export const createFolder = async (data, token) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/fold/folders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create folder");
    }

    return response.json();
  } catch (error) {
    console.error("Create Folder API error:", error.message);
    throw error;
  }
};

export const getFolders = async (token) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/fold/folders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch folders");
    }

    return response.json();
  } catch (error) {
    console.error("Get Folders API error:", error.message);
    throw error;
  }
};

export const deleteFolder = async (folderID, token) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/fold/folders/${folderID}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete folder");
    }

    return response.json();
  } catch (error) {
    console.error("Delete Folder API error:", error.message);
    throw error;
  }
};

// form services

export const createForm = async (folderID, data) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/for/folders/${folderID}/forms`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "An error occurred while creating the form"
      );
    }

    return response.json();
  } catch (error) {
    console.error("Create Form API error:", error.message);
    throw error;
  }
};

export const getForms = async (folderID) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/for/folders/${folderID}/forms`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "An error occurred while fetching forms"
      );
    }

    return response.json();
  } catch (error) {
    console.error("Get Forms API error:", error.message);
    throw error;
  }
};

// specific form services
export const getForm = async (folderID, formID) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/for/folders/${folderID}/forms/${formID}`, // Include folderID in the URL
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "An error occurred while fetching the form"
      );
    }

    return response.json();
  } catch (error) {
    console.error("Get Form API error:", error.message);
    throw error;
  }
};

export const updateFormInputs = async (folderID, formID, inputs, token) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/for/folders/${folderID}/forms/${formID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inputs }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update form inputs");
    }

    return response.json();
  } catch (error) {
    console.error("Update Form API error:", error.message);
    throw error;
  }
};

export const deleteForm = async (formID) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/for/forms/${formID}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "An error occurred while deleting the form"
      );
    }

    return response.json();
  } catch (error) {
    console.error("Delete Form API error:", error.message);
    throw error;
  }
};

// Submit form response
export const submitFormResponse = async (formID, data) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/for/forms/${formID}/submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ data }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "An error occurred while submitting the form"
      );
    }

    return response.json();
  } catch (error) {
    console.error("Submit Form API error:", error.message);
    throw error;
  }
};

// formServices.js

export const getFormResponses = async (folderID, formID) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/for/forms/${formID}/responses`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          "An error occurred while fetching the form responses"
      );
    }

    return response.json();
  } catch (error) {
    console.error("Get Form Responses API error:", error.message);
    throw error;
  }
};

export const incrementFormOpenCount = async (formID) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/for/forms/${formID}/incrementOpenCount`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "An error occurred while incrementing open count"
      );
    }

    return response.json();
  } catch (error) {
    console.error("Increment Open Count API error:", error.message);
    throw error;
  }
};

export const getFormStats = async (formID) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/for/forms/${formID}/stats`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch form stats");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching form stats:", error.message);
    throw error;
  }
};
