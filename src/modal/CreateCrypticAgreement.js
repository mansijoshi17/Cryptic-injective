import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Stack, TextField, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { styled } from "@mui/material/styles";
import cryptoJs from "crypto-js";

import { Web3StorageContext } from "../context/Web3Storage";
import { Web3Context } from "../context/Web3Context";
import PdfViewer from "./modal_components/pdfviewer";

function CreateCrypticAgreement(props) {
  const [pdfcid, setpdfCid] = useState("");
  const [pdfFile, setPdfFile] = useState("");
  const [uploading, setUploading] = useState(false);
  const [openPdf, setOpenPdf] = useState(false);

  const web3StorageContext = React.useContext(Web3StorageContext);
  const {
    makeFileObjects,
    storeJsonFiles,
    getEncryptData,
    storeAgreementFileWithLighthouse,
    storeDriveFiles,
    agreementCid,
  } = web3StorageContext;

  const web3Context = React.useContext(Web3Context);
  const { createAgreement, agreementLoading } = web3Context;

  const uploadPdf = async (e) => {
    setOpenPdf(true);

    var file = e.target.files[0];
    setPdfFile(file);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      members: [],
    },

    onSubmit: async (values, { resetForm }) => {
      try {
        setOpenPdf(false);
        const addresses = values.members.split(",").map(function (item) {
          return item.trim();
        });
        let files = await makeFileObjects(
          {
            pdfcid: pdfcid,
            members: addresses,
          },
          "agreement.json",
          "application/json"
        );
        let cid = await storeJsonFiles(files);
        values.cid = cid;
        values.members = addresses;
        await createAgreement(values);
        props.setIsUpdated(!props.isUpdated);
        props.close();
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div>
      <Dialog open={props.op} onClose={props.close} fullWidth>
        <DialogTitle
          style={{
            textAlign: "center",
          }}
        >
          Create Sign
        </DialogTitle>
        <DialogContent style={{ overflowX: "hidden" }}>
          <div>
            <Box style={{ marginBottom: "20px" }}></Box>
            <form
              onSubmit={formik.handleSubmit}
              style={{
                justifyContent: "center",
                marginLeft: "auto",
                marginRight: "auto",
                // marginTop: "100px",
              }}
            >
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  id="name"
                  type="text"
                  {...formik.getFieldProps("name")}
                />
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                  className="upload"
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
                      {"Upload"}
                    </label>
                    <input
                      id="files"
                      name="image"
                      style={{ display: "none" }}
                      type="file"
                      onChange={uploadPdf}
                    />
                  </div>
                </Stack>
                <PdfViewer
                  cid={pdfFile}
                  storeJsonFiles={storeJsonFiles}
                  makeFileObjects={makeFileObjects}
                  updatepdfCid={(cid) => setpdfCid(cid)}
                  updateUploading={(uploading) => setUploading(uploading)}
                  uploading={uploading}
                  storeDriveFiles={storeDriveFiles}
                  
                  agreementCid={agreementCid}
                />
                <TextField
                  fullWidth
                  label="Addresses"
                  name="members"
                  id="members"
                  type="text"
                  {...formik.getFieldProps("members")}
                  minRows={20}
                  helperText="Add multiple addresses seprated by (,)"
                />
              </Stack>

              <DialogActions>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={formik.isSubmitting}
                  disabled={uploading ? true : agreementLoading}
                >
                  {agreementLoading ? "Creating..." : "Create"}
                </LoadingButton>
                <Button onClick={props.close} variant="contained">
                  Cancel
                </Button>
              </DialogActions>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default CreateCrypticAgreement;
