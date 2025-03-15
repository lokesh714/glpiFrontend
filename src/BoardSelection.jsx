import React, { useState, useEffect } from "react";

const BoardSelection = () => {
  const [boardTypes, setBoardTypes] = useState([]); // State to store the list of board types
  const [models, setModels] = useState([]); // State to store the list of models
  const [selectedBoardType, setSelectedBoardType] = useState(""); // State to store the selected board type
  const [selectedModel, setSelectedModel] = useState(""); // State to store the selected model
  const [selectedBoardModelId, setSelectedBoardModelId] = useState(null); // State for board model id
  const [modelData, setModelData] = useState(null); // State for model data response
  const [loading, setLoading] = useState(false); // Loading state to show loading spinner
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  // Board types data (Replace with your actual API response)
  const boardData = [
    { id: 1, name: "EBB" },
    { id: 2, name: "FIO" },
    { id: 3, name: "CRB" },
    { id: 4, name: "LIO" },
    { id: 5, name: "SFF" },
    { id: 6, name: "Router" },
    { id: 7, name: "Xpliant" },
    { id: 8, name: "NIC" },
    { id: 9, name: "VDU" },
    { id: 10, name: "EBB MCM" },
    { id: 11, name: "EBB SD" },
    { id: 12, name: "EVB" },
    { id: 13, name: "N/A" },
    { id: 14, name: "MODULAR PCB" },
    { id: 15, name: "SDK.EBB" },
    { id: 16, name: "FIREWALL APPLIANCE" },
    { id: 17, name: "DB" },
    { id: 18, name: "PCIE Card" },
    { id: 19, name: "vran-nic" },
    { id: 20, name: "Ryzen MB" },
    { id: 21, name: "LS2" },
    { id: 22, name: "Asus" },
    { id: 23, name: "Z690-P-D4" },
    { id: 24, name: "EBB-Odyssey" },
    { id: 25, name: "Supermicro" },
    { id: 26, name: "SLT_Odyssey" },
    { id: 27, name: "EBB-10305" },
    { id: 28, name: "EBB-10205" },
    { id: 29, name: "SLT10505" },
    { id: 30, name: "SLT10205" },
    { id: 31, name: "SLT105N05" },
    { id: 32, name: "SLT106S05" },
    { id: 33, name: "QUEST" },
    { id: 34, name: "SLT10305" },
    { id: 35, name: "SLT10505N" },
    { id: 36, name: "EVB-Board" },
    { id: 37, name: "EV-COMX" },
  ];

  // Set board types data in state when the component mounts
  useEffect(() => {
    setBoardTypes(boardData);
  }, []);

  // Fetch models when a board type is selected
  const fetchModels = async (boardTypeName) => {
    try {
      setLoading(true);
      setErrorMessage(""); // Reset error message
      // Replace this with your actual API request to fetch models
      const response = await fetch(
        `http://localhost:8080/board?name=${boardTypeName}`
      );
      const data = await response.json();

      if (data && data.data) {
        if (data.data.length === 0) {
          setErrorMessage("No board models found under this type.");
        } else {
          setModels(data.data); // Update models state with the API response
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching models:", error);
      setLoading(false);
    }
  };

  // Fetch model data when a model is selected
  const fetchModelData = async (modelId) => {
    try {
      setLoading(true);
      setErrorMessage(""); // Reset error message
      // Make the API call to get the model data using modelId
      const response = await fetch(
        `http://localhost:8080/board/model/${modelId}`
      );
      const data = await response.json();

      if (data && data.data && data.data.length === 0) {
        setErrorMessage("No boards found for this model.");
      } else {
        setModelData(data); // Update state with model data
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching model data:", error);
      setLoading(false);
    }
  };

  // Handle board type selection change
  const handleBoardTypeChange = (e) => {
    const boardTypeName = e.target.value;
    setSelectedBoardType(boardTypeName);
    setSelectedModel(""); // Reset model
    setModelData(null); // Reset model data
    setErrorMessage(""); // Reset error message
    fetchModels(boardTypeName); // Fetch models for the selected board type
  };

  // Handle model selection change
  const handleModelChange = (e) => {
    const modelId = e.target.value;
    setSelectedModel(modelId);
    fetchModelData(modelId); // Fetch the model data based on the selected model id
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>CCS LABS GLPI Boards Data</h2>

      {loading && <p>Loading...</p>}

      <div>
        <label htmlFor="board-type" style={styles.label}>
          Select Board Type:
        </label>
        <select
          id="board-type"
          value={selectedBoardType}
          onChange={handleBoardTypeChange}
          disabled={loading}
          style={styles.select}
        >
          <option value="">Select a board type</option>
          {boardTypes.map((board) => (
            <option key={board.id} value={board.name}>
              {board.name}
            </option>
          ))}
        </select>
      </div>

      {/* Display No Models Found Message */}
      {selectedBoardType && models.length === 0 && !loading && (
        <div style={styles.errorMessage}>
          No board models found under this type. Please choose another board
          type.
        </div>
      )}

      {selectedBoardType && models.length > 0 && (
        <div>
          <label htmlFor="model" style={styles.label}>
            Select Model:
          </label>
          <select
            id="model"
            value={selectedModel}
            onChange={handleModelChange}
            disabled={loading}
            style={styles.select}
          >
            <option value="">Select a model</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Display No Boards Found Message */}
      {selectedModel && !modelData && !loading && (
        <div style={styles.errorMessage}>
          No boards found for this model. Please choose another model.
        </div>
      )}

      {modelData && modelData.data && modelData.data.length > 0 && (
        <div>
          <h3 style={styles.subHeader}>Model Data:</h3>
          <table border="1" style={styles.table}>
            <thead>
              <tr>
                <th>Board Name</th>
                <th>Board Status</th>
              </tr>
            </thead>
            <tbody>
              {modelData.data.map((item, index) => (
                <tr key={index}>
                  <td>{item.boardName}</td>
                  <td>{item.boardStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Styling Object
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f7fc",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "600px",
    margin: "auto",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  header: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
    color: "#444",
  },
  select: {
    width: "100%",
    padding: "12px 20px",
    marginBottom: "20px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  subHeader: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  tableCell: {
    padding: "12px",
    border: "1px solid #ddd",
  },
  errorMessage: {
    color: "#d9534f",
    textAlign: "center",
    marginTop: "20px",
    fontSize: "16px",
  },
};

export default BoardSelection;
