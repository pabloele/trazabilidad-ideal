import {
  FormControl,
  FormHelperText,
  Grid,
  Input,
  InputLabel,
  Button,
  Box,
  Typography,
} from "@mui/material";
import React from "react";
import mintImg from "../../public/images/milestone.png";
import Image from "next/image";
import { HomeLayout } from "../../layout";
import Protocols from "../../components/Protocols";
const AddMilestone = () => {
  const [image, setImage] = React.useState(mintImg);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <HomeLayout>
      <Box sx={{ color: "primary.main", width: "90%", marginX: "auto" }}>
        <Typography sx={{ fontSize: 24, marginY: 2, fontWeight: "bold" }}>
          ¿Qué vas a producir?
        </Typography>
        <Typography sx={{ fontSize: 20 }}>
          Solo se muestran los protocolos guardados
        </Typography>

        <Grid
          alignItems="center"
          justifyContent="center"
          justifySelf="center"
          height="90vh"
          width="100%px"
          spacing={4}
        >
          <Protocols />
        </Grid>
      </Box>
    </HomeLayout>
  );
};

export default AddMilestone;

// import { Image } from '@mui/icons-material';
// import {
//   FormControl,
//   FormHelperText,
//   Grid,
//   Input,
//   InputLabel,
//   Button,
//   Box,
// } from '@mui/material';
// import React from 'react';
// import mintImg from '../../public/images/nft_8146034.png';
// const AddMilestone = () => {
//   const [image, setImage] = React.useState(null);

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setImage(e.target.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <Grid container alignItems="center" justifyContent="center" height="100vh">
//       <Grid item>
//         <FormControl>
//           <InputLabel htmlFor="my-input">Descripción</InputLabel>
//           <Input id="my-input" aria-describedby="my-helper-text" />
//           <FormHelperText id="my-helper-text">Metadata</FormHelperText>
//         </FormControl>
//         <Box mt={2}>
//           <Button variant="contained" component="label" htmlFor="file-input">
//             Subir Imagen
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               id="file-input"
//               style={{ display: 'none' }}
//             />
//           </Button>
//         </Box>

//         <Box mt={2}>
//           <Image
//             src={mintImg}
//             alt="Preview"
//             style={{ Width: '200px', Height: '200px' }}
//           />
//         </Box>
//       </Grid>
//     </Grid>
//   );
// };

// export default AddMilestone;
