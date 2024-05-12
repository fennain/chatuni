import "./TutorContainer.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Carousel from "./Carousel1";
import { teacherlistApi } from "@/api/modules/user";
import React, { useState, useEffect, useRef } from "react";
import useRequest from "@/hooks/useRequest";

function TutorContainer() {
  const { getToken } = useRequest();
  const [data, setData] = useState<any[]>([]);

  const getList = async () => {
    // await getToken();
    const { result } = await teacherlistApi();
    console.log(classifyByLevel(result));
    setData(classifyByLevel(result));
  };

  function classifyByLevel(arr: any) {
    const classified = {};

    arr.forEach((element: any) => {
      const level = element.level;
      if (classified[level]) {
        classified[level].push(element);
      } else {
        classified[level] = [element];
      }
    });

    const result = [];
    for (const level in classified) {
      result.push({ level: parseInt(level), list: classified[level] });
    }

    return result;
  }

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className="tutorContainer">
      {data.map((item, index) => (
        <div key={index}>
          <div className="level">Level {item.level}</div>

          <Carousel data={item.list}></Carousel>
        </div>
      ))}
    </div>
  );
}

export default TutorContainer;
