
const handleFileUpload = (e, files, setFiles, fileNames, setFileNames) => {
  const fileReader = new FileReader();
  if (e.target.files && e.target.files[0]) {
    setFileNames([...fileNames, e.target.files[0].name]);
    fileReader.readAsDataURL(e.target.files[0]);
    fileReader.onload = (loaded) => {
      setFiles([...files, loaded.target.result]);
    }
  }
}

const deleteFile = (index, files, setFiles, fileNames, setFileNames) => {
  const newFileNames = [...fileNames];
  const newFiles = [...files];
  newFileNames.splice(index, 1);
  newFiles.splice(index, 1);
  setFiles(newFiles);
  setFileNames(newFileNames);
}

export {
  handleFileUpload,
  deleteFile
}