import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { checkIdLength, checkIdExisted, checkStudentExisted, checkBirthday, checkEmpty } from '../handlers/validate';

import axios from 'axios';
const CreatePanel = ({ open, columns, tableData, onClose, onSubmit }) => {
  const [errorLogin, setErrorlogin] = useState();
  const [logBoxstyle, setLogboxStyle] = useState();
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {}),
  );

  const handleSubmit = () => {
    /**
     * kiem tra thong tin hop le
     */
    if (checkEmpty(values.ten) || checkEmpty(values.msv) || checkEmpty(values.nsinh) || checkEmpty(values.que)) {
      setErrorlogin(<div><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#D9212C" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"></path></svg>Vui lòng nhập đủ thông tin!</div>);
      setLogboxStyle({ backgroundColor: '#ffc0c7', margin: "20px auto", borderRadius: '5px', color: '#282a35', padding: '10px' });
    }
    else if (checkStudentExisted(values, tableData)) {
      setErrorlogin(<div><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#D9212C" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"></path></svg>Sinh viên đã tồn tại!</div>);
      setLogboxStyle({ backgroundColor: '#ffc0c7', margin: "20px auto", borderRadius: '5px', color: '#282a35', padding: '10px' });
    } else if (checkBirthday(values) == false) {
      setErrorlogin(<div><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#D9212C" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"></path></svg>Ngày sinh không hợp lệ!</div>);
      setLogboxStyle({ backgroundColor: '#ffc0c7', margin: "20px auto", borderRadius: '5px', color: '#282a35', padding: '10px' });
    } else if (checkIdLength(values.msv) == false) {
      setErrorlogin(<div><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#D9212C" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"></path></svg>Mã sinh viên không hợp lệ<br></br>Yêu cầu đủ 8 ký tự và chỉ chứa ký tự số</div>);
      setLogboxStyle({ backgroundColor: '#ffc0c7', margin: "20px auto", borderRadius: '5px', color: '#282a35', padding: '10px' });
    } else if (checkIdExisted(values, tableData)) {
      setErrorlogin(<div><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#D9212C" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"></path></svg>Mã sinh viên đã tồn tại!</div>);
      setLogboxStyle({ backgroundColor: '#ffc0c7', margin: "20px auto", borderRadius: '5px', color: '#282a35', padding: '10px' });
    }
    else {
      onSubmit(values);
      const student = {};
      student.msv = values.msv
      student.ten = values.ten;
      student.nsinh = values.nsinh;
      student.que = values.que;
      console.log(student);
      /**
       * them sinh vien
       */
      axios.post("http://localhost:8000/students/", student);
      onClose();
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Thêm Mới Sinh Viên</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            {columns.map((column) => (
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            ))}
          </Stack>
        </form>
      </DialogContent>
      <Box component="span" style={logBoxstyle} sx={{ display: { xs: 'block', sm: 'block' } }}>{errorLogin}</Box>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Hủy</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default CreatePanel;