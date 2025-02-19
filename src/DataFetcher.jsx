import { useState } from "react";

const FetchDataComponent = () => {
  const [text, setText] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    setData(null);
    
    try {
      const response = await fetch(`http://localhost:8080/board?name=${text}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-xl">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text"
        className="border p-2 w-full rounded-md"
      />
      <button
        onClick={fetchData}
        className="mt-2 bg-blue-500 text-white p-2 w-full rounded-md hover:bg-blue-600"
      >
        Get Data
      </button>

      {loading && <p className="text-gray-600 mt-2">Loading...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {data && (
        <div className="mt-2 p-2 border rounded-md bg-gray-50">
          <h3 className="font-bold text-lg">Response Data:</h3>
          <pre className="text-sm text-gray-700">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FetchDataComponent;
