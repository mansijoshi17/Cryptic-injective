import React, { useRef, useEffect } from "react";
import WebViewer from "@pdftron/webviewer";

const CrypticAgreements = () => {
  const viewer = useRef(null);
  const [file, setFile] = React.useState();

  const onChange = (e) => {
    var file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFile(reader.result);
    };
  };

  // if using a class, equivalent of componentDidMount
  useEffect(() => {
    WebViewer(
      {
        path: "/webviewer/lib",
        
        initialDoc: file,
      },
      viewer.current
    ).then((instance) => {
      const { documentViewer, annotationManager, Annotations } = instance.Core;

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
  console.log(file, "file path----");

  return (
    <div className="container" style={{ height: "100%" }}>
      <div className="row">
        <div className="col">
          <input type="file" onChange={onChange}></input>
        </div>
      </div>
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
  );
};

export default CrypticAgreements;
