import React from "react";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
const TextArea = ({ description, setDescription }) => {
  const blue = {
    200: "#b6daff",
    400: "#3399FF",
    600: "#0072E5",
    900: "#003A75",
  };

  const grey = {
    50: "#F3F6F9",
    200: "#DAE2ED",
    300: "#C7D0DD",
    400: "#B0B8C4",
    600: "#6B7A90",
    700: "#434D5B",
    900: "#1C2025",
  };

  return (
    <BaseTextareaAutosize
      style={{
        boxSizing: "border-box",
        width: "420px",
        height: "160px",
        fontSize: "0.875rem",
        fontWeight: 400,
        lineHeight: 1.5,
        padding: "8px 12px",
        borderRadius: "8px",
        color: "black",
        background: "white",
        border: `1px solid ${blue[700]}`,
        boxShadow: `0px 2px 2px ${blue[900]}`,

        "&:hover": {
          borderColor: blue[400],
        },

        "&:focus": {
          borderColor: blue[400],
          boxShadow: `0 0 0 3px ${blue[600]}`,
        },
      }}
      minRows={10}
      placeholder="Descripción del encadenamiento"
      onChange={(event) => setDescription(event.target.value)}
      value={description}
    />
  );
};

export default TextArea;
