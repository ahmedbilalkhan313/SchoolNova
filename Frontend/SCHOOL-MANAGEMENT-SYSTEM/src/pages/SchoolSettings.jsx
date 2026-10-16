import { useEffect, useState } from "react";
import "../styles/SchoolSettings.css";

const SETTINGS_API = "https://school-nova-pied.vercel.app/api/settings";

function SchoolSettings() {
  const [schoolName, setSchoolName] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");

  const [settingId, setSettingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // LOAD SCHOOL SETTINGS
  // ==========================================

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(SETTINGS_API);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to load school settings."
          );
        }

        if (data.setting) {
          setSettingId(data.setting._id);

          setSchoolName(
            data.setting.schoolName || ""
          );

          setSchoolAddress(
            data.setting.schoolAddress || ""
          );

          setContactNumber(
            data.setting.contactNumber || ""
          );

          setEmail(data.setting.email || "");

          // Keep localStorage synchronized

          localStorage.setItem(
            "schoolName",
            data.setting.schoolName || ""
          );

          localStorage.setItem(
            "schoolAddress",
            data.setting.schoolAddress || ""
          );

          localStorage.setItem(
            "contactNumber",
            data.setting.contactNumber || ""
          );

          localStorage.setItem(
            "schoolEmail",
            data.setting.email || ""
          );
        } else {
          // If MongoDB has no settings yet,
          // use existing localStorage values.

          setSchoolName(
            localStorage.getItem("schoolName") || ""
          );

          setSchoolAddress(
            localStorage.getItem("schoolAddress") || ""
          );

          setContactNumber(
            localStorage.getItem("contactNumber") || ""
          );

          setEmail(
            localStorage.getItem("schoolEmail") || ""
          );
        }
      } catch (err) {
        console.error(
          "Settings loading error:",
          err
        );

        // Fallback to localStorage

        setSchoolName(
          localStorage.getItem("schoolName") || ""
        );

        setSchoolAddress(
          localStorage.getItem("schoolAddress") || ""
        );

        setContactNumber(
          localStorage.getItem("contactNumber") || ""
        );

        setEmail(
          localStorage.getItem("schoolEmail") || ""
        );

        setError(
          err.message ||
            "Failed to load school settings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // ==========================================
  // SAVE / UPDATE SETTINGS
  // ==========================================

  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (!schoolName.trim()) {
      setError("Please enter school name.");
      return;
    }

    try {
      setSaving(true);

      const settingsData = {
        schoolName: schoolName.trim(),
        schoolAddress: schoolAddress.trim(),
        contactNumber: contactNumber.trim(),
        email: email.trim(),
      };

      const response = await fetch(
        SETTINGS_API,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(settingsData),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to save school settings."
        );
      }

      const savedSetting = data.setting;

      if (savedSetting?._id) {
        setSettingId(savedSetting._id);
      }

      // ==========================================
      // UPDATE UI WITH SAVED DATA
      // ==========================================

      const finalSchoolName =
        savedSetting?.schoolName ||
        settingsData.schoolName;

      const finalSchoolAddress =
        savedSetting?.schoolAddress ||
        settingsData.schoolAddress;

      const finalContactNumber =
        savedSetting?.contactNumber ||
        settingsData.contactNumber;

      const finalEmail =
        savedSetting?.email ||
        settingsData.email;

      setSchoolName(finalSchoolName);
      setSchoolAddress(finalSchoolAddress);
      setContactNumber(finalContactNumber);
      setEmail(finalEmail);

      // ==========================================
      // LOCAL STORAGE
      // ==========================================

      localStorage.setItem(
        "schoolName",
        finalSchoolName
      );

      localStorage.setItem(
        "schoolAddress",
        finalSchoolAddress
      );

      localStorage.setItem(
        "contactNumber",
        finalContactNumber
      );

      localStorage.setItem(
        "schoolEmail",
        finalEmail
      );

      setSuccess(
        "School information saved successfully!"
      );
    } catch (err) {
      console.error(
        "Settings save error:",
        err
      );

      setError(
        err.message ||
          "Failed to save school settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="school-settings">

      {/* PAGE HEADING */}

      <div className="page-heading">
        <div>
          <p className="eyebrow">
            SCHOOL SETTINGS
          </p>

          <h1>School Information</h1>

          <p>
            Update your school's basic information.
          </p>
        </div>
      </div>

      {/* SETTINGS CARD */}

      <div className="settings-card">

        <div className="settings-form">

          {/* LOADING */}

          {loading && (
            <div className="settings-message">
              Loading school information...
            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="settings-message error-message">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="settings-message success-message">
              {success}
            </div>
          )}

          {/* SCHOOL NAME */}

          <div className="form-group">

            <label>School Name</label>

            <input
              type="text"
              placeholder="Enter school name"
              value={schoolName}
              onChange={(e) => {
                setSchoolName(e.target.value);
                setError("");
                setSuccess("");
              }}
              disabled={
                loading || saving
              }
            />

          </div>

          {/* SCHOOL ADDRESS */}

          <div className="form-group">

            <label>School Address</label>

            <input
              type="text"
              placeholder="Enter school address"
              value={schoolAddress}
              onChange={(e) => {
                setSchoolAddress(
                  e.target.value
                );
                setError("");
                setSuccess("");
              }}
              disabled={
                loading || saving
              }
            />

          </div>

          {/* CONTACT + EMAIL */}

          <div className="form-row">

            <div className="form-group">

              <label>Contact Number</label>

              <input
                type="text"
                placeholder="Enter contact number"
                value={contactNumber}
                onChange={(e) => {
                  setContactNumber(
                    e.target.value
                  );
                  setError("");
                  setSuccess("");
                }}
                disabled={
                  loading || saving
                }
              />

            </div>

            <div className="form-group">

              <label>Email</label>

              <input
                type="email"
                placeholder="Enter school email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                  setSuccess("");
                }}
                disabled={
                  loading || saving
                }
              />

            </div>

          </div>

          {/* SAVE BUTTON */}

          <button
            className="save-settings-btn"
            onClick={handleSave}
            disabled={
              loading || saving
            }
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default SchoolSettings;