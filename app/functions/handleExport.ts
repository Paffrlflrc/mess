const handleExport = (data: string) => {
  const tempA = document.createElement('a');
  tempA.download = `${new Date().getTime().toString()}.pdb`;
  const blob = new Blob(data.split(''), { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  tempA.href = url;
  tempA.click();
};

export default handleExport;
