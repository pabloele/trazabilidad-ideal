import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  useMediaQuery,
  Tabs,
  Tab,
} from "@mui/material";

import ImageIcon from "@mui/icons-material/Image";
import Image from "next/image";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AttachmentIcon from "@mui/icons-material/Attachment";
import styled from "styled-components";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import ClassIcon from "@mui/icons-material/Class";
import { v4 } from "uuid";
import HighlightOffSharpIcon from "@mui/icons-material/HighlightOffSharp";
import TabPanel from "../TabPanel/TabPanel";
import useProduct from "../../hooks/useProduct";
import { useRouter } from "next/router";
import useMilestone from "../../hooks/useMilestone";
import { useProductStore } from "../../store";
import useModalStore from "../../store/useModalStore";
import Swal from "sweetalert2";
const CustomTextField = styled.textarea`
  width: 100%;
  height: 150px;
  padding: 8px;
  border: 1px solid #cfcdcd28;
  background-color: #cfcdcd28;
  border-radius: 4px;
  outline: none;
  overflow-y: auto;
  resize: none;
`;

const EditTrazability = ({ milestoneForEdit }) => {
  const router = useRouter();
  const index = 0;
  const isSmallScreen = useMediaQuery("(min-width: 600px)");

  const [showCategories, setShowCategories] = useState(false);
  const [tabActive, setTabActive] = useState(0);
  const [subprocessSelected, setSubprocessSelected] = useState();
  const { setProduct, uploadProduct, uploadQr } = useProduct(router.query.id);

  const { product, setProductData } = useProductStore();

  const { onClose, onOpen } = useModalStore();


  

  const modalStore = useModalStore();

  const {
    milestone,
    setMilestone,
    handleImageUpload,
    fileUri,
    setFileUri,
    handleAddMilestone,
    handleFileUpload,
    handleChangeMilestoneField,
    handleRemoveAtachment,
  } = useMilestone();
  const [showTextField, setShowTextField] = useState(true);

  const handleTextClick = () => {
    setShowTextField(true);
  };

  const [showAtachmentFields, setShowAtachmentFields] = useState([]);

  const handleClickAtachment = () => {
    setShowAtachmentFields((prevAttachmentFields) => {
      const updatedFields = [...prevAttachmentFields];
      updatedFields[index] = true;
      return updatedFields;
    });
    handleFileUpload();
  };

  const [description, setDescription] = useState("");

  const handleSaveClick = () => {
    setMilestone((prevMilestone) => {
      const newMilestones = [...prevMilestones];
      newMilestones[index].description = description;
      return newMilestones;
    });
  };

  const handleOpenCategories = (index) => {
    setShowCategories(true);
  };

  const handleClickSubprocess = ({ name, path }) => {
    // const updatedMilestones = [...milestones];

    handleChangeMilestoneField({ target: { name: "name", value: name } });

    const subprocess = name;

    setSubprocessSelected(subprocess);
    // setPath(path);
    // setMilestones([...updatedMilestones]);

    setMilestone({ ...milestoneForEdit, name: subprocessSelected });

    setShowCategories(false);
  };
  const handleChangeTab = (event, newValue) => {
    console.log("event", event.target.value);
    console.log("value", newValue);
    setTabActive(newValue);
  };

  const saveMilestone = async () => {
    if (
      milestoneForEdit.image === "" ||
      milestoneForEdit.description === "" ||
      milestoneForEdit.name === ""
    ) {
      alert(`Descripción, imagen y/o categoría faltantes`);

      return;
    }

    try {
      const updatedProduct = { ...product };

      updatedProduct.trazability.forEach((line) => {
        if (line.path === milestoneForEdit.path) {
          console.log(line);
          const matchingSubprocess = line.line.find(
            (subprocess) => subprocess.name === subprocessSelected
          );

          if (matchingSubprocess) {
            matchingSubprocess.milestones.push(milestone);
          }
        }
      });
      setProductData({ ...updatedProduct });
      await uploadProduct(updatedProduct);

      modalStore.onClose();

      Swal.fire({
        title: "Agregado correctamente",
        text: "Hito agregado correctamente",
        icon: "success",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {showCategories && (
        <React.Fragment>
          <Grid display="flex" justifyContent="center">
            <Tabs
              variant="scrollable"
              onChange={handleChangeTab}
              value={tabActive}
            >
              {product.trazability.map((element, index) => (
                <Tab
                  label={element.name}
                  sx={{
                    color: "primary.main",
                  }}
                  key={element.name}
                />
              ))}
            </Tabs>
          </Grid>

          {product?.trazability?.map((element, index) => (
            // categoría
            <Box key={element.name}>
              <TabPanel
                sx={{ display: "flex", flexDirection: "row", gap: 2 }}
                value={tabActive}
                index={index}
                key={index}
              >
                {element.line.map((subprocess, subprocessIndex) => (
                  <Box
                    key={subprocessIndex}
                    sx={{
                      marginTop: 1,
                      backgroundColor:
                        subprocessSelected === subprocess.name
                          ? "primary.main"
                          : "transparent",
                      transition: "gray 0.3s ease",
                      borderRadius: "40px",
                    }}
                  >
                    <Typography
                      onClick={() => {
                        handleClickSubprocess({
                          path: element.path,
                          name: subprocess.name,
                        });
                      }}
                      name={subprocess.name}
                      sx={{
                        color:
                          subprocessSelected === subprocess.name
                            ? "white"
                            : "primary.main",
                        marginY: 1,
                        marginX: 1,
                        fontSize: 12,
                        textTransform: "uppercase",
                        ":hover": {
                          cursor: "pointer",
                        },
                      }}
                    >
                      {subprocess.name}
                    </Typography>
                  </Box>
                ))}
              </TabPanel>
            </Box>
          ))}
        </React.Fragment>
      )}
      <Box sx={{ padding: 4 }} width="100%">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: 1,
          }}
        >
          <Button onClick={saveMilestone}>Editar</Button>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              marginBottom: 2,
              gap: 2,
            }}
          >
            <React.Fragment>
              <Box display="flex" flexDirection="row" alignItems="center">
                <Box
                  width={"65vw"}
                  display="flex"
                  flexDirection={isSmallScreen ? "row" : "column"}
                  key={index}
                  marginY={2}
                >
                  {/* left */}
                  <Box
                    sx={{
                      borderRadius: isSmallScreen
                        ? "120px 0 0 120px"
                        : "120px 120px 0 0",
                      border: "5px solid",
                      borderColor: "gray",
                      borderBottom: isSmallScreen ? "" : "none",
                      borderRight: isSmallScreen ? "none" : "",
                      height: isSmallScreen ? "240px" : "140px",
                      width: isSmallScreen ? "140px" : "240px",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "20px",
                      display: "flex",
                      bgcolor: "#e7e7e67a",
                    }}
                  >
                    {/* card actions */}
                    {!isSmallScreen && (
                      <Grid
                        item
                        sx={{
                          padding: 0,
                          margin: 0,
                          alignItems: "center",
                          justifyContent: "center",
                          ":hover": {
                            cursor: "pointer",
                          },
                        }}
                      ></Grid>
                    )}
                  </Box>
                  {/* center */}
                  <Grid
                    container
                    direction={isSmallScreen ? "row" : "column"}
                    gap={4}
                    sx={{
                      border: "5px solid",
                      borderColor: "gray",
                      borderLeft: isSmallScreen ? "none" : "",
                      borderRight: isSmallScreen ? "none" : "",
                      borderTop: isSmallScreen ? "" : "none",
                      borderBottom: isSmallScreen ? "" : "none",
                      height: isSmallScreen ? "240px" : "100%",
                      width: isSmallScreen ? "100%" : "240px",
                      bgcolor: "#e7e7e67a",
                    }}
                  >
                    <Grid
                      container
                      alignContent="center"
                      gap={2}
                      direction={isSmallScreen ? "row" : "column"}
                      sx={isSmallScreen ? { justifyContent: "center" } : {}}
                    >
                      {/* image */}
                      <Grid
                        item
                        onClick={() => handleImageUpload(index)}
                        borderRadius={4}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "#16161526",
                          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                          height: "150px",
                          width: "150px",
                          borderRadius: "20px",
                          cursor: "pointer",
                        }}
                      >
                        {milestoneForEdit.image ? (
                          <Image
                            src={milestoneForEdit.image}
                            width={150}
                            height={150}
                            alt={milestoneForEdit.image}
                            style={{
                              objectFit: "cover",
                              borderRadius: "20px",
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                          >
                            <ImageIcon
                              sx={{ fontSize: "6rem", color: "#0330ab" }}
                            />
                          </Box>
                        )}
                      </Grid>
                      {/* fields */}
                      <Grid
                        item
                        width="150px"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        bgcolor="whitesmoke"
                        borderRadius={4}
                      >
                        {showTextField ? (
                          <CustomTextField
                            borderRadius={4}
                            name="description"
                            value={milestoneForEdit.description}
                            onChange={handleChangeMilestoneField}
                          />
                        ) : (
                          <Box
                            onClick={handleTextClick}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: "#16161526",
                              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                              height: "150px",
                              width: "150px",
                              borderRadius: "20px",
                              cursor: "pointer",
                            }}
                          >
                            <EditNoteOutlinedIcon
                              sx={{
                                fontSize: "6rem",
                                color: "#0330ab",
                                display: "flex",
                              }}
                            />
                          </Box>
                        )}
                      </Grid>

                      {/* Atachment */}
                      {milestoneForEdit.atachments.length ? (
                        <Grid
                          item
                          width="150px"
                          height="150px"
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          bgcolor="#16161526"
                          borderRadius="20px"
                          direction="column"
                          // onClick={handleFileUpload}
                        >
                          <Paper
                            sx={{
                              marginTop: 3,
                              height: "5rem",

                              overflowY: "auto",
                              // cursor: 'pointer',
                              "&::-webkit-scrollbar": {
                                width: "4px",
                              },
                              "&::-webkit-scrollbar-track": {
                                background: "transparent",
                              },
                              "&::-webkit-scrollbar-thumb": {
                                background: "#8888888d",
                                borderRadius: "4px",
                              },
                            }}
                          >
                            <Box
                              // key={i}
                              width="7rem"
                              display={"flex"}
                              flexDirection={"column"}
                            >
                              {milestoneForEdit.atachments.map(
                                (atachment, i) => (
                                  <Box
                                    key={atachment.name}
                                    display="flex"
                                    flexDirection="row"
                                  >
                                    <Typography
                                      sx={{
                                        color: "#000",
                                        fontSize: "12px",
                                        textAlign: "center",
                                      }}
                                    >
                                      {atachment.name}
                                    </Typography>
                                    <Typography
                                      style={{
                                        color: "red",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        marginLeft: "0.2rem",
                                        textAlign: "center",
                                      }}
                                      onClick={() => handleRemoveAtachment(i)}
                                    >
                                      x
                                    </Typography>
                                  </Box>
                                )
                              )}
                            </Box>
                          </Paper>

                          <AddBoxIcon
                            onClick={handleFileUpload}
                            sx={{
                              cursor: "pointer",
                              color: "primary.main",
                              ":hover": {
                                cursor: "pointer",
                              },
                              marginBottom: 2,
                            }}
                          />
                        </Grid>
                      ) : (
                        <Grid
                          item
                          width="150px"
                          height="150px"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          bgcolor="#16161526"
                          borderRadius="20px"
                          onClick={() => handleClickAtachment(index)}
                          sx={{ cursor: "pointer" }}
                        >
                          <AttachmentIcon
                            sx={{
                              fontSize: "6rem",
                              color: "#0330ab",
                              cursor: "pointer",
                            }}
                          />
                        </Grid>
                      )}

                      {milestoneForEdit.name ? (
                        <Grid
                          item
                          width="150px"
                          height="150px"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          bgcolor="#16161526"
                          borderRadius="20px"
                          onClick={() => handleOpenCategories(index)}
                          sx={{ cursor: "pointer" }}
                        >
                          <Paper
                            sx={{
                              borderRadius: 4,
                              cursor: "pointer",
                            }}
                          >
                            <Typography
                              sx={{
                                textAlign: "center",
                                maxWidth: 120,
                                backgroundColor: "#e1e1e1",
                                borderRadius: 4,
                                padding: "5px",
                                fontSize: 12,
                                color: "primary.main",
                                flex: "1",
                              }}
                            >
                              {milestoneForEdit.name}
                            </Typography>
                          </Paper>
                        </Grid>
                      ) : (
                        <Grid
                          item
                          width="150px"
                          height="150px"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          bgcolor="#16161526"
                          borderRadius="20px"
                          onClick={() => handleOpenCategories(index)}
                          sx={{ cursor: "pointer" }}
                        >
                          <ClassIcon
                            sx={{
                              fontSize: "6rem",
                              color: "#0330ab",
                            }}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Grid>

                  {/* right */}
                  <Box
                    sx={{
                      borderRadius: isSmallScreen
                        ? "0 120px 120px 0"
                        : "0 0 120px  120px",
                      border: "5px solid",
                      borderColor: "gray",
                      borderTop: isSmallScreen ? "" : "none",
                      borderLeft: isSmallScreen ? "none" : "",
                      height: isSmallScreen ? "240px" : "140px",
                      width: isSmallScreen ? "140px" : "240px",
                      padding: "20px",
                      display: "flex",
                      bgcolor: "#e7e7e67a",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* card actions */}
                    {isSmallScreen && (
                      <Grid
                        item
                        sx={{
                          padding: 0,
                          margin: 0,
                          alignItems: "center",
                          justifyContent: "center",
                          ":hover": {
                            cursor: "pointer",
                          },
                        }}
                      ></Grid>
                    )}
                  </Box>
                </Box>
              </Box>
            </React.Fragment>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default EditTrazability;