import { Outlet } from "react-router-dom";
 
import LendingFooter from "src/LendingPage/LendingFooter";

import LendingHeader from "src/LendingPage/LendingHeader";
 
export default function LendingPageLayout() {
  return (
    <>
      <LendingHeader /> 
      <Outlet />
      <LendingFooter style={{}} />
    </>
  );
}
