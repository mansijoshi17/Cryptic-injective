import { Button, Stack } from "@mui/material";
import WebViewer from "@pdftron/webviewer";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function PdfViewer({
  cid,
  storeJsonFiles,
  updatepdfCid,
  updateUploading,
  uploading,
  storeDriveFiles,
}) {
  const [file, setFile] = useState();
  const [finale, setFinale] = useState();
  const instance = useRef();
  const viewer = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    WebViewer(
      {
        path: "/webviewer/lib",
        initialDoc: cid,
      },
      viewer.current
    ).then((i) => {
      setFile(i);
      i.UI.disableElements(["toolbarGroup-Shapes"]);
      i.UI.disableElements(["toolbarGroup-Edit"]);
      i.UI.disableElements(["toolbarGroup-Insert"]);
      i.UI.disableElements(["toolbarGroup-Annotate"]);
      i.UI.disableElements(["toolbarGroup-Comments"]);
      const { documentViewer, annotationManager, Annotations } = i.Core;
      instance.current = i;
      documentViewer.addEventListener("documentLoaded", () => {
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
    });
  }, []);
  useEffect(() => {
    if (instance.current) {
      instance.current.loadDocument(cid);
    }
  }, [cid]);

  // const handleUploadFile=()=>{
  //     console.log(file,"file");
  // }

  const handleUploadFile = async () => {
    updateUploading(true);
    const { Annotations, documentViewer } = file.Core;
    const annotationManager = documentViewer.getAnnotationManager();
    const fieldManager = annotationManager.getFieldManager();
    const annotationsList = annotationManager.getAnnotationsList();
    const annotsToDelete = [];
    const annotsToDraw = [];

    await Promise.all(
      annotationsList.map(async (annot, index) => {
        let inputAnnot;
        let field;

        if (typeof annot.custom !== "undefined") {
          // create a form field based on the type of annotation
          if (annot.custom.type === "TEXT") {
            field = new Annotations.Forms.Field(
              annot.getContents() + Date.now() + index,
              {
                type: "Tx",
                value: annot.custom.value,
              }
            );
            inputAnnot = new Annotations.TextWidgetAnnotation(field);
          } else if (annot.custom.type === "SIGNATURE") {
            field = new Annotations.Forms.Field(
              annot.getContents() + Date.now() + index,
              {
                type: "Sig",
              }
            );
            inputAnnot = new Annotations.SignatureWidgetAnnotation(field, {
              appearance: "_DEFAULT",
              appearances: {
                _DEFAULT: {
                  Normal: {
                    data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuMWMqnEsAAAANSURBVBhXY/j//z8DAAj8Av6IXwbgAAAAAElFTkSuQmCC",
                    offset: {
                      x: 100,
                      y: 100,
                    },
                  },
                },
              },
            });
          } else if (annot.custom.type === "DATE") {
            field = new Annotations.Forms.Field(
              annot.getContents() + Date.now() + index,
              {
                type: "Tx",
                value: "m-d-yyyy",
                // Actions need to be added for DatePickerWidgetAnnotation to recognize this field.
                actions: {
                  F: [
                    {
                      name: "JavaScript",
                      // You can customize the date format here between the two double-quotation marks
                      // or leave this blank to use the default format
                      javascript: 'AFDate_FormatEx("mmm d, yyyy");',
                    },
                  ],
                  K: [
                    {
                      name: "JavaScript",
                      // You can customize the date format here between the two double-quotation marks
                      // or leave this blank to use the default format
                      javascript: 'AFDate_FormatEx("mmm d, yyyy");',
                    },
                  ],
                },
              }
            );

            inputAnnot = new Annotations.DatePickerWidgetAnnotation(field);
          } else {
            // exit early for other annotations
            annotationManager.deleteAnnotation(annot, false, true); // prevent duplicates when importing xfdf
            return;
          }
        } else {
          // exit early for other annotations
          return;
        }

        // set position
        inputAnnot.PageNumber = annot.getPageNumber();
        inputAnnot.X = annot.getX();
        inputAnnot.Y = annot.getY();
        inputAnnot.rotation = annot.Rotation;
        if (annot.Rotation === 0 || annot.Rotation === 180) {
          inputAnnot.Width = annot.getWidth();
          inputAnnot.Height = annot.getHeight();
        } else {
          inputAnnot.Width = annot.getHeight();
          inputAnnot.Height = annot.getWidth();
        }

        // delete original annotation
        annotsToDelete.push(annot);

        // customize styles of the form field
        Annotations.WidgetAnnotation.getCustomStyles = function (widget) {
          if (widget instanceof Annotations.SignatureWidgetAnnotation) {
            return {
              border: "1px solid #a5c7ff",
            };
          }
        };
        Annotations.WidgetAnnotation.getCustomStyles(inputAnnot);

        // draw the annotation the viewer
        annotationManager.addAnnotation(inputAnnot);
        fieldManager.addField(field);
        annotsToDraw.push(inputAnnot);
      })
    );

    // delete old annotations
    annotationManager.deleteAnnotations(annotsToDelete, null, true);

    // refresh viewer
    await annotationManager.drawAnnotationsFromList(annotsToDraw);
    const { docViewer, annotManager } = file;
    const doc = docViewer.getDocument();
    const xfdfString = await annotManager.exportAnnotations({
      widgets: true,
      fields: true,
    });
    const data = await doc.getFileData({ xfdfString });
    const arr = new Uint8Array(data);
    const blob = new Blob([arr], { type: "application/pdf" });
    console.log(blob, "blob");

    const files = [new File([blob], "CrypticAgreement")];

    console.log(files, "files");

    let cid = await storeDriveFiles(files[0], "CrypticAgreement");

    updatepdfCid(cid);
    updateUploading(false);
    setFinale(cid);
  };

  return (
    <div className="container p-0 mb-4" style={{ height: "100%" }}>
      <div className="row" style={{ height: "100%" }}>
        <div className="col">
          <div
            className="webviewer"
            style={{ height: "100%", minHeight: "500px" }}
            ref={viewer}
          >
            {/* {setFile(viewer)} */}
          </div>
          <Stack
            spacing={3}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              style={{
                backgroundColor: "#6dbf8b",
                fontSize: "14px",
                padding: "5px 20px 5px 20px",
                borderRadius: "6px",
                color: "white",
                cursor: "pointer",
                marginTop: "10px",
              }}
              className="d-flex justify-content-last"
              onClick={() => handleUploadFile()}
            >
              {uploading ? "Uploading..." : "Upload Agreement"}
            </Button>
          </Stack>
        </div>
      </div>
    </div>
  );
}

export default PdfViewer;
