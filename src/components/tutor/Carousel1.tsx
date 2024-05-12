import "./Carousel1.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { require } from "@/utils/require";
import SvgIcon from "@/components/SvgIcon";
import Modal, { ModalRef } from "./Modal";
import { useRef } from "react";

interface Props {
  data: any[];
}

const CarouselLVL1: React.FC<Props> = ({ data }) => {
  const isMobile = /iPhone|iPod|Android/i.test(window.navigator.userAgent);
  const navigate = useNavigate();
  const modalRef = useRef<ModalRef>(null);

  const openModal = (AIdata: any) => {
    modalRef.current?.showModal(AIdata);
  };
  const handleChatClick = (e, AIdata: any) => {
    e.stopPropagation();
    navigate("/chat", { state: { AIdata } });
  };
  const settings = {
    dots: isMobile ? true : false,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : 2,
    slidesToScroll: 1,
    arrows: isMobile ? false : true,
  };
  return (
    <div className="carouselContainer">
      <div className="slider">
        <Slider {...settings}>
          {data.map((d, index) => (
            <div
              className="cardBackground desktop:h-[283px] h-[328px]"
              key={index}
              onClick={() => openModal(d)}
            >
              <div className="flex h-full flex-col justify-between py-[30px]">
                <div className="cardInfoContainer gap-[16px]">
                  <div>
                    <img
                      className="w-[136px]"
                      src={require(`tutoricons/${d.icon}.png`)}
                    />
                  </div>
                  <div className="cardTextContainer">
                    <div className="flex justify-between items-center">
                      <h1 className="desktop:text-[24px] text-[32px] font-bold">
                        {d.name}
                      </h1>
                      <div className="flex items-center gap-[30px]">
                        <div className="flex items-center gap-[8px]">
                          <span className="text-[#5E5E5E]">19,999</span>
                          <SvgIcon
                            name="like"
                            className="desktop:text-[26px] text-[52px] text-[#CB1F1F]"
                          />
                        </div>

                        <SvgIcon
                          name="shoucang"
                          className="desktop:text-[20px] text-[40px] text-[#7DBCF9]"
                        />
                      </div>
                    </div>
                    <p>
                      <span className="desktop:text-[20px] text-[24px] font-bold">
                        语速
                      </span>
                      <span className="text-[24px] font-bold text-[#2CBE99] ml-[10px]">
                        {d.speed2}
                      </span>
                    </p>
                    <p className="desktop:text-[16px] text-[24px] desktop:line-clamp-3 line-clamp-2">{d.desc}</p>
                  </div>
                </div>
                <div className="cardButtonContainer">
                  {/* <button className="auditionButton">
                  <i className="bi bi-volume-up-fill"></i>Audition
                </button> */}
                  <button
                    className="chatButton"
                    onClick={(e) => handleChatClick(e, d)}
                  >
                    <i className="bi bi-chat-left-dots-fill"></i>Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <Modal ref={modalRef} />
    </div>
  );
};

export default CarouselLVL1;
