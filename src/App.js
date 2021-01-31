import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

export default function App() {

  const [selectedFile, setSelectedFile] = useState({
    file: null
  });

  const onChangeHandler = event => {
    setSelectedFile({
      file: event.target.files[0],
      loaded: 0
    })
  }

  const onClickHandler = () => {
    const data = new FormData();
    const { file } = selectedFile;
    data.append('file', file);

    axios.post("http://localhost:8000/upload", data, {
      // receive two    parameter endpoint url ,form data
    })
      .then(res => { // then print response status
        console.log(res.statusText)
      })
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <form method="post" action="#" id="#"><div className="form-group files">
            <label>Upload Your File </label>
            <input type="file" className="form-control" multiple="" onChange={onChangeHandler} />
          </div>
          </form>
        </div>
        <div className="col-md-6">
          <form method="post" action="#" id="#">
            <div className="form-group files color">
              <label>Upload Your File </label>
              <input type="file" className="form-control" multiple="" />
            </div>
          </form>
        </div>
      </div>

      <button type="button" className="btn btn-success btn-block" onClick={onClickHandler}>Upload</button>

    </div>
  );
}
