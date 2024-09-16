import React, {
    useCallback,
    useMemo,
    useRef,
    useState,
    StrictMode,
  } from 'react';
  import { createRoot } from 'react-dom/client';
  import { AgGridReact } from 'ag-grid-react';
  import 'ag-grid-enterprise';
  import 'ag-grid-community/styles/ag-grid.css';
  import 'ag-grid-community/styles/ag-theme-alpine.css';
  
  const GridExample = () => {
    const gridRef = useRef(null);
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const [rowData, setRowData] = useState();
    const advancedFilterModel = useMemo(() => {
      return {
        filterType: 'join',
        type: 'AND',
        conditions: [
          {
            filterType: 'join',
            type: 'OR',
            conditions: [
              {
                filterType: 'number',
                colId: 'age',
                type: 'greaterThan',
                filter: 23,
              },
              {
                filterType: 'text',
                colId: 'sport',
                type: 'endsWith',
                filter: 'ing',
              },
            ],
          },
          {
            filterType: 'text',
            colId: 'country',
            type: 'contains',
            filter: 'united',
          },
        ],
      };
    }, []);
    const [columnDefs, setColumnDefs] = useState([
      { field: 'athlete' },
      { field: 'country' },
      { field: 'sport' },
      { field: 'age', minWidth: 100 },
      { field: 'gold', minWidth: 100 },
      { field: 'silver', minWidth: 100 },
      { field: 'bronze', minWidth: 100 },
    ]);
    const defaultColDef = useMemo(() => {
      return {
        flex: 1,
        minWidth: 180,
        filter: true,
        sortable: true,
        resizable: true,
      };
    }, []);

   
  
    const onGridReady = useCallback((params) => {
      gridRef.current = params.api;  
      fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
        .then((resp) => resp.json())
        .then((data) =>  setRowData(data));
    }, []);
   
  
    const onFirstDataRendered = useCallback(() => {
    //   gridRef.current.showAdvancedFilterBuilder();
    }, []);
  
    return (
      <div style={containerStyle}>
        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            advancedFilterModel={advancedFilterModel}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            enableAdvancedFilter={true}
            onGridReady={onGridReady}
            onFirstDataRendered={onFirstDataRendered}
          />
        </div>
      </div>
    );
  };
  
  export default GridExample;
  
  
//   const root = createRoot(document.getElementById('root'));
//   root.render(
//     <StrictMode>
//       <GridExample />
//     </StrictMode>
//   );
  