const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const saveFormSkeleton = async (folderID, formID, data) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${BACKEND_URL}/api/formSkeleton/${folderID}/${formID}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to save form skeleton");
  }

  return await response.json();
};

export const getFormSkeleton = async (folderID, formID) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${BACKEND_URL}/api/formSkeleton/${folderID}/${formID}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch form skeleton");
  }

  return await response.json();
};
