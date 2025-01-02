// // // RS

import React, { useState, useEffect } from "react";
import {
  createFolder,
  getFolders,
  deleteFolder,
  createForm,
  getForms,
  deleteForm,
} from "../../services/index";
// import {
//   fetchSharedResources,
//   shareWorkspace,
// } from "../../services/shareWorkspace";
import {
  fetchSharedResources,
  fetchSharedWorkspaces,
  inviteUser,
} from "../../services/shareWorkspace";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import styles from "./workspace.module.css";

function Workspace() {
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedFolderID, setSelectedFolderID] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [formName, setFormName] = useState("");
  const [folders, setFolders] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const username = localStorage.getItem("username") || "User";
  const [activeFolderID, setActiveFolderID] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);
  const [isFolderDeleteModalOpen, setIsFolderDeleteModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [theme, setTheme] = useState("light");
  const [toggle, setToggle] = useState(false);

  const navigate = useNavigate();

  //share workspace
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareType, setShareType] = useState(null);
  const [shareID, setShareID] = useState(null);
  const [sharedUsers, setSharedUsers] = useState([]);
  const [sharedWorkspaces, setSharedWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [selectedInviterId, setSelectedInviterId] = useState(null);

  useEffect(() => {
    const fetchFoldersWithForms = async () => {
      try {
        const token = localStorage.getItem("token");
        const { folders: fetchedFolders } = await getFolders(token);

        const foldersWithForms = await Promise.all(
          fetchedFolders.map(async (folder) => {
            const { forms } = await getForms(folder._id);
            return { ...folder, forms };
          })
        );

        setFolders(foldersWithForms);
      } catch (error) {
        console.error("Failed to fetch folders or forms:", error.message);
        toast.error("Failed to fetch folders or forms");
      }
    };

    fetchFoldersWithForms();
  }, []);

  const handleCreateFolder = async () => {
    try {
      const token = localStorage.getItem("token");
      const { folder: newFolder } = await createFolder(
        { name: folderName },
        token
      );
      setFolders((prevFolders) => [
        ...prevFolders,
        { ...newFolder, forms: [] },
      ]);
      toast.success("Folder created successfully!");
      setIsFolderModalOpen(false);
      setFolderName("");
    } catch (error) {
      console.error("Failed to create folder:", error.message);
      toast.error("Failed to create folder");
    }
  };

  const handleDeleteFolder = async (folderID) => {
    try {
      const token = localStorage.getItem("token");
      await deleteFolder(folderID, token);
      setFolders((prevFolders) =>
        prevFolders.filter((folder) => folder._id !== folderID)
      );
      toast.success("Folder deleted successfully!");
    } catch (error) {
      console.error("Failed to delete folder:", error.message);
      toast.error("Failed to delete folder");
    }
  };

  const handleCreateForm = async () => {
    try {
      const token = localStorage.getItem("token");
      const { form } = await createForm(selectedFolderID, { name: formName });
      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder._id === selectedFolderID
            ? { ...folder, forms: [...folder.forms, form] }
            : folder
        )
      );
      toast.success("Form created successfully!");
      setIsFormModalOpen(false);
      setFormName("");
      setSelectedFolderID(null);
    } catch (error) {
      console.error("Failed to create form:", error.message);
      toast.error("Failed to create form");
    }
  };

  const handleDeleteForm = async (formID, folderID) => {
    try {
      const token = localStorage.getItem("token");
      await deleteForm(formID, token);
      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder._id === folderID
            ? {
                ...folder,
                forms: folder.forms.filter((form) => form._id !== formID),
              }
            : folder
        )
      );
      toast.success("Form deleted successfully!");
    } catch (error) {
      console.error("Failed to delete form:", error.message);
      toast.error("Failed to delete form");
    }
  };

  const openDeleteModal = (formID, folderID) => {
    setFormToDelete({ formID, folderID });
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setFormToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDeleteForm = async () => {
    if (formToDelete) {
      const { formID, folderID } = formToDelete;
      await handleDeleteForm(formID, folderID); // Call the existing delete function
      closeDeleteModal();
    }
  };

  const openFolderDeleteModal = (folderID) => {
    setFolderToDelete(folderID);
    setIsFolderDeleteModalOpen(true);
  };

  const closeFolderDeleteModal = () => {
    setFolderToDelete(null);
    setIsFolderDeleteModalOpen(false);
  };

  const confirmDeleteFolder = async () => {
    if (folderToDelete) {
      await handleDeleteFolder(folderToDelete); // Call existing delete folder function
      closeFolderDeleteModal();
    }
  };

  const openShareModal = (type, id) => {
    setShareType(type);
    setShareID(id);
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setShareEmail("");
  };

  const handleNavigateToForm = (folderID, formID, formName) => {
    navigate(`/workspace/${folderID}/forms/${formID}`, { state: { formName } });
  };

  const navigateToFormWorkspace = (folderID, formID, formName) => {
    navigate(`/workspace/${folderID}/forms/${formID}`, { state: { formName } });
  };

  const handleFolderClick = (folderID) => {
    setActiveFolderID((prevID) => (prevID === folderID ? null : folderID));
  };

  // const toggleDropdown = () => {
  //   setIsDropdownOpen((prev) => !prev);
  //   if (!isDropdownOpen) {
  //     fetchSharedUsers();
  //   }
  // };
  const toggleDropdown = async () => {
    setIsDropdownOpen((prev) => !prev);

    if (!isDropdownOpen) {
      try {
        const response = await fetchSharedWorkspaces(
          localStorage.getItem("userId")
        );
        setSharedWorkspaces(response);
      } catch (error) {
        console.error("Error fetching shared workspaces:", error);
      }
    }
  };
  // Handle Sending Invite
  const handleSendInvite = async () => {
    if (!shareEmail) {
      alert("Please enter a valid email address.");
      return;
    }

    const inviterId = localStorage.getItem("userId"); // Assuming inviter's ID is stored in localStorage
    try {
      await inviteUser(shareType, shareID, shareEmail, inviterId);
      alert(`Invite sent successfully to ${shareEmail}`);
      closeShareModal();
    } catch (error) {
      console.error("Error sending invite:", error);
      alert("Failed to send invite. Please try again.");
    }
  };

  useEffect(() => {
    const getSharedWorkspaces = async () => {
      try {
        const response = await fetchSharedWorkspaces(
          localStorage.getItem("userId")
        );
        setSharedWorkspaces(response);
      } catch (error) {
        console.error("Error fetching shared workspaces:", error);
      }
    };

    getSharedWorkspaces();
  }, []);

  // fetch the folder and form of inviter
  const handleViewSharedWorkspace = async (inviterId, inviterName) => {
    try {
      const { folders, forms } = await fetchSharedResources(inviterId);

      setSelectedWorkspace({ inviterName, folders, forms });
      setSelectedInviterId(inviterId);
    } catch (error) {
      console.error("Error viewing shared workspace:", error);
      alert("Unable to view shared resources.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logging out...");

    navigate("/");
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

  return (
    <div className={styles.workspace}>
      <header className={styles.workspaceHeader}>
        <div className={styles.usernameDropdown}>
          <div className={styles.dropdown} onClick={toggleDropdown}>
            <p
              className={styles.dropdownButton}
              onClick={() => setSelectedWorkspace(null)}
            >
              {username}'s Workspace
              <img
                src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735212132/SVG_gmgnx1.png"
                alt=""
              />
              {isDropdownOpen && (
                <div
                  className={`${styles.dropdownMenu} ${
                    isDropdownOpen ? styles.open : ""
                  }`}
                >
                  <div
                    className={styles.dropdownItem}
                    onClick={() => navigate("/setting")}
                  >
                    Settings
                  </div>
                  <hr className={styles.separator} />
                  <div
                    className={styles.dropdownItemLogout}
                    onClick={handleLogout}
                  >
                    Logout
                  </div>
                  <hr className={styles.separator} />

                  <ul>
                    <div className={styles.sharedUsers}>
                      {sharedWorkspaces.map((workspace, index) => (
                        <li key={workspace._id}>
                          <span
                            onClick={() =>
                              handleViewSharedWorkspace(
                                // workspace.inviterId,
                                workspace.inviterId._id,
                                workspace.inviterName
                              )
                            }
                          >
                            {workspace.inviterName}
                          </span>
                          {index < sharedWorkspaces.length - 1 && (
                            <hr className={styles.separatorShareUser} />
                          )}
                        </li>
                      ))}
                    </div>
                  </ul>
                </div>
              )}
            </p>
          </div>
        </div>

        {/* Theme Toggle Button */}

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

        <div className={styles.headerActions}>
          <img
            className={styles.shareButton}
            src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735211518/Vector_gry4fh.png"
            alt="Share Workspace"
            onClick={() => openShareModal("folder", activeFolderID)} // Assuming you want to share the active folder
          />
        </div>
      </header>
      {isShareModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContentShare}>
            {/* <h3>Share {shareType === "folder" ? "Folder" : "Form"}</h3> */}
            <img
              src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735383967/close_lfnbsx.png"
              alt=""
              onClick={closeShareModal}
            />
            <h3>Invite by Email</h3>
            <input
              type="email"
              placeholder="Enter email to invite"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className={styles.input}
            />

            <div className={styles.selectWrapper}>
              <select className={styles.select}>
                <option value="Edit">Edit</option>
                <option value="View">View</option>
              </select>
            </div>

            <div>
              <button
                className={styles.shareEmailButton}
                onClick={handleSendInvite}
              >
                Send Invite
              </button>
            </div>
            <h3>Invite by Link</h3>
            <div>
              <button className={styles.copyEmailButton}>Copy Link</button>
            </div>
          </div>
        </div>
      )}

      <hr className={styles.separator1} />

      <p
        className={styles.createFolderButton}
        onClick={() => setIsFolderModalOpen(true)}
      >
        <img
          src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735214459/SVG_1_mxcliq.png"
          alt=""
        />
        Create Folder
      </p>
      {isFolderModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Create New Folder</h3>
            <input
              type="text"
              placeholder="Enter folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
            <button
              className={styles.handleCreateFolder}
              onClick={handleCreateFolder}
            >
              Done
            </button>
            <button
              className={styles.folderCancelButton}
              onClick={() => setIsFolderModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Conditionally displaying folder and form */}
      {selectedWorkspace ? (
        <div className={styles.workspaceDetails}>
          {/* <h2>Shared Resources from {selectedWorkspace.inviterName}</h2> */}
          <div>
            {/* <h3>Folders</h3> */}
            {selectedWorkspace.folders.length > 0 ? (
              <div className={styles.SharedfoldersList}>
                {selectedWorkspace.folders.map((folder) => (
                  <div key={folder._id} className={styles.sharedFolderItem}>
                    {folder.name}
                  </div>
                ))}
              </div>
            ) : (
              <p>No folders shared.</p>
            )}
          </div>
          <div className={styles.sharedFormSection}>
            <p className={styles.shareCreateFormButton}>
              <img
                src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735276320/SVG_2_m4soor.png"
                alt=""
              />
              <span>Create a typebot</span>
            </p>
            <div>
              {/* <h3>Forms</h3> */}
              {selectedWorkspace.forms.length > 0 ? (
                <div className={styles.shareForms}>
                  {selectedWorkspace.forms.map((form) => (
                    <div
                      className={styles.shareFormItem}
                      key={form._id}
                      onClick={() =>
                        navigateToFormWorkspace(
                          form.folderID,
                          form._id,
                          form.formName
                        )
                      }
                    >
                      {form.name}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No forms shared.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.foldersList}>
            {folders.length > 0 ? (
              folders.map((folder) => (
                <div key={folder._id} className={styles.folderWrapper}>
                  <div
                    className={`${styles.folderItem} ${
                      folder._id === activeFolderID ? styles.active : ""
                    }`}
                    onClick={() => handleFolderClick(folder._id)}
                  >
                    <span>{folder.name}</span>
                    <img
                      src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735276657/Frame_1039_xjd3ue.png"
                      className={styles.deleteFolderButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        openFolderDeleteModal(folder._id);
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p>No folders available</p>
            )}

            {isFolderDeleteModalOpen && (
              <div className={styles.modalDelete}>
                <div className={styles.modalContentDelete}>
                  <h3>Are you sure you want to delete this folder ?</h3>
                  <div className={styles.modalActions}>
                    <button
                      className={styles.handleCreateFolder}
                      onClick={confirmDeleteFolder}
                    >
                      Confirm
                    </button>
                    <button
                      className={styles.folderCancelButton}
                      onClick={closeFolderDeleteModal}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <p
              className={styles.createFormButton}
              onClick={() => {
                if (activeFolderID) {
                  setSelectedFolderID(activeFolderID);
                  setIsFormModalOpen(true);
                } else {
                  alert("Please select a folder first.");
                }
              }}
            >
              <img
                src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735276320/SVG_2_m4soor.png"
                alt=""
              />
              <span>Create a typebot</span>
            </p>
          </div>
          <div className={styles.formsDisplay}>
            {activeFolderID && (
              <>
                {folders
                  .find((folder) => folder._id === activeFolderID)
                  ?.forms?.map((form) => (
                    <div key={form._id} className={styles.formItem}>
                      <span
                        className={styles.formLink}
                        onClick={() =>
                          handleNavigateToForm(
                            activeFolderID,
                            form._id,
                            form.name
                          )
                        }
                      >
                        {form.name}
                      </span>
                      <img
                        src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735276657/Frame_1039_xjd3ue.png"
                        className={styles.deleteButton}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent folder deselection
                          // handleDeleteForm(form._id, activeFolderID);
                          openDeleteModal(form._id, activeFolderID);
                        }}
                      />
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* display share user */}
      {/* Render the selected workspace's folders and forms */}
      {/* {selectedWorkspace && (
        <div className={styles.workspaceDetails}>
          <h2>Shared Resources from {selectedWorkspace.inviterName}</h2>
          <div className={styles.folders}>
            <h3>Folders</h3>
            {selectedWorkspace.folders.length > 0 ? (
              <ul>
                {selectedWorkspace.folders.map((folder) => (
                  <li key={folder._id}>{folder.name}</li>
                ))}
              </ul>
            ) : (
              <p>No folders shared.</p>
            )}
          </div>
          <div className={styles.forms}>
            <h3>Forms</h3>
            {selectedWorkspace.forms.length > 0 ? (
              <ul>
                {selectedWorkspace.forms.map((form) => (
                  <li key={form._id}>{form.name}</li>
                ))}
              </ul>
            ) : (
              <p>No forms shared.</p>
            )}
          </div>
        </div>
      )} */}

      {/* folder display */}
      {/* <div className={styles.foldersList}>
        {folders.length > 0 ? (
          folders.map((folder) => (
            <div key={folder._id} className={styles.folderWrapper}>
              <div
                className={`${styles.folderItem} ${
                  folder._id === activeFolderID ? styles.active : ""
                }`}
                onClick={() => handleFolderClick(folder._id)}
              >
                <span>{folder.name}</span>
                <img
                  src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735276657/Frame_1039_xjd3ue.png"
                  className={styles.deleteFolderButton}
                  onClick={(e) => {
                    e.stopPropagation(); 
                    openFolderDeleteModal(folder._id); 
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <p>No folders available</p>
        )}

        {isFolderDeleteModalOpen && (
          <div className={styles.modalDelete}>
            <div className={styles.modalContentDelete}>
              <h3>Are you sure you want to delete this folder ?</h3>
              <div className={styles.modalActions}>
                <button
                  className={styles.handleCreateFolder}
                  onClick={confirmDeleteFolder}
                >
                  Confirm
                </button>
                <button
                  className={styles.folderCancelButton}
                  onClick={closeFolderDeleteModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <p
          className={styles.createFormButton}
          onClick={() => {
            if (activeFolderID) {
              setSelectedFolderID(activeFolderID);
              setIsFormModalOpen(true);
            } else {
              alert("Please select a folder first.");
            }
          }}
        >
          <img
            src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735276320/SVG_2_m4soor.png"
            alt=""
          />
          <span>Create a typebot</span>
        </p>
      </div> */}

      {/* Form Display Area */}
      {/* <div className={styles.formsDisplay}>
        {activeFolderID && (
          <>
            {folders
              .find((folder) => folder._id === activeFolderID)
              ?.forms?.map((form) => (
                <div key={form._id} className={styles.formItem}>
                  <span
                    className={styles.formLink}
                    onClick={() =>
                      handleNavigateToForm(activeFolderID, form._id, form.name)
                    }
                  >
                    {form.name}
                  </span>
                  <img
                    src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1735276657/Frame_1039_xjd3ue.png"
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent folder deselection
                      // handleDeleteForm(form._id, activeFolderID);
                      openDeleteModal(form._id, activeFolderID);
                    }}
                  />
                </div>
              ))}
          </>
        )}
      </div> */}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className={styles.modalDelete}>
          <div className={styles.modalContentDelete}>
            <h3>Are you sure you want to delete this Form ?</h3>
            <div className={styles.modalActions}>
              <button
                className={styles.handleCreateFolder}
                onClick={confirmDeleteForm}
              >
                Confirm
              </button>
              <button
                className={styles.folderCancelButton}
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isFormModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Create New Form</h3>
            <input
              type="text"
              placeholder="Enter form name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
            <button
              className={styles.handleCreateFolder}
              onClick={handleCreateForm}
            >
              Done
            </button>
            <button
              className={styles.folderCancelButton}
              onClick={() => {
                setIsFormModalOpen(false);
                setFormName("");
                setSelectedFolderID(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Workspace;
