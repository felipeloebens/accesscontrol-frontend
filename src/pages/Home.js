import { useState, useEffect } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {  toast } from 'react-toastify';
import dayjs from 'dayjs';
import { Search, Sync, Edit, Close, Save } from '@mui/icons-material/';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import {Grid, Tabs, Tab, Typography, Box, Card, CardHeader, TextField, CircularProgress, Button, InputAdornment, IconButton, Modal, CardContent } from '@mui/material/';
import moment from "moment/moment";

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width : 500,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

const styleCloseButton = {
  position: 'absolute',
  left: '91%',
  top: '2%',
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function Home() {
  const [ value, setValue ] = useState(0);
  const [ open, setOpen] = useState(false);
  const [ dataFlow, setDataFlow ] = useState(null);
  const [ dataScale, setDataScale ] = useState(null);
  const [ dataArray, setDataArray ] = useState([]);
  const [ dataArrayScale, setDataArrayScale ] = useState([]);
  const [ dateStart, setDateStart ] = useState(null);
  const [ dateEnd, setDateEnd ] = useState(null);
  const [ dateStartScale, setDateStartScale ] = useState(null);
  const [ dateEndScale, setDateEndScale ] = useState(null);
  const [ startSearch, setStartSeach ] = useState(true);
  const [ startSearchScale, setStartSeachScale ] = useState(true);
  const [ licenseFilter, setLicenseFilter ] = useState("");
  const [ licenseFilterScale, setLicenseFilterScale ] = useState("");
  const [ actualDate, setActualDate ] = useState(Date.now());
  const [ idEdit, setIdEdit ] = useState(null);
  const [ passDateEdit, setPassDateEdit ] = useState(null);
  const [ weightEdit, setWeightEdit ] = useState(null);
  const [ licenseEdit, setLicenseEdit ] = useState("");
  const [ saveEdit, setSaveEdit ] = useState(false);
  const [ initialDate, setInitialDate ] = useState((actualDate) - ((60 * 1440) * 1000));
  const [ refresh, setRefresh ] = useState(false);
  const [ actualWeight, setActualWeight ] = useState(null);


  const handleClose = () => setOpen(false);

  const handleChange = (event, newValue) => {setValue(newValue);};

  const onButtonClick = (e, row) => {
    e.stopPropagation();
    setIdEdit(row.id);
    setWeightEdit(row.weight);
    setPassDateEdit(row.pass_date);
    setLicenseEdit(row.license);
    setOpen(true)
};

  async function getDataFlow(){
    const getData = await axios.get(`http://${process.env.REACT_APP_BACKEND_SERVER}/api/database/listFlow`,{headers : {startdate : dateStart, finaldate : dateEnd}});
    return getData.data;
  }

  async function getDataScale(){
    const getData = await axios.get(`http://${process.env.REACT_APP_BACKEND_SERVER}/api/database/listWeights`,{headers : {startdate : dateStartScale, finaldate : dateEndScale}});
    return getData.data;
  }

  async function getScale(){
    const getData = await axios.get(`http://${process.env.REACT_APP_BACKEND_SERVER}/api/scales/display`);
    return getData.data.actualWeight;
  }

  async function updateLicense(){
    const putLicense = await axios.put(`http://${process.env.REACT_APP_BACKEND_SERVER}/api/database/updateWeight`,{id : idEdit, license : licenseEdit.toUpperCase()});
    return putLicense.data;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getScale().then((response) => {setActualWeight(response)});
    }, 1500);

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    setDateEnd(moment(actualDate).format("YYYY/MM/DD HH:mm:ss"));
    setDateStart(moment(initialDate).format("YYYY/MM/DD HH:mm:ss"));

    setDateEndScale(moment(actualDate).format("YYYY/MM/DD HH:mm:ss"));
    setDateStartScale(moment(initialDate).format("YYYY/MM/DD HH:mm:ss"));
  }, [initialDate, actualDate])

  useEffect(() => {
    const element = document.getElementById("video-canvas");
    if(element) {
      var videoUrl = `ws://${process.env.REACT_APP_IP_SERVER}:3006/`;
      var player = new JSMpeg.VideoElement("#video-canvas", videoUrl, {
        autoplay: true,
      });
    } 
  }, [document.getElementById("video-canvas"), handleChange])

  useEffect(() => {
    if((dateEnd !== null) && (dateStart !== null) && startSearch){
    getDataFlow().then((response) => {setDataFlow(response); setDataArray(response)}, setStartSeach(false))
    }
    if((dateEndScale !== null) && (dateStartScale !== null) && startSearchScale){
      getDataScale().then((response) => {setDataScale(response); setDataArrayScale(response)}, setStartSeachScale(false))
      }
  }, [startSearch, dateEnd, dateStart, startSearchScale, dateEndScale, dateStartScale])

  useEffect(() => {
    if(saveEdit && (licenseEdit !== "")){
      updateLicense().then((response) => response.rowsAffected > 0 ? toast.success("Placa " + licenseEdit + " Ok") : toast.error("Placa " + licenseEdit + " Erro!"), setSaveEdit(false))
    setStartSeachScale(true);
    }
    setSaveEdit(false);
    
  }, [saveEdit])

  useEffect(() => {
    if(licenseFilter !== ""){
      let filterArray = dataFlow.filter((item) => {
        let licensePlate;
        if((item.license !== null) && (item.license !== "")){
          licensePlate = item.license.toUpperCase();
          return licensePlate.includes(licenseFilter.toUpperCase());
        }
    });
      setDataArray(filterArray);
  }else{
    setDataArray(dataFlow);
  }
  }, [licenseFilter])

  useEffect(() => {
    if(licenseFilterScale !== ""){
      let filterArray = dataScale.filter((item) => {
        let licensePlate
        if((item.license !== null) && (item.license !== "")){
          licensePlate = item.license.toUpperCase();
          return licensePlate.includes(licenseFilter.toUpperCase());
        }
    });
      setDataArrayScale(filterArray);
  }else{
    setDataArrayScale(dataScale);
  }
  }, [licenseFilterScale])

  useEffect(() => {
    if(refresh === true){
      setActualDate(Date.now());
      setInitialDate((actualDate) - ((60 * 1440) * 1000));
      setRefresh(false);
      setStartSeach(true);
      setStartSeachScale(true);
    }
  }, [refresh])


  const columns = [
    { field: 'license', headerName: 'Placa', width: 150 },
    { field: 'pass_date', headerName: 'Data/Hora', width: 200 },
    { field: 'way', headerName: 'Sentido', width: 130 },
  ];

  const columnsScale = [
    { field: 'license', headerName: 'Placa', width: 150 },
    { field: 'pass_date', headerName: 'Data/Hora', width: 200 },
    { field: 'weight', headerName: 'Peso', width: 130 },
    { field: 'actions', headerName: 'Ações', width: 50, renderCell: (params) => {
      return (
        <IconButton
          onClick={(e) => {onButtonClick(e, params.row);}}>
            <Edit/>
        </IconButton>
      );
    } }
  ];
  
  return (
<>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={styleModal}>
            <Grid container padding={1} spacing={1}>
            <IconButton sx={styleCloseButton} onClick={handleClose}>
              <Close />
            </IconButton>
            <Typography id="modalTittle" variant="h6" component="h2" sx={{marginBottom : "10px"}}>
                Editar Placa
            </Typography>
            <Grid container spacing={1} padding={1}>
            <Grid item xs={12} md={6} lg={6} sx={{ justifyContent: "flex-start", display: "flex"}}>
              <TextField 
                id="editLicense"
                label="Placa" 
                variant="outlined" 
                value={licenseEdit}
                onChange={(e) => setLicenseEdit(e.target.value)}
                inputProps={{ maxLength: 9 }}
              />
              </Grid>
              <Grid item xs={12} md={6} lg={6} sx={{ justifyContent: "flex-start", display: "flex"}}>
              <TextField 
                id="editPassDate"
                label="Data/Hora" 
                variant="outlined" 
                value={passDateEdit}
                InputProps={{
                  readOnly: true,
                }}
              />
              </Grid>
              <Grid item xs={12} md={6} lg={6} sx={{ justifyContent: "flex-start", display: "flex"}}>
              <TextField 
                id="editWeight"
                label="Peso" 
                variant="outlined" 
                value={weightEdit}
                InputProps={{
                  readOnly: true,
                }}
              />
              </Grid>
              <Grid item xs={12} md={6} lg={6} sx={{ justifyContent: "flex-start", display: "flex"}}>
              <Button id="saveEdit" variant="contained" color="button"  onClick={() =>
                (licenseEdit !== "") && (licenseEdit !== null) ? setSaveEdit(true) : 
                 toast.error("Placa inválida!")} endIcon={<Save />}>Salvar</Button>
              </Grid>
            </Grid>
            </Grid>
            </Box>
          </Modal>
  
    <Grid container padding={1} spacing={1}>
      <Grid item xs={12} md={12} lg={12}>
      <Card>
        <CardHeader style={{ textAlign: 'left' }} title="Home"/>
      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab label="Portaria" {...a11yProps(0)} />
        <Tab label="Balança" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
      {(dateStart !== null && dateEnd !== null && dataFlow !== null) ? (
        <>
        
        <Grid container spacing={2} sx={{ display: 'flex', alignItems: 'flex-start'  }}>
          
          <Grid item xs={12} md={12} lg={8} >
          <Card elevation={3}>
            <CardContent>
            <Grid item xs={12} md={12} lg={12} padding={1}>
            
            <Grid container spacing={1}>   
              <Grid item xs={12} md={6} lg={3} sx={{ justifyContent: "flex-start", display: "flex"}}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                id="filterStartDateFlow"
                label="Data Inicial"
                format="DD/MM/YYYY HH:mm"
                ampm={false}
                value={dateStart === null ? dayjs('1970-08-18T21:11:54') : dayjs(dateStart) }
                onChange={(e) => setDateStart(dayjs(e).format("YYYY/MM/DD HH:mm:ss"))}
              />
              </LocalizationProvider>
              </Grid>
    
              <Grid item xs={12} md={6} lg={3} sx={{ justifyContent: "flex-start", display: "flex"}}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                id="filtere=EndDateFlow"
                format="DD/MM/YYYY HH:mm"
                label="Data Final"
                ampm={false}
                value={dateEnd === null ? dayjs('1970-08-18T21:11:54') : dayjs(dateEnd) }
                onChange={(e) => setDateEnd(dayjs(e).format("YYYY/MM/DD HH:mm:ss"))}
              />
              </LocalizationProvider>
              </Grid>
    
              <Grid item xs={12} md={6} lg={2} sx={{ justifyContent: "flex-start", display: "flex"}}>
              <TextField 
                id="filterLicenseFlow"
                label="Placa" 
                variant="outlined" 
                value={licenseFilter}
                onChange={(e) => setLicenseFilter(e.target.value)}
              />
              </Grid>

              <Grid item xs={12} md={6} lg={2} sx={{ justifyContent: "flex-start", display: "flex"}}>
              <Button id="searcFlow" variant="contained" color="button"  onClick={() => setStartSeach(true)}  endIcon={<Search />}>Buscar</Button>
              </Grid>

              <Grid item xs={12} md={6} lg={2} sx={{ justifyContent: "flex-start", display: "flex"}}>
              <Button id="refresh" variant="contained" color="button"  onClick={() => setRefresh(true)}  endIcon={<Sync />}>Atualizar</Button>
              
              </Grid>
              
            </Grid>

          </Grid>

            <Grid item xs={12} md={12} lg={12} padding={1} style={{ maxHeight: '600px', overflow: 'auto', scrollbarGutter: 'stable'}}>
              <DataGrid
                id="dataGridFlow"
                rows={dataArray || []}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 50 },
                  },
                }}
                pageSizeOptions={[5, 10, 20, 50]}

              />
            </Grid>
            </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={12} lg={4} sx={{ alignItems: "flex-start", display: "flex"}}>
          <Card elevation={3} sx={{ alignItems: "center", display: "flex", flexDirection: "column"}}> 
          <h4>Câmera Portaria</h4>
          <CardContent>
          <div id="video-canvas" style={{ height: "480px", width: "580px" , margin : "10px"}}></div>
          </CardContent>
          </Card>
          </Grid>
        </Grid>
        </>) : (<CircularProgress />)}
      </TabPanel>
      <TabPanel value={value} index={1}>
      <Grid container spacing={2} sx={{ display: 'flex', alignItems: 'flex-start'  }}>

          <Grid item xs={12} md={12} lg={8}>
            <Card elevation={3}>
            <CardContent>
            <Grid item xs={12} md={12} lg={12} padding={1} sx={{marginBottom : "10px"}} > 
            <Grid container spacing={1}>   
              <Grid item xs={12} md={6} lg={3} sx={{ justifyContent: "flex-start", display: "flex"}}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                id="filterStartDateScale"
                label="Data Inicial"
                format="DD/MM/YYYY HH:mm"
                ampm={false}
                value={dateStartScale === null ? dayjs('1970-08-18T21:11:54') : dayjs(dateStartScale) }
                onChange={(e) => setDateStartScale(dayjs(e).format("YYYY/MM/DD HH:mm:ss"))}
                
              />
              </LocalizationProvider>
              </Grid>
    
              <Grid item xs={12} md={6} lg={3} sx={{ justifyContent: "flex-start", display: "flex"}}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                id="filtere=EndDateScale"
                format="DD/MM/YYYY HH:mm"
                label="Data Final"
                ampm={false}
                value={dateEndScale === null ? dayjs('1970-08-18T21:11:54') : dayjs(dateEndScale) }
                onChange={(e) => setDateEndScale(dayjs(e).format("YYYY/MM/DD HH:mm:ss"))}
              />
              </LocalizationProvider>
              </Grid>
    
              <Grid item xs={12} md={6} lg={2} sx={{ justifyContent: "flex-start", display: "flex"}}>
              <TextField 
                id="filterLicenseScale"
                label="Placa" 
                variant="outlined" 
                value={licenseFilterScale}
                onChange={(e) => setLicenseFilterScale(e.target.value)}
              />
              </Grid>
              
              <Grid item xs={12} md={6} lg={2} sx={{ justifyContent: "flex-start", display: "flex"}}>
              <Button id="searchScale" variant="contained" color="button"  onClick={() => setStartSeachScale(true)}  endIcon={<Search />}>Buscar</Button>
              </Grid>

              <Grid item xs={12} md={6} lg={2} sx={{ justifyContent: "flex-start", display: "flex"}}>
              <Button id="refresh" variant="contained" color="button"  onClick={() => setRefresh(true)}  endIcon={<Sync />}>Atualizar</Button>
              </Grid>
              
              </Grid>
            
            </Grid>
            
            <Grid item xs={12} md={12} lg={12} padding={1} style={{ maxHeight: '600px', overflow: 'auto', scrollbarGutter: 'stable'}}>
              <DataGrid
                id="dataGridScale"
                rows={dataArrayScale || []}
                columns={columnsScale}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 50 },
                  },
                }}
                pageSizeOptions={[5, 10, 20, 50]}
              />
            </Grid>
            </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={12} lg={4} sx={{ alignItems: "flex-start", display: "flex"}}>
          <Card elevation={3} sx={{ alignItems: "center", display: "flex", flexDirection: "column"}}>
          <h4>Peso Atual</h4>
          <CardContent>
          <TextField
          value={actualWeight}
          id="actualWeightDisplay"
          sx={{input: {textAlign: "center"}, margin: "20px", marginTop: "-2px"}}
          InputProps={{
            readOnly: true,
            startAdornment: <InputAdornment position="start">kg</InputAdornment>,
          }}
          variant="outlined"
        />
        </CardContent>
          </Card>
          </Grid>
        </Grid>
      </TabPanel>
      </Card>
      </Grid>

    </Grid>
</>
  );
}

export default Home;