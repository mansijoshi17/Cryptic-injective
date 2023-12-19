import React, { Fragment } from "react";
import "./Lending.css";
import Background from "../assets/Back.png";
import { Card } from "react-bootstrap";
import { alpha, styled } from "@mui/material/styles";

import TopImage from "../assets/dao-2.png";

// import Modal from "@material-ui/core/Modal";
// import Backdrop from "@material-ui/core/Backdrop";
import MetamaskImg from "../assets/metamask.png";
import wallet from "../assets/wallet.png";
import "./home.css";

import { Link } from "react-router-dom";

import Features from "./Features";

export default function Lending() {
  const RootStyle = styled(Card)(({ theme }) => ({
    boxShadow: "none",
    border: "none",
    textAlign: "center",
    padding: theme.spacing(5, 5),
    color: theme.palette.primary.main,
  }));

  const IconWrapperStyle = styled("div")(({ theme }) => ({
    margin: "auto",
    display: "flex",
    borderRadius: "50%",
    alignItems: "center",
    width: theme.spacing(8),
    height: theme.spacing(8),
    justifyContent: "center",
    marginBottom: theme.spacing(3),
    color: theme.palette.primary.main,
    backgroundImage: `linear-gradient(135deg, ${alpha(
      theme.palette.primary.main,
      0
    )} 0%, ${alpha(theme.palette.primary.dark, 0.24)} 100%)`,
  }));
  return (
    <Fragment>
      <div className="container section-margin">
        <div className="row">
          {/* <div className="col-12">
              <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className="launchModel"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 1000,
                }}
              >
                <div className="model-paper">
                  <h2 id="transition-modal-title">Welcome to FORX1</h2>
                  <p id="transition-modal-description" className="text-center">
                    react-transition-group animates me.
                  </p>
                  <div className="launch-model-margin">
                    <div className="model-metamask">
                      <img src={MetamaskImg} alt="" width="20" height="20" />
                      <p>MetaMask</p>
                    </div>
                    <div className="model-wallet border-none">
                      <img src={wallet} alt="" width="20" height="20" />
                      <p>Wallet Connect</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <Link to="/inventory" className="enterBtn">
                      continue
                    </Link>
                  </div>
                </div>
              </Modal>
            </div> */}
          <div className="col-12 col-lg-12 col-md-12  ">
            <h1 className="home-header-text">
              Privacy proof{" "}
              <span style={{ color: "#6EBF8B" }}> eSignature, </span>{" "}
              Decentralized{" "}
              <span style={{ color: "#6EBF8B" }}> Digital Vault! </span>
            </h1>
            <p className="home-body-text">
              Cryptic is perpetual data storage, management and privacy proof
              multiuser eSignature Dapp
            </p>
            <div className="watch-video-button mr-2">
              <button className="enterBtn">Learn More</button>
            </div>
          </div>
          {/* <div className="col-12 col-lg-5 col-md-5 home-top-image">
              <img src={TopImage} alt="" height="auto" width="100%" />
            </div> */}
        </div>
      </div>

      <div className="container-fluid bg-color-section-3 section-margin ">
        <div className="row">
          <div className="col-12 col-lg-6 text-center m-auto  ">
            <h1
              className="section-header-text mt-4 "
              style={{ fontSize: "36px", fontWeight: "bold" }}
            >
              The <span style={{ color: "#6EBF8B" }}>Cryptic</span> Covers
            </h1>
          </div>
        </div>
        <div className="container  mt-5 mb-5 ">
          {/* <div className="row">
            </div> */}
          <div className="row">
            <div className="col-12 col-lg-4 col-md-4 mt-4">
              <Features
                icon="lucide:clipboard-signature"
                name="Multiuser eSignature"
              />
            </div>

            <div className="col-12 col-lg-4 col-md-4 mt-4">
              <Features icon="clarity:storage-line" name="Perpetual Storage" />
            </div>

            <div className="col-12 col-lg-4 col-md-4 mt-4">
              <Features icon="mdi:wallet-membership" name="NFT Memberships" />
            </div>
            <div className="col-12 col-lg-4 col-md-4 mt-4">
              <Features
                icon="icon-park-outline:permissions"
                name="Access Permission"
              />
            </div>

            <div className="col-12 col-lg-4 col-md-4 mt-4">
              <Features icon="ic:baseline-add-to-drive" name="Drive" />
            </div>

            <div className="col-12 col-lg-4 col-md-4 mt-4">
              <Features icon="icon-park-outline:notes" name="Notes" />
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid  section-margin mb-5">
        <div className="row">
          <div className="col-12 col-lg-6 text-center m-auto  ">
            <h1
              className="section-header-text "
              style={{ marginBottom: "90px" }}
            >
              How does it work ?
            </h1>
          </div>
        </div>
        <div className="col-8 m-auto">
          <div className="row">
            <div className="col-12 col-lg-4 col-md-4">
              <p className="section-token">Create Agreement with Signature</p>
            </div>
            <div className="col-12 col-lg-4 col-md-4">
              <p className="section-token">Share link with the Members</p>
            </div>
            <div className="col-12 col-lg-4 col-md-4">
              <p className="section-token">Members will sign the agreement</p>
            </div>
            <div className="col-12 col-lg-4 col-md-4">
              <p className="section-token">NFT Memberships</p>
            </div>
            <div className="col-12 col-lg-4 col-md-4">
              <p className="section-token">Store encrypted files on IPFS</p>
            </div>
            <div className="col-12 col-lg-4 col-md-4">
              <p className="section-token"> Add members</p>
            </div>
            <div className="col-12 col-lg-4 col-md-4">
              <p className="section-token">Add Emergency Alert Message</p>
            </div>
            <div className="col-12 col-lg-4 col-md-4">
              <p className="section-token">Assign Access Permissions</p>
            </div>
            <div className="col-12 col-lg-4 col-md-4">
              <p className="section-token">Store encrypted Notes on IPFS</p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
