import React from "react";

const ErrorMessage = ({ message }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "16px",
        background: "var(--accent-bg)",
        border: "1px solid var(--accent-border)",
        borderRadius: "8px",
        color: "var(--text-h)",
      }}
    >
      <span style={{ fontSize: "18px" }}>⚠</span>
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;