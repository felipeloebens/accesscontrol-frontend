import React, { useState, useEffect } from 'react';
import { Close } from '@mui/icons-material/';
import { IconButton, Grid, Box, Modal, Typography,} from '@mui/material';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

  
export default function ModalImage({
    openModal,
    closeModal,
    dataImg,
  }) {

    console.log(dataImg);

    const [ imageCamera1, setImageCamera1 ] = useState();
    const [ loading, setLoading ] = useState(true);

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

    const handleClose = () => {
        closeModal(!openModal);
    };

  async function getImageCamera1(){
    
    const getData = await axios.get(`http://${process.env.REACT_APP_BACKEND_SERVER}/api/cameras/imagesCamera1`,{params : {path : '/Portaria/2023-04-12/16/13/ANPR-20-368-IES5004.jpg', license: dataImg.license, pass_date: dataImg.pass_date}});
    setImageCamera1(getData.data);
    setTimeout(() => {
      setLoading(false);
    }, 350)
  }

  useEffect(() => {
    setLoading(true);
    getImageCamera1();
  }, [dataImg]);


  return (
    <Modal
    open={openModal}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >
      <>
      
        <Box sx={styleModal}>
        {loading === false ?
            (<Grid container padding={1} spacing={1}>
                <IconButton sx={styleCloseButton} onClick={handleClose}>
                <Close />
                </IconButton>
                <Typography id="modalTittle" variant="h6" component="h2" sx={{marginBottom : "10px"}}>
                    Foto
                </Typography>
                <Grid container spacing={1} padding={1}>

                <img width={440} height={400} src={imageCamera1}></img>
                </Grid>
            </Grid>):(
              <Grid container padding={1} spacing={1}>
                <Box height={400} width={400} sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              </Grid>
            )}
        </Box>
        </>
    </Modal>
  );
}