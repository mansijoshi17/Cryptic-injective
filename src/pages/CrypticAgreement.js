import React, { useEffect } from "react";
import {
  Button,
  Container,
  Stack,
  Box,
  Typography,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Card,
  TableBody,
} from "@mui/material";
import Chip from "@mui/material/Chip";

import { ethers } from "ethers";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Iconify from "src/components/Iconify";
import { Web3Context } from "src/context/Web3Context";

// import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import Page from "../components/Page";
import CreateCrypticAgreement from "src/modal/CreateCrypticAgreement";
import { shortAddress } from "src/config";

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
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function CrypticAgreement() {
  const [open, setOpen] = React.useState(false);
  const web3Context = React.useContext(Web3Context);
  const { getAgreements, agreements, agreementLoading } = web3Context;
  const [isUpdated, setIsUpdated] = React.useState(false);

  const [alertOpen, setAlertOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getAgreements();
  }, [isUpdated]);

  const CopyToClipboard = (toCopy) => {
    const el = document.createElement(`textarea`);
    el.value = toCopy;
    el.setAttribute(`readonly`, ``);

    document.body.appendChild(el);
    el.select();
    document.execCommand(`copy`);
    document.body.removeChild(el);
  };

  return (
    <Page title="Cryptic Sign |  Cryptic Vault">
      <Container pl={0} pr={0}>
        <CreateCrypticAgreement
          open={handleClickOpen}
          close={handleClose}
          op={open}
          setIsUpdated={setIsUpdated}
          isUpdated={isUpdated}
        />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h4" gutterBottom>
            Cryptic Sign
          </Typography>
          <Button
            variant="contained"
            onClick={handleClickOpen}
            to="#"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Create Sign
          </Button>
        </Stack>
        <Stack>
          <Card>
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Creator</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {agreementLoading && (
                    <TableRow>
                      <TableCell colSpan={3} sx={{ textAlign: "center" }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  )}
                  {agreements && agreements.length == 0 && (
                    <TableRow>
                      <TableCell colSpan={3} sx={{ textAlign: "center" }}>
                        <h5>Agreements are not added yet!</h5>
                      </TableCell>
                    </TableRow>
                  )}
                  {agreements &&
                    agreements.map((agreement) => (
                      <TableRow>
                        <TableCell>{agreement.name}</TableCell>
                        <TableCell>
                          <p
                            style={{
                              border: "1px solid #eee",
                              padding: "3px 15px",
                              borderRadius: "20px",
                              fontWeight: "bolder",
                              width: "fit-content",
                            }}
                          >
                            {shortAddress(agreement.creator)}
                          </p>
                        </TableCell>
                        {console.log(agreement.status)}
                        <TableCell>
                          {agreement.status === "Signed" ? (
                            <Chip
                              label={agreement.status}
                              color="success"
                              variant="outlined"
                            />
                          ) : (
                            <Chip
                              style={{
                                color: "dodgerblue",
                                border: "1px solid dodgerblue",
                              }}
                              label={agreement.status}
                              variant="outlined"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                              CopyToClipboard(
                                `https://cryptic-injective.vercel.app/dashboard/crypticsign/${agreement.aggAddress}`
                              );
                            }}
                          >
                            Copy Link
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Stack>
      </Container>
    </Page>
  );
}

export default CrypticAgreement;
