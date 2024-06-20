import React, { useState, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise/styles/ag-grid.css";
import "ag-grid-enterprise/styles/ag-theme-alpine.css";
import { fnoDefs, pncDefs } from "./ColumnDefs";

const DateInput = ({ id, minDate, maxDate, onChange }) => (
  <input
    type="date"
    id={id}
    min={minDate}
    max={maxDate}
    onChange={onChange}
    style={{ padding: "5px" }}
  />
);

const LoadingIndicator = () => (
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
);

function Dashboard() {
  const [rowData1, setRowData1] = useState([]);
  const [rowData2, setRowData2] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [error, setError] = useState(null); // Error state for better user feedback
  const [date1, setDate1] = useState(null);
  const [date2, setDate2] = useState(null);

  const minDate = "2024-05-02";
  const maxDate = new Date().toISOString().split("T")[0];

  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    const formattedDay = day.padStart(2, "0");
    const formattedMonth = month.padStart(2, "0");
    const formattedYear = year.slice(-2);
    return `${formattedDay}${formattedMonth}${formattedYear}`;
  };

  const fetchData = useCallback(async (date, urlPath) => {
    try {
      const url = date
        ? `http://192.168.4.96:5000/${urlPath}?date=${formatDate(date)}`
        : `http://192.168.4.96:5000/${urlPath}`;
      const response = await fetch(url);
      console.log(`Fetching data from: ${url}`);

      if (!response.ok) throw new Error("Network response was not ok");

      return await response.json();
    } catch (error) {
      console.error(`Error fetching data from ${urlPath}:`, error);
      setError(error.message);
      return [];
    }
  }, []);

  const fetchAndCompareData = useCallback(async () => {
    if (!date1 || !date2) return;

    setLoading1(true);
    try {
      const [data1, data2] = await Promise.all([
        fetchData(date1, "fno"),
        fetchData(date2, "fno"),
      ]);

      const comparisonData = data1
        .map((item1) => {
          const item2 = data2.find(
            (item) =>
              item.BROKER === item1.BROKER && item.DEALERID === item1.DEALERID
          );
          if (item2) {
            return {
              BROKER: item1.BROKER,
              DEALERID: item1.DEALERID,
              ORDERS: item1.ORDERS - item2.ORDERS,
              TRADES: item1.TRADES - item2.TRADES,
              RATIO: item1.RATIO - item2.RATIO,
              OTR_DATE: `${formatDate(date1)} - ${formatDate(date2)}`,
            };
          } else {
            return null;
          }
        })
        .filter((item) => item !== null);

      setRowData1(comparisonData);
    } catch (error) {
      console.error("Error comparing data:", error);
      setError(error.message);
    } finally {
      setLoading1(false);
    }
  }, [date1, date2, fetchData]);

  useEffect(() => {
    fetchData(null, "pnc").then((data) => {
      setRowData2(data);
      setLoading2(false);
    });
  }, [fetchData]);

  useEffect(() => {
    fetchAndCompareData();
  }, [fetchAndCompareData]);

  const handleDateChange = (event, fetchData) => {
    const selectedDate = event.target.value;
    console.log("Selected date:", selectedDate); // Add console.log to track date selection
    fetchData(selectedDate);
  };

  const handleDateChange1 = (event) => {
    setDate1(event.target.value);
  };

  const handleDateChange2 = (event) => {
    setDate2(event.target.value);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
      }}
    >
      <div className="ag-theme-alpine" style={{ height: "85vh", width: "48%" }}>
        <div
          className="headers"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h5>Futures & Options</h5>
          <div
            className="comparableDates"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <DateInput
              id="date1"
              minDate={minDate}
              maxDate={maxDate}
              onChange={handleDateChange1}
            />
            <h6> - </h6>
            <DateInput
              id="date2"
              minDate={minDate}
              maxDate={maxDate}
              onChange={handleDateChange2}
            />

            {/* <DateInput
              id="fnoDate"
              minDate={minDate}
              maxDate={maxDate}
              onChange={(e) => handleDateChange(e, fetchData)}
            /> */}
          </div>
        </div>
        {loading1 ? (
          <LoadingIndicator />
        ) : (
          <AgGridReact
            rowData={rowData1}
            columnDefs={fnoDefs}
            pagination={true}
            paginationPageSize={17}
            rowSelection={"multiple"}
            suppressCellSelection={true}
            enableRangeSelection={true}
            enableColResize={true}
            enableSorting={true}
            enableFilter={true}
          />
        )}
      </div>
      <div className="ag-theme-alpine" style={{ height: "85vh", width: "48%" }}>
        <div
          className="headers"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h5>PNC</h5>
          <DateInput
            id="pncDate"
            minDate={minDate}
            maxDate={maxDate}
            onChange={(e) =>
              handleDateChange(e, (date) =>
                fetchData(date, setRowData2, setLoading2, "pnc")
              )
            }
          />
        </div>
        {loading2 ? (
          <LoadingIndicator />
        ) : (
          <AgGridReact
            rowData={rowData2}
            columnDefs={pncDefs}
            pagination={true}
            paginationPageSize={17}
            rowSelection={"multiple"}
            suppressCellSelection={true}
            enableRangeSelection={true}
            enableColResize={true}
            enableSorting={true}
            enableFilter={true}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
