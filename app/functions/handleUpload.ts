const handleUpload = async (): Promise<string> => {
  return new Promise((resolve) => {
    const tempFileInput = document.createElement('input');
    tempFileInput.type = 'file';
    tempFileInput.click();
    tempFileInput.onchange = () => {
      const file = tempFileInput.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.toString();
        const string = window.atob(
          base64.slice(base64.indexOf('base64') + 'base64,'.length),
        );
        resolve(string);
      };
    };
  });
};

export default handleUpload;
