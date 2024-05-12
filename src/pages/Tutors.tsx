import TutorBody from "../components/tutor/TutorBody";
import NavBar from "@/components/NavBar";
import React, { useEffect } from "react";
import { RootState, useSelector, useDispatch } from "@/redux";
import { setGlobalState } from "@/redux/modules/global";

function TutorPage() {
  const dispatch = useDispatch();
  const isMobile = /iPhone|iPod|Android/i.test(window.navigator.userAgent);

  useEffect(() => {
    dispatch(setGlobalState({ key: "tabbarKey", value: "tutors" }));
  }, []);

  return (
    <div className="px-[30px]">
      <NavBar backArrow={false}>外教</NavBar>
      <TutorBody />
    </div>
  );
}

export default TutorPage;
