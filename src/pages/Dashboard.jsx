import React, { useCallback, useMemo, useState, useEffect } from 'react';
import MaterialReactTable from 'material-react-table';
import CreatePanel from '../components/CreatePanel';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';
//import { fetchData } from './brand';

const Dashboard = () => {
  const students = [];
  const fetchStudents = async () => {
    let response = await axios.get("http://localhost:8000/students/");
    setTableData(response.data);
  };

  useEffect(() => { fetchStudents(); }, [])
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  //console.log("12345");
  const handleCreateNewRow = (values) => {
    tableData.push(values);
    for(let i = 0; i < tableData.length; i++) {
      tableData[i].id = i +1;
    }
    setTableData([...tableData]);
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      tableData[row.index] = values;
      //send/receive api updates here, then refetch or update local table data for re-render
      //axios.put("http://localhost:8000/students/", JSON.stringify(values));
      setTableData([...tableData]);
      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    (row) => {
      /*if (
        !confirm(`Are you sure you want to delete ${row.getValue('ten')}`)
      ) {
        return;
      }*/
      //send api delete request here, then refetch or update local table data for re-render
      tableData.splice(row.index, 1);
      for (let i = 0; i < tableData.length; i++) {
        tableData[i].id = i + 1;
      }
      setTableData([...tableData]);
    },
    [tableData],
  );



  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'TT',
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: 'msv',
        header: 'MSSV',
        enableEditing: false,
        size: 140
      },
      {
        accessorKey: 'ten',
        header: 'Họ và Tên',
        size: 140
      },
      {
        accessorKey: 'nsinh',
        header: 'Ngày sinh'
      },
      {
        accessorKey: 'que',
        header: 'Quê quán',
        size: 80
      },

    ]
  );

  return (
    <>
      <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 120,
          },
        }}
        columns={columns}
        data={tableData}
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            color="secondary"
            onClick={() => setCreateModalOpen(true)}
            variant="contained"
          >
            Thêm mới
          </Button>
        )}
      />
      <CreatePanel
        columns={columns}
        open={createModalOpen}
        tableData = {tableData}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </>
  );
};

//example of creating a mui dialog modal for creating new rows

export default Dashboard;
