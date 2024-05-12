import "./MChatBody.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import MChatFeed from "./MChatFeed";

function MChatBody({ AIdata }) {
  return (
    <div className="MchatBackground flex-1">
      <MChatFeed AIdata={AIdata} />
    </div>
  );
}

export default MChatBody;
