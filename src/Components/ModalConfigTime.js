/* eslint-disable react/no-danger */
import React, { useState } from 'react';
import { Close } from '@mui/icons-material/';
import { IconButton,Fade, Modal, Box, Grid } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  maxWidth: '500px',
  bgcolor: 'background.paper',
  border: '0px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 5,
};

export default function ModalConfigTime({
  openModal,
  closeModal,
}) {
 
  const handleClose = () => {
    closeModal(!openModal);
  };

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      closeAfterTransition
      style={{ transform: 'scale(1.5)' }}
    >
      <Fade in={openModal}>
        <Box sx={style}>
          <Grid container spacing={3} style={{ transform: 'scale(1.1)' }}>
            <Grid item xs={12} style={{ marginTop: '-10px', textAlign: 'right' }}>
              <IconButton onClick={handleClose}>
                <Close size={30} color="#556E7B" />
              </IconButton>
            </Grid>
            <Grid item xs={12} lg={12} md={12} spacing={1} style={{ marginTop: '-40px' }}>
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
              >
                <h1>Testeteeasdad</h1>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Modal>
  );
}
