import axios from "axios";

export const fetchData = async () => {
    let response = await axios.get("http://localhost:8000/students/");
    return response.data;
  };
