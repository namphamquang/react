import React, { useCallback, useMemo, useState, useEffect } from 'react';
import MaterialReactTable from 'material-react-table';
import CreatePanel from '../components/CreatePanel';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';

const Dashboard = () => {
  const [tableData, setTableData] = useState([]);
  const [createPanelOpen, setCreatePanelOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  /**
   * lay du lieu
   */
  const fetchStudents = async () => {
    let response = await axios.get("http://localhost:8000/students/");
    setTableData(response.data);
  };

  useEffect(() => { fetchStudents(); }, [])
  /**
   * kiem tra loi dau vao
   */
  const getError = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === 'nsinh'
              ? validateDay(event.target.value)
              : validateRequired(event.target.value);
          if (!isValid) {
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `Ngày sinh không hợp lệ`,
            });
          } else {
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors],
  );
  /**
   * Tao hang moi
   * @param {*} values 
   */
  const handleCreateNewRow = (values) => {
    tableData.push(values);
    for (let i = 0; i < tableData.length; i++) {
      tableData[i].id = i + 1;
    }
    setTableData([...tableData]);
  };

  /**
   * Luu du lieu
   * @param {*} param0 
   */
  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      tableData[row.index] = values;
      const student = {};
      student.msv = values.msv;
      student.ten = values.ten;
      student.nsinh = values.nsinh;
      student.que = values.que;
      axios.put(`http://localhost:8000/students/${row.index + 1}`, student);
      setTableData([...tableData]);
      exitEditingMode();
    }
  };

  /**
   * 
   */
  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  /**
   * Xoa du lieu
   */
  const handleDeleteRow = useCallback(
    (row) => {
      axios.patch(`http://localhost:8000/students/${row.index + 1}`);
      tableData.splice(row.index, 1);
      for (let i = 0; i < tableData.length; i++) {
        tableData[i].id = i + 1;
      }
      setTableData([...tableData]);
    },
    [tableData],
  );


  /**
   * Cac cot cua bang
   */
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
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getError(cell),
        }),
      },
      {
        accessorKey: 'ten',
        header: 'Họ và Tên',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getError(cell),
        }),
      },
      {
        accessorKey: 'nsinh',
        header: 'Ngày sinh',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getError(cell),
        }),
      },
      {
        accessorKey: 'que',
        header: 'Quê quán',
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getError(cell),
        }),
      },

    ],
    [getError],
  );
  /**
   * Cac cot Panel tao sinh vien
   */
  const columnsPanel = useMemo(
    () => [
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

    ],
    [getError],
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
        positionActionsColumn="last"
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
            onClick={() => setCreatePanelOpen(true)}
            variant="contained"
          >
            Thêm mới
          </Button>
        )}
      />
      <CreatePanel
        columns={columnsPanel}
        open={createPanelOpen}
        tableData={tableData}
        onClose={() => setCreatePanelOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </>
  );
};

/**
 * Check input hop le
 * @param {*} value 
 * @returns 
 */
const validateRequired = (value) => !!value.length;
const validateDay = (nsinh) =>
  !!nsinh.length &&
  nsinh
    .toLowerCase()
    .match(
      /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/,
    );

export default Dashboard;
