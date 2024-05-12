import "./ChatBody.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import ChatFeed from "./ChatFeed";
import { teacherlistApi } from "@/api/modules/user";
import React, { useState, useEffect, useRef } from "react";
import { require } from "@/utils/require";

function ChatBody({ AIdata }) {
  const navigate = useNavigate();
  const [key, setKey] = useState(Math.random());
  const [data, setData] = useState<any[]>([]);

  const [teacherData, setTeacherData] = useState<any>(null);

  const handleChatClick = (data) => {
    // navigate("/chat", { state: { AIdata } });
    setKey(Math.random()); // Update the key
    setTeacherData(data);
  };

  const getList = async () => {
    const { result } = await teacherlistApi();
    setData(result);
  };
  useEffect(() => {
    setTeacherData(AIdata);
    getList();
  }, []);

  return (
    <div className="chatBackground">
      <div className="bodyCenter px-[30px]">
        {teacherData && <ChatFeed key={key} AIdata={teacherData} />}
      </div>
      {/* <div className="bodyLeft overflow-y-auto">
        <h4>与更多外教聊天</h4>
        {data.map((d, index) => (
          <div className="recentCard" key={index}>
            <img
              className="tutorImage"
              src={require(`tutoricons/${d.icon}.png`)}
            ></img>
            <div className="textContainer">
              <h4 className="text-[20px] font-bold">{d.name}</h4>
              <div className="levelSmall">{"Level " + d.level}</div>
            </div>
            <button className="recentButton" onClick={() => handleChatClick(d)}>
              <i className="bi bi-chat-left-text-fill"></i>
            </button>
          </div>
        ))}
      </div> */}

      {/* <div className="bodyRight">
        <div className="recentCard">
          <img
            className="tutorImage"
            src={require(`tutoricons/${teacherData?.icon}.png`)}
          ></img>

          <div className="textContainer">
            <h1 className="text-[20px] font-bold">{teacherData?.name}</h1>
            <div className="Chatlevel">{"Level " + teacherData?.level}</div>
            <p>Linguistics | Literaure</p>
          </div>
        </div>
        <h3>描述</h3>
        <p>{AIdata.desc}</p>
      </div> */}
    </div>
  );
}

export default ChatBody;
