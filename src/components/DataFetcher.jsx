// UI Dashboard for local data


// "use strict";

import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
// import { RangeSelectionModule } from "ag-grid-enterprise";
import "ag-grid-enterprise/styles/ag-grid.css";
import "ag-grid-enterprise/styles/ag-theme-alpine.css";
import { fnoDefs, pncDefs, gsmDefs } from "./ColumnDefs";

// Polyfill for Object.hasOwn if it's not available
if (!Object.hasOwn) {
  Object.hasOwn = function (obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };
}

function Dashboard() {
  const [rowData1, setRowData1] = useState([]);
  const [rowData2, setRowData2] = useState([]);
  const [rowData3, setRowData3] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [loading3, setLoading3] = useState(true);

  // const enableAdvancedFilter = true;
  // const [date1, setDate1] = useState(null);
  // const [date2, setDate2] = useState(null);
  // const [error, setError] = useState();

  useEffect(() => {
    fetchData1(); // FNO
    fetchData2(); // PNC
    fetchData3(); // GSM
  }, []);

  // FNO data fetching
  const fetchData1 = async (date) => {
    try {
      const url = date
        ? `http://192.168.1.41:5000/otr?date=${formatDate(date)}`
        : `http://192.168.1.41:5000/otr`;

      // const url = date
      // ? `http://192.168.4.96:5000/fno?date=${formatDate(date)}`
      // : `http://192.168.4.96:5000/fno`;

      const response = await fetch(url);
      console.log("Fetching data 1 from:", url);

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
  };

  // PNC data fetching
  const fetchData2 = async (date) => {
    try {
      const url = date
        ? `http://192.168.1.41:5000/pnc?date=${formatDate(date)}`
        : `http://192.168.1.41:5000/pnc`;

      // const url = date
      //   ? `http://192.168.4.96:5000/pnc?date=${formatDate(date)}`
      //   : `http://192.168.4.96:5000/pnc`;

      const response = await fetch(url);
      console.log("Fetching data 2 from:", url);

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
  };

  // GMS data fetching
  const fetchData3 = async (date) => {
    try {
      let url = `http://192.168.1.41:5000/gsm?date=050624`;
  
      if (date) {
        let formattedDate = formatDateForAPI(date);
  
        // Restrict selectable dates
        switch (formattedDate) {
          case "270524":
          case "280524":
          case "040624":
          case "050624":
          case "150424":
            url = `http://192.168.1.41:5000/gsm?date=${formattedDate}`;
            break; // Allowed dates
          default:
            console.warn(`Date ${date} is not selectable.`);
            return;
        }
      }
  
      const response = await fetch(url);
      console.log("Fetching GSM data from:", url);
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      console.log("Fetched GSM data:", data);
      setRowData3(data);
    } catch (error) {
      console.error("Error fetching GSM data:", error);
    } finally {
      setLoading3(false);
    }
  };
  
  const formatDateForAPI = (date) => {
    if (!date) {
      return "";
    }
  
    const [year, month, day] = date.split("-");
    // Ensure day, month, and year are two digits
    const formattedDay = day ? day.padStart(2, "0") : "01";
    const formattedMonth = month ? month.padStart(2, "0") : "01";
    // Extract the last two digits of the year
    const formattedYear = year ? year.slice(-2) : "01";
    // Return the formatted date as DDMMYY
    return `${formattedDay}${formattedMonth}${formattedYear}`;
  };
  



  // Date for pnc and fno
  const formatDate = (date) => {
    if (!date) {
      // If date is undefined or empty, return an empty string
      return "";
    }

    const [year, month, day] = date.split("-");
    // Ensure day, month, and year are two digits
    const formattedDay = day ? day.padStart(2, "0") : "01";
    const formattedMonth = month ? month.padStart(2, "0") : "01";
    // Extract the last two digits of the year
    const formattedYear = year ? year.slice(-2) : "01";
    // Return the formatted date as DDMMYY
    return `${formattedDay}${formattedMonth}${formattedYear}`;
  };

  const handleDateChange = (event, fetchData) => {
    const selectedDate = event.target.value;
    console.log("Selected date:", selectedDate);
    fetchData(selectedDate);
  };

  const minDate = "2024-05-03";
  const maxDate = new Date().toISOString().split("T")[0];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
        // backgroundColor: "#000"
      }}
      className="tableContainer"
    >
      <div
        className="ag-theme-alpine fno-tab"
        id="fno"
        style={{ height: "85vh", width: "48%" }}
      >
        <div
          className="headers"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h5>Futures & Options (OTR)</h5>
          <a href="#pnc" style={{ visibility: "none", display: "none" }}>
            ↡
          </a>
          {/* Date for select specific date data */}
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
            RangeSelectionModule={true}
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
          className="ag-theme-alpine pnc-tab"
          id="pnc"
          style={{ height: "35vh", width: "100%" }}
        >
          <div
            className="headers"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <h5>PNC</h5>
            <a href="#fno" style={{ visibility: "none", display: "none" }}>
              ↟
            </a>
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
              RangeSelectionModule={true}
              enableRangeSelection={true}
              enableColResize={true}
              enableSorting={true}
              enableFilter={true}
              enableCharts={true}
            />
          )}
        </div>

        {/* GSM data view */}
        <div
          className="ag-theme-alpine pnc-tab"
          id="pnc"
          style={{ height: "25vh", width: "100%", marginTop: "100px" }}
        >
          <div
            className="headers"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <h5>GSM</h5>
            <a href="#fno" style={{ visibility: "none", display: "none" }}>
              ↟
            </a>
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
            // replace the row data with gsm data and column defs with gsm column defs
            <AgGridReact
              rowData={rowData3}
              columnDefs={gsmDefs}
              rowSelection={"multiple"}
              RangeSelectionModule={true}
              enableRangeSelection={true}
              enableColResize={true}
              enableSorting={true}
              enableFilter={true}
              enableCharts={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
