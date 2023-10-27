"use client";

import React, { useState } from "react";
import Water from "@/components/Water";
import Button from "@mui/material/Button";

const IndexPage: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);

  const getRootMessage = async () => {
    const response = await fetch("https://streamlit-fastapi.onrender.com/");
    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div>
      <Water message={message} />
      <Button variant="outlined" onClick={getRootMessage}>
        メッセージを取得
      </Button>
    </div>
  );
};

export default IndexPage;
