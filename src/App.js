import React, { useState } from 'react';
import axios from 'axios';
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';

export default function App() {

  const [selectedFile, setSelectedFile] = useState({
    file: null
  });

  const [filesLoaded, setFilesLoaded] = useState({
    loaded: 0
  })

  const onChangeHandler = event => {
    if (maxSelectFile(event) && checkMimeType(event) && checkFileSize(event)) {
      setSelectedFile({
        file: event.target.files
      })
    }
  }

  const maxSelectFile = event => {
    let files = event.target.files // create file object
    if (files.length > 3) {
      const msg = 'Only 3 images can be uploaded at a time'
      event.target.value = null // discard selected file
      toast.warn(msg)
      return false;

    }
    return true;
  }

  const checkMimeType = event => {
    let files = event.target.files
    let err = [] // create empty array
    const types = ['image/png', 'image/jpeg', 'image/gif']
    for (var x = 0; x < files.length; x++) {
      if (types.every(type => files[x].type !== type)) {
        err[x] = files[x].type + ' is not a supported format\n';
        // assign message to array
      }
    };
    for (var z = 0; z < err.length; z++) { // loop create toast massage
      event.target.value = null
      toast.error(err[z])
    }
    return true;
  }

  const checkFileSize = (event) => {
    let files = event.target.files
    let size = 2000000
    let err = [];
    for (var x = 0; x < files.length; x++) {
      if (files[x].size > size) {
        err[x] = files[x].type + 'is too large, please pick a smaller file\n';
      }
    };
    for (var z = 0; z < err.length; z++) {
      toast.error(err[z])
      event.target.value = null
    }
    return true;

  }

  const onClickHandler = () => {
    const data = new FormData()
    const { file } = selectedFile;

    for (var x = 0; x < file.length; x++) {
      data.append('file', file[x])
    }

    axios.post("http://localhost:8000/upload", data, {
      onUploadProgress: ProgressEvent => {
        setFilesLoaded({
          loaded: (ProgressEvent.loaded / ProgressEvent.total * 100),
        })
      },
    })
      .then(res => { // then print response status
        toast.success('upload success')
      })
      .catch(err => {
        toast.error('upload fail')
      })
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <form method="post" action="#" id="#"><div className="form-group files">
            <label>Upload Your File </label>
            <input type="file" className="form-control" multiple onChange={onChangeHandler} />
          </div>
          </form>
          <div className="form-group">
            <Progress max="100" color="success" value={filesLoaded.loaded} >{Math.round(filesLoaded.loaded, 2)}%</Progress>
          </div>
        </div>
        <div className="col-md-6">
          <form method="post" action="#" id="#">
            <div className="form-group files color">
              <label>Upload Your File </label>
              <input type="file" className="form-control" multiple />
            </div>
          </form>
        </div>
      </div>

      <button type="button" className="btn btn-success btn-block" onClick={onClickHandler}>Upload</button>

      <div className="form-group">
        <ToastContainer />
      </div>
    </div>
  );
}
