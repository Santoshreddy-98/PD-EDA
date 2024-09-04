import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  usePagination,
  useContext
} from "react";

import {
  useTable,
  useFilters,
  useGlobalFilter,
} from "react-table";
import Pop_timing from "./Pop_timing";
import axios from "axios";
import {
  DefaultFilterForColumn,

} from "./filter";
import { dieareaData } from "../AppContent";

const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <div className="cb action">
      <label>
        <input type="checkbox" ref={resolvedRef} {...rest} />
        <span>All</span>
      </label>
    </div>
  );
});

const Table = ({ columns, data }) => {
  const { setPoint } = useContext(dieareaData);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    allColumns,
    visibleColumns,
    getToggleHideAllColumnsProps,
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultFilterForColumn },
    },
    useFilters,
    useGlobalFilter,
    usePagination
  );

  const [popupData, setPopupData] = useState();
  const [closeBtn, setCloseBtn] = useState(false);

  const Timing = async (id) => {
    const { data } = await axios.get(`http://127.0.0.1:8000/timing/${id}`);
    setPopupData(data);
  };

  //////////////////////////////
  const [hist, setHist] = useState([]);
  const dict = [];
  useEffect(() => {
    console.log("ttttt", rows);
    rows.map((res, item) => {
      dict.push({
        slack: res.original.slack,
        path: item,
      });
    });
  }, [rows]);


  // Find a WNS value
  const [wns, setWns] = useState();
  const a = [];
  useEffect(() => {
    rows.map((result, item) => {
      a.push(result.original.slack);
    });

    setWns(Math.min(...a));
  }, [rows]);

  // Find a TNS Value
  const [tns, setTns] = useState();
  var c = 0;
  useEffect(() => {
    rows.map((res, item) => {
      if (res.original.slack < 0) {
        c += Number(res.original.slack);
      }
    });

    setTns(c);
  }, [rows]);


  // Find pvs Value
  const [pvs, setPvs] = useState();
  const d = [];
  const e = [];
  useEffect(() => {
    rows.map((res, item) => {
      d.push(res.original.Path, res.original.slack);
    });

    for (var i = 0; i < d.length; i++) {
      if (d[i + 1] < 0) {
        e.push(d[i]);
      } 
    }
    setPvs(e.length);
  });

  return (
    <div className="container">
      <Pop_timing
        popupData={popupData}
        closeBtn={closeBtn}
        setCloseBtn={setCloseBtn}
      />
      <div
        style={{
          display: "flex",
          border: "1px solid",
          height: "55px",
          justifyContent: "space-evenly",
          overflowX: "auto",
        }}
      >
        <div>
          <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} />
        </div>

        {allColumns.map((column) => (
          <div className="cb action" key={column.id}>
            <label>
              <input type="checkbox" {...column.getToggleHiddenProps()} />{" "}
              <span>{column.Header}</span>
            </label>
          </div>
        ))}
        <br />
      </div>

      {/* Table Start */}
      <table {...getTableProps()}>
        <thead>
          <tr>
            <th
              colSpan={visibleColumns.length}
              style={{
                textAlign: "left",
              }}
            >
              <div>

                <div style={{ width: "100%" }}>
                  <h3>WNS: {wns}</h3>
                  <h3>TNS: {tns} </h3>
                  <h3>PVS: {pvs}</h3>
                </div>
              </div>
            </th>
          </tr>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  {column.render("Header")}

                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                onClick={() => {
                  Timing(Number(row.id) + 1);
                  setCloseBtn(true);
                  setPoint(Number(row.id) + 1);
                }}
              >
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Table End */}
    </div>
  );
};

export default Table;
