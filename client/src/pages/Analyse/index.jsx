import styles from "./styles.module.css";
import Popup from '../Popup/Popup';
import * as React from "react";
import { useTable } from "react-table";
import axios from "axios";
const htmlparser2 = require('htmlparser2');

var msg = "";

function Analysis(token) {
  const [buttonPopup, setButtonPopup] = React.useState(false);
  const [buttonPopup2, setButtonPopup2] = React.useState(false);
  const [fetchedData, setFetchedData] = React.useState(() => {
    const storedData = localStorage.getItem("fetchedData");
    return storedData ? JSON.parse(storedData) : [];
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + "/analyse", {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      });

      console.log("Response received:", response);
      console.log(response.data[0].headers);

      let resp = [];

      response.data.forEach((message) => {
        const { headers, id, msg } = message;
        const [date, from, to, subject] = headers;
        resp.push({
          date,
          from,
          to,
          subject,
          id,
        });
      });

      console.log("resp: ", resp);
      setFetchedData(resp);
      localStorage.setItem("fetchedData", JSON.stringify(resp));
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "From",
        accessor: "from",
      },
      {
        Header: "To",
        accessor: "to",
      },
      {
        Header: "Subject",
        accessor: "subject",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: fetchedData });

  async function emailAnalysis(emailID) {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + "/analyse/id", {
        headers: {
          Authorization: `Bearer ${token.token}`,
          id: emailID,
        },
      });
	  msg = response.data.msg;
      if (response.data.flag === "SAFE") {
        setButtonPopup(true);
      }
	  else
	  {
		console.log("here")
		setButtonPopup2(true);
	  }
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  const handleRowClick = (row) => {
    console.log("Row clicked:", row);
    console.log(row.original.id);
    emailAnalysis(row.original.id);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Analysis</h1>
      <div className={styles.form_container}>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} onClick={() => handleRowClick(row)}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Render the Popup component */}
      {buttonPopup && (
        <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
          <h3>{msg}</h3>
        </Popup>
      )}
      {/* Render the Popup component */}
      {buttonPopup2 && (
        <Popup trigger={buttonPopup2} setTrigger={setButtonPopup2}>
          <h3>{msg}</h3>
        </Popup>
      )}
    </div>
  );
}

export default Analysis;
