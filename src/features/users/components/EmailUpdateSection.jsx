import { useState } from "react";

import UpdateIdentityForm from "@/features/auth/components/UpdateIdentityForm"

const EmailUpdateSection = () => {
  const [mode, setMode] = useState("email"); // "email" or "password"

  return (
    <section>
      <div>
        <h3>Change Email/Password</h3>
      </div>

      <hr style={{ margin: "20px 0" }} />

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setMode("email")}
          style={{ marginRight: "10px" }}
        >
          Change Email
        </button>
        <button onClick={() => setMode("password")}>
          Change Password
        </button>
      </div>

      {mode && (
        <UpdateIdentityForm mode={mode} />
      )}

    </section>
  );
};

export default EmailUpdateSection;
