"use client";
import React, { useState } from "react";
import Papa from "papaparse";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";

const IndexPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [rawCsvData, setRawCsvData] = useState<Array<Array<string>> | null>(
    null
  );
  const [processedCsvData, setProcessedCsvData] = useState<Array<
    Array<string>
  > | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const result = Papa.parse(reader.result as string, {
          header: true,
          dynamicTyping: true,
        }).data;
        setRawCsvData(result as string[][]);
      };
      reader.readAsText(file);
    }
  };

  const processCSV = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("https://streamlit-fastapi.onrender.com/process-csv/", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      const text = await response.text();
      const result = Papa.parse(text, {
        header: true,
        dynamicTyping: true,
      }).data;
      setProcessedCsvData(result as string[][]);
    } else {
      console.error("Error processing CSV:", response.statusText);
    }
  };

  return (
    <div>
      <div>/process_csv</div>
      <Input type="file" onChange={handleFileChange} />

      {rawCsvData && (
        <>
          <Box component="div" sx={{ height: 350, width: "100%" }}>
            <DataGrid
              rows={rawCsvData
                .slice(1)
                .map((row, idx) => ({ id: idx, ...row }))}
              columns={Object.keys(rawCsvData[0]).map((key) => ({
                field: key,
                headerName: key,
                width: 150,
              }))}
              pageSizeOptions={[5]}
              checkboxSelection
              disableRowSelectionOnClick
            />
          </Box>
          <br />
          <Button variant="outlined" onClick={processCSV}>
            Process CSV
          </Button>
        </>
      )}

      {processedCsvData && (
        <Box component="div"  sx={{ height: 350, width: "100%" }}>
          <DataGrid
            rows={processedCsvData
              .slice(1)
              .map((row, idx) => ({ id: idx, ...row }))}
            columns={Object.keys(processedCsvData[0]).map((key) => ({
              field: key,
              headerName: key,
              width: 150,
            }))}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      )}
    </div>
  );
};

export default IndexPage;
