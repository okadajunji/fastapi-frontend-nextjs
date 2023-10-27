"use client";
import React, { useState } from "react";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import Image from "next/image";

const IndexPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number, height: number }>({ width: 0, height: 0 });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const localImageUrl = URL.createObjectURL(file);
      setImageSrc(localImageUrl);

      const img = new window.Image();
      img.src = localImageUrl;
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const newHeight = 300;
        const newWidth = newHeight * aspectRatio;
        setImageDimensions({ width: newWidth, height: newHeight });
      };
    }
  };

  const processImage = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("https://streamlit-fastapi.onrender.com/process-image/", {
      method: "POST",
      body: formData,
    });
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    setProcessedImage(imageUrl);
  };

  return (
    <>
      <div>/process_image</div>
      <Input type="file" onChange={handleFileChange} />
      <br />
      {imageSrc && (
        <>
          <Image width={imageDimensions.width} height={imageDimensions.height} src={imageSrc} alt="Original" />
          <br />
          <Button variant="outlined" onClick={processImage}>Process Image</Button>
          <br />
        </>
      )}
      {processedImage && (
        <Image width={imageDimensions.width} height={imageDimensions.height} src={processedImage} alt="Processed" />
      )}
    </>
)};

export default IndexPage;
