import {
  FormControl,
  FormHelperText,
  Grid,
  Input,
  InputLabel,
  Button,
  Box,
} from "@mui/material";
import React from "react";
import mintImg from "../../public/images/milestone.png";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";

const AddMilestone = () => {
  const { uploadFile, getFile } = useAuth();
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

  const handleImageUpload = async (event) => {
    const selectedFile = event.target.files[0];
    let fileURI;
    if (selectedFile) {
      try {
        const response = await uploadFile(selectedFile);

        const firebaseFullPath = response.metadata.fullPath;

        fileURI = await getFile(firebaseFullPath);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error uploading file //", error.message);
        } else {
          console.error("Error uploading file");
        }
      }
    }

    console.log("FILE URI: ", fileURI);
    return fileURI;
  };

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      justifySelf="center"
      height="100vh"
      width="100%px"
      spacing={4}
    >
      <Grid
        item
        xs={4}
        sx={{ width: "100%", height: "400px", objectFit: "cover" }}
      >
        {/* <Box mb={2}> */}
        <Image src={mintImg} alt="Preview" style={{ objectFit: "cover" }} />
        {/* </Box> */}
      </Grid>
      <Grid item xs={4}>
        <FormControl fullWidth>
          <InputLabel htmlFor="my-input">Descripción</InputLabel>
          <Input id="my-input" aria-describedby="my-helper-text" />
          {/* <FormHelperText id="my-helper-text">Metadata</FormHelperText> */}
        </FormControl>
        <Grid container mt={2} width="100%" direction="row" spacing={2}>
          <Grid
            item
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Button variant="contained" component="label" htmlFor="file-input">
              Subir Imagen
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="file-input"
                style={{ display: "none" }}
              />
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              component="label"
              htmlFor="file-input"
              color="success"
            >
              Guardar
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="file-input"
                style={{ display: "none" }}
              />
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
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
