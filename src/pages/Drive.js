import { Container, Stack, Box, Typography, Card } from "@mui/material";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import Page from "../components/Page";
import { Web3StorageContext } from "../context/Web3Storage";

function Drive() {
  const web3StorageContext = React.useContext(Web3StorageContext);
  const {
    storeDriveFiles,
    storeDriveFilesWithLighthouse,
    getDocuments,
    getDocumentsFromLightHouse,
    isUpdated,
    loading,
    docsFiles,
  } = web3StorageContext;

  useEffect(() => {
    // getDocuments();
    getDocumentsFromLightHouse();
  }, [isUpdated]);

  async function onChange(e) {
    const data = e.target.files;

    try {
      if (
        data[0].type == "application/pdf" ||
        data[0].type == "application/json" ||
        data[0].type == "image/png" ||
        data[0].type == "image/jpg" ||
        data[0].type == "image/jpeg" ||
        data[0].type == "text/plain" ||
        data[0].type == "text/csv"
      ) {
        // await storeDriveFiles(data[0]);
        await storeDriveFilesWithLighthouse(e);
      } else {
        toast.error("Please upload pdf, json, txt, csv, png, jpg or jpeg!");
      }
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  function handleSrc(type) {
    switch (type) {
      case "application/pdf":
        return "/images/pdf.png";
        break;
      case "application/json":
        return "/images/json.png";
        break;
      case "text/plain":
        return "/images/docs.png";
        break;
      case "text/csv":
        return "/images/csv.png";
        break;
      case "image/png":
        return "/images/image-file.png";
        break;
      case "image/jpg":
        return "/images/image-file.png";
        break;
      case "image/jpeg":
        return "/images/image-file.png";
        break;
      default:
        return "/images/docs.png";
        break;
    }
  }

  return (
    <Page title="Drive |  Cryptic Vault">
      <Container pl={0} pr={0}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
          className="uploadArea"
        >
          <div className="d-create-file">
            <label
              htmlFor="files"
              id="get_file"
              name="image"
              className="btn-main"
              style={{
                backgroundColor: "#6dbf8b",
                fontSize: "16px",
                padding: "10px 20px 10px 20px",
                borderRadius: "6px",
                color: "white",
                cursor: "pointer",
              }}
            >
              {loading ? "Uploading..." : "Upload"}
            </label>
            <input
              id="files"
              name="image"
              style={{ display: "none" }}
              type="file"
              onChange={onChange}
            />
          </div>
        </Stack>
        <Stack direction="row" spacing={2}>
          {docsFiles &&
            docsFiles.map((doc, index) => {
              return (
                <Box xs={12} sm={3} md={2} key={index}>
                  <Card>
                    <Stack
                      spacing={2}
                      sx={{ p: 3, width: "180px", height: "200px" }}
                    >
                      <img src={handleSrc(doc.type)}></img>
                      <a href={doc.file} target={"balank"}>
                        <Typography variant="subtitle2" noWrap>
                          {doc.name}
                        </Typography>
                      </a>
                    </Stack>
                  </Card>
                </Box>
              );
            })}
        </Stack>
      </Container>
    </Page>
  );
}

export default Drive;
