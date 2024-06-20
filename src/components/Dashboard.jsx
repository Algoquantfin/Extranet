// UI Dashboard for mongoDB data

import React, { useState, useEffect, useCallback, useRef  } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise/styles/ag-grid.css";
import "ag-grid-enterprise/styles/ag-theme-alpine.css";
import { fnoDefs, pncDefs, gsmDefs } from "./ColumnDefs";

function Dashboard() {
  const [rowData1, setRowData1] = useState([]);
  const [rowData2, setRowData2] = useState([]);
  const [rowData3, setRowData3] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [loading3, setLoading3] = useState(true);
  const scrollButtonRef = useRef(null);


  const minDate = "2024-05-03";
  const maxDate = new Date().toISOString().split("T")[0];

const fetchData1 = useCallback(async (date) => {
    try {
      const formattedDate = formatDateForAPI(date);
      const url = formattedDate
        ? `http://192.168.1.41:5000/otr?date=${formattedDate}`
        : `http://192.168.1.41:5000/otr`;
  
      const response = await fetch(url);
      // console.log("Fetching data 1 from:", url);
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      setRowData1(data);
    } catch (error) {
      console.error("Error fetching data 1:", error);
    } finally {
      setLoading1(false);
    }
  }, []);
  
  const fetchData2 = useCallback(async (date) => {
    try {
      const formattedDate = formatDateForAPI(date);
      const url = formattedDate
        ? `http://192.168.1.41:5000/pnc?date=${formattedDate}`
        : `http://192.168.1.41:5000/pnc`;
  
      const response = await fetch(url);
      // console.log("Fetching data 2 from:", url);
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      setRowData2(data);
    } catch (error) {
      console.error("Error fetching data 2:", error);
    } finally {
      setLoading2(false);
    }
  }, []);
  
  const fetchData3 = useCallback(async (date) => {
    try {
      const formattedDate = formatDateForAPI(date);
      const url = formattedDate
        ? `http://192.168.1.41:5000/gsm?date=${formattedDate}`
        : `http://192.168.1.41:5000/gsm?date=150624`;
  
      const response = await fetch(url);
      // console.log("Fetching data 3 from:", url);
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      setRowData3(data);
    } catch (error) {
      console.error("Error fetching data 3:", error);
    } finally {
      setLoading3(false);
    }
  }, []);
  
  useEffect(() => {
    fetchData1(); // Initial FNO
    fetchData2(); // Initial PNC
    fetchData3(); // Initial GSM
  }, [fetchData1, fetchData2, fetchData3]);
  



  const formatDateForAPI = (date) => {
    if (!date) {
      return "";
    }

    const [year, month, day] = date.split("-");
    const formattedDay = day ? day.padStart(2, "0") : "01";
    const formattedMonth = month ? month.padStart(2, "0") : "01";
    const formattedYear = year ? year.slice(-2) : "01";

    return `${formattedDay}${formattedMonth}${formattedYear}`;
  };

  const handleDateChange = (event, fetchData) => {
    const selectedDate = event.target.value;
    console.log("Selected date:", selectedDate);
    fetchData(selectedDate);
  };


  const scrollToTopOrBottom = () => {
    if (scrollButtonRef.current) {
      const isAtTop = window.scrollY === 0;
      const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;
  
      if (isAtTop) {
        // Scroll to bottom
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      } else if (isAtBottom) {
        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };
  

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
        backgroundColor: "#292e33"
      }}
      className="tableContainer"
    >
      <div
        className="ag-theme-alpine-dark fno-tab"
        id="fno"
        style={{ height: "85vh", width: "48%" }}
      >
        <div
          className="headers"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h5>Futures & Options (OTR)</h5>
          <input
            type="date"
            name="fnoDate"
            id="fnoDate"
            onChange={(e) => handleDateChange(e, fetchData1)}
            min={minDate}
            max={maxDate}
            style={{ padding: "5px" }}
          />
        </div>
        {loading1 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            Loading...
          </div>
        ) : (
          <AgGridReact
            rowData={rowData1}
            columnDefs={fnoDefs}
            rowSelection={"multiple"}
            enableRangeSelection={true}
            enableColResize={true}
            enableSorting={true}
            enableFilter={true}
            enableCharts={true}
          />
        )}
      </div>
      <div
        className="tableDivider"
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          width: "50%",
        }}
      >
        <div
          className="ag-theme-alpine-dark pnc-tab"
          style={{ height: "35vh", width: "100%" }}
        >
          <div
            className="headers"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <h5>PNC</h5>
            <input
              type="date"
              name="pncDate"
              id="pncDate"
              onChange={(e) => handleDateChange(e, fetchData2)}
              min={minDate}
              max={maxDate}
              style={{ padding: "5px" }}
            />
          </div>
          {loading2 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              Loading...
            </div>
          ) : (
            <AgGridReact
              rowData={rowData2}
              columnDefs={pncDefs}
              rowSelection={"multiple"}
              enableRangeSelection={true}
              enableColResize={true}
              enableSorting={true}
              enableFilter={true}
              enableCharts={true}
            />
          )}
        </div>

        <div
          className="ag-theme-alpine-dark pnc-tab"
          id="gsm"
          style={{ height: "25vh", width: "100%", marginTop: "100px" }}
        >
          <div
            className="headers"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <h5>GSM</h5>
            <input
              type="date"
              name="gsmDate"
              id="gsmDate"
              onChange={(e) => handleDateChange(e, fetchData3)}
              min={minDate}
              max={maxDate}
              style={{ padding: "5px" }}
            />
          </div>
          {loading3 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              Loading...
            </div>
          ) : (
            <AgGridReact
              rowData={rowData3}
              columnDefs={gsmDefs}
              rowSelection={"multiple"}
              enableRangeSelection={true}
              enableColResize={true}
              enableSorting={true}
              enableFilter={true}
              enableCharts={true}
            />
          )}
        </div>
      </div>
      <button
        ref={scrollButtonRef}
        onClick={scrollToTopOrBottom}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "10px",
          borderRadius: "50%",
          border: "none",
          backgroundColor: "#007bff",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        ⇅
      </button>
    </div>
  );
}

export default Dashboard;
