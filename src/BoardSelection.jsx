import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
const BoardSelection = () => {
  const [boardTypes, setBoardTypes] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBoardType, setSelectedBoardType] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [modelData, setModelData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
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
  useEffect(() => {
    setBoardTypes(boardData);
  }, []);
  const fetchModels = async (boardTypeName) => {
    try {
      setLoading(true);
      setErrorMessage("");
      const response = await fetch(
        `http://localhost:8080/board?name=${boardTypeName}`
      );
      const data = await response.json();
      if (data && data.data) {
        if (data.data.length === 0) {
          setErrorMessage("No board models found under this type.");
        } else {
          setModels(data.data);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching models:", error);
      setLoading(false);
    }
  };
  const fetchModelData = async (modelId) => {
    if (!modelId || modelId === "all") return;
    try {
      setLoading(true);
      setErrorMessage("");
      const response = await fetch(
        `http://localhost:8080/board/model/${modelId}?page=${currentPage}&size=${itemsPerPage}`
      );
      const data = await response.json();
      if (data && data.data && data.data.content.length === 0) {
        setErrorMessage("No boards found for this model.");
      } else {
        setModelData(data);
        setTotalPages(data.data.totalPages);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching model data:", error);
      setLoading(false);
    }
  };
  const fetchAllModelData = async () => {
    try {
      setLoading(true);
      setErrorMessage(""); // Reset error message
      const response = await fetch(
        `http://localhost:8080/board/model?page=${currentPage}&size=${itemsPerPage}`
      );
      const data = await response.json();

      if (data && data.data && data.data.content.length === 0) {
        setErrorMessage("No boards found.");
      } else {
        setModelData(data);
        setTotalPages(data.data.totalPages);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching all board data:", error);
      setLoading(false);
    }
  };
  const handleBoardTypeChange = (e) => {
    const boardTypeName = e.target.value;
    setSelectedBoardType(boardTypeName);
    setSelectedModel("");
    setModelData(null);
    setErrorMessage("");
    setCurrentPage(0);
    fetchModels(boardTypeName);
  };
  const handleModelChange = (e) => {
    const modelId = e.target.value;
    setSelectedModel(modelId);
    setCurrentPage(0);
    if (modelId === "all") {
      fetchAllModelData();
    } else {
      fetchModelData(modelId);
    }
  };
  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => {
      const newPage = prevPage + direction;
      return newPage >= 0 && newPage < totalPages ? newPage : prevPage;
    });
  };
  const handleRecordsPerPageChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setItemsPerPage(value === "" ? "" : parseInt(value, 10));
      setErrorMessage("");
    } else {
      setErrorMessage("Please enter a valid number.");
    }
  };
  const handleSubmit = () => {
    setCurrentPage(0);
    if (selectedModel === "all") {
      fetchAllModelData();
    } else if (selectedModel) {
      fetchModelData(selectedModel);
    }
  };
  useEffect(() => {
    if (selectedModel === "all") {
      fetchAllModelData();
    } else if (selectedModel) {
      fetchModelData(selectedModel);
    }
  }, [currentPage, selectedModel]);
  const getChartData = () => {
    if (!modelData || !modelData.data || !modelData.data.content) return [];
    const statusCounts = modelData.data.content.reduce((acc, item) => {
      acc[item.boardStatus] = (acc[item.boardStatus] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));
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
            <option value="all">All Models</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {selectedModel && !modelData && !loading && (
        <div style={styles.errorMessage}>
          No boards found for this model. Please choose another model.
        </div>
      )}
      {modelData &&
        modelData.data.content &&
        modelData.data.content.length > 0 && (
          <>
            <h3 style={styles.subHeader}>Model Data:</h3>
            <table border="1" style={styles.table}>
              <thead>
                <tr>
                  <th>Board Name</th>
                  <th>Board Status</th>
                </tr>
              </thead>
              <tbody>
                {modelData.data.content.map((item, index) => (
                  <tr key={index}>
                    <td>{item.boardName}</td>
                    <td>{item.boardStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Bar Chart */}
            <div style={{ width: "100%", height: 300, marginTop: 30 }}>
              <ResponsiveContainer>
                <BarChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884D8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      <div style={styles.pagination}>
        <button
          onClick={() => handlePageChange(-1)}
          disabled={currentPage === 0}
          style={styles.paginationButton}
        >
          Previous
        </button>
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === totalPages - 1}
          style={styles.paginationButton}
        >
          Next
        </button>
      </div>
      <div style={styles.recordsPerPage}>
        <label htmlFor="records-per-page">Records per page:</label>
        <input
          id="records-per-page"
          type="number"
          value={itemsPerPage}
          onChange={handleRecordsPerPageChange}
          min="1"
          style={styles.input}
        />
        {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
        <button onClick={handleSubmit} style={styles.paginationButton}>
          Submit
        </button>
      </div>
    </div>
  );
};
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#F4F7FC",
    padding: "20px",
    borderRadius: "8px",
    width: "90vw",
    height: "100vh",
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
  input: {
    width: "100%",
    padding: "12px 20px",
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
    color: "#D9534F",
    textAlign: "center",
    marginTop: "20px",
    fontSize: "16px",
  },
  pagination: {
    textAlign: "center",
    marginTop: "20px",
  },
  paginationButton: {
    padding: "16px 16px",
    margin: "0 10px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  recordsPerPage: {
    textAlign: "center",
    marginTop: "20px",
    width: "200px",
  },
};
export default BoardSelection;
