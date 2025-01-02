// share folder and form services
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const inviteUser = async (type, id, email, inviterId) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/shareWorkspace/invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, id, email, inviterId }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    console.log("Invite successful:", data.message);
  } catch (error) {
    console.error("Error inviting user:", error);
  }
};

export const fetchSharedWorkspaces = async (userId) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/shareWorkspace/${userId}/sharedWorkspaces`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch shared workspaces");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching shared workspaces:", error);
    throw error;
  }
};

export const fetchSharedResources = async (inviterId) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/shareWorkspace/${inviterId}/sharedResources`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch shared resources");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching shared resources:", error);
    throw error;
  }
};
