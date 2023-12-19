import React, { useRef, useEffect } from "react";
import { Button, Container, Stack, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";

import { ethers } from "ethers";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Iconify from "src/components/Iconify";
import { Web3Context } from "src/context/Web3Context";

import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import Page from "../components/Page";

import WebViewer from "@pdftron/webviewer";

function SignAgreementComp() {
  const viewer = useRef(null);
  const instance = useRef();
  const dataFetchedRef = useRef(false);
  const web3Context = React.useContext(Web3Context);
  const {
    getAgreementContract,
    viewPdf,
    pdfUrl,
    signAgreement,
    sLoading,
    checkMember,
  } = web3Context;
  const { address } = useParams();
  const [creator, setCreator] = React.useState("");
  const [updatedFile, setUpdatedFile] = React.useState();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      getOwner();
      viewPdf(address);
      let isMember = await checkMember(address);
      console.log(isMember);
      if (!isMember) {
        toast.error(
          "Your current wallet address is not eligable to sign or view this agreement!"
        );
        // console.log("I am called");
        navigate("/");
      }
    };
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    init();
  }, []);
  useEffect(() => {
    WebViewer(
      {
        path: "/webviewer/lib",
        initialDoc: pdfUrl,
      },
      viewer.current
    ).then((i) => {
      var Feature = i.UI.Feature;
      const { Tools } = i.Core;

      i.UI.disableElements(["toolbarGroup-Shapes"]);
      i.UI.disableElements(["toolbarGroup-Edit"]);
      i.UI.disableElements(["toolbarGroup-Insert"]);
      i.UI.disableElements(["toolbarGroup-Annotate"]);
      i.UI.disableElements(["toolbarGroup-Forms"]); // keep this in upload

      i.UI.disableElements(["leftPanel", "leftPanelButton"]);
      i.UI.disableFeatures([Feature.Search]);
      i.UI.disableFeatures([Feature.NotesPanel]);
      i.UI.disableFeatures([Feature.Print]);
      i.UI.disableFeatures([Feature.SavedSignaturesTab]);
      i.UI.disableFeatures([Feature.Annotations]);

      i.UI.disableTools([Tools.ToolNames.ERASER]);
      i.UI.disableTools([Tools.ToolNames.FORM_FILL_CHECKMARK]);
      i.UI.disableTools([Tools.ToolNames.FORM_FILL_CROSS]);
      i.UI.disableTools([Tools.ToolNames.FORM_FILL_DOT]);
      i.UI.disableTools([Tools.ToolNames.PAN]);
      i.UI.disableTools([Tools.ToolNames.SIGNATURE]);
      i.UI.disableTools([Tools.ToolNames.EDIT]);
      i.UI.disableTools([Tools.ToolNames.RUBBER_STAMPER]);
      i.UI.disableTools([Tools.ToolNames.TEXT_CREATE]);

      i.UI.disableTools(["AnnotationCreateFreeText"]);

      const { documentViewer, annotationManager, Annotations } = i.Core;
      instance.current = i;
      documentViewer.addEventListener("documentLoaded", async () => {
        const rectangleAnnot = new Annotations.RectangleAnnotation({
          PageNumber: 1,
          // values are in page coordinates with (0, 0) in the top left
          X: 100,
          Y: 150,
          Width: 100,
          Height: 100,
          Author: annotationManager.getCurrentUser(),
        });

        annotationManager.addAnnotation(rectangleAnnot);
        // need to draw the annotation otherwise it won't show up until the page is refreshed
        annotationManager.redrawAnnotation(rectangleAnnot);
      });

      i.UI.addEventListener("finishedSavingPDF", async () => {
        const doc = documentViewer.getDocument();
        const xfdfString = await annotationManager.exportAnnotations();
        const data = await doc.getFileData({
          // saves the document with annotations in it
          xfdfString,
        });
        const arr = new Uint8Array(data);
        const blob = new Blob([arr], { type: "application/pdf" });
        console.log(blob);
        setUpdatedFile(blob);
      });

      // document.getElementById("myBtn").addEventListener("click", async () => {
      //   await PDFNet.initialize();
      //   const doc = await documentViewer.getDocument().getPDFDoc();

      //   // Run PDFNet methods with memory management
      //   await PDFNet.runWithCleanup(async () => {
      //     // lock the document before a write operation
      //     // runWithCleanup will auto unlock when complete
      //     doc.lock();

      //     const replacer = await PDFNet.ContentReplacer.create();
      //     const page = await doc.getPage(1);

      //     // replace an image on the page

      //     const img = await PDFNet.Image.createFromURL(doc, imagename);
      //     await replacer.addImage(target_region, await img.getSDFObj());

      //     // replace a text placeholder
      //     await replacer.addString("INVOICE", "Invoice");

      //     // replace text in a given region

      //     await replacer.process(page);
      //   });

      //   // clear the cache (rendered) data with the newly updated document
      //   documentViewer.refreshAll();

      //   // Update viewer to render with the new document
      //   documentViewer.updateView();

      //   // Refresh searchable and selectable text data with the new document
      //   documentViewer.getDocument().refreshTextData();
      // });
      // var Feature = i.UI.Feature;
      // const { Tools } = i.Core;

      // i.UI.disableElements(["toolbarGroup-Shapes"]);
      // i.UI.disableElements(["toolbarGroup-Edit"]);
      // i.UI.disableElements(["toolbarGroup-Insert"]);
      // i.UI.disableElements(["toolbarGroup-Annotate"]);
      // i.UI.disableElements(["toolbarGroup-Forms"]); // keep this in upload

      // i.UI.disableElements(["leftPanel", "leftPanelButton"]);
      // i.UI.disableFeatures([Feature.Search]);
      // i.UI.disableFeatures([Feature.NotesPanel]);
      // i.UI.disableFeatures([Feature.Print]);
      // i.UI.disableFeatures([Feature.SavedSignaturesTab]);
      // i.UI.disableFeatures([Feature.Annotations]);

      // i.UI.disableTools([Tools.ToolNames.ERASER]);
      // i.UI.disableTools([Tools.ToolNames.FORM_FILL_CHECKMARK]);
      // i.UI.disableTools([Tools.ToolNames.FORM_FILL_CROSS]);
      // i.UI.disableTools([Tools.ToolNames.FORM_FILL_DOT]);
      // i.UI.disableTools([Tools.ToolNames.PAN]);
      // i.UI.disableTools([Tools.ToolNames.SIGNATURE]);
      // i.UI.disableTools([Tools.ToolNames.EDIT]);
      // i.UI.disableTools([Tools.ToolNames.RUBBER_STAMPER]);
      // i.UI.disableTools([Tools.ToolNames.TEXT_CREATE]);

      // i.UI.disableTools(["AnnotationCreateFreeText"]);

      // const { documentViewer, annotationManager, Annotations } = i.Core;
      // instance.current = i;
      // documentViewer.addEventListener("documentLoaded", async () => {
      //   const rectangleAnnot = new Annotations.RectangleAnnotation({
      //     PageNumber: 1,
      //     // values are in page coordinates with (0, 0) in the top left
      //     X: 100,
      //     Y: 150,
      //     Width: 100,
      //     Height: 100,
      //     Author: annotationManager.getCurrentUser(),
      //   });

      //   annotationManager.addAnnotation(rectangleAnnot);
      //   // need to draw the annotation otherwise it won't show up until the page is refreshed
      //   annotationManager.redrawAnnotation(rectangleAnnot);
      // });

      // i.UI.addEventListener("finishedSavingPDF", async () => {
      //   const doc = documentViewer.getDocument();
      //   const xfdfString = await annotationManager.exportAnnotations();
      //   const data = await doc.getFileData({
      //     // saves the document with annotations in it
      //     xfdfString,
      //   });
      //   const arr = new Uint8Array(data);
      //   const blob = new Blob([arr], { type: "application/pdf" });
      //   console.log(blob);
      //   setUpdatedFile(blob);
      // });
    });
  }, []);

  useEffect(() => {
    if (instance.current) {
      instance.current.loadDocument(pdfUrl);
    }
  }, [pdfUrl]);
  const getOwner = async () => {
    let agreementCon = await getAgreementContract(address);
    setCreator(await agreementCon.getOwner());
  };
  return (
    <>
      <Page title="Cryptic Sign |  Cryptic Vault">
        <Container pl={0} pr={0}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography gutterBottom>Owner: {creator}</Typography>
            <Button
              variant="contained"
              onClick={async () => await signAgreement(address, updatedFile)}
              to="#"
              startIcon={<Iconify icon="eva:edit-2-outline" />}
            >
              {sLoading ? "Signing...." : "Sign"}
            </Button>
          </Stack>
        </Container>
      </Page>
      <div className="container" style={{ height: "100%" }}>
        <div className="row" style={{ height: "100%" }}>
          <div className="col">
            <div
              className="webviewer"
              style={{ height: "100%" }}
              ref={viewer}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
export default SignAgreementComp;
