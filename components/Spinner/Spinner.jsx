import React from "react";
import style from "./spinner.module.css";

export default function Spinner() {
  return (
    <div className={style.spinnerContainer}>
      <div className={style.loadingSpinner}></div>
    </div>
  );
}
