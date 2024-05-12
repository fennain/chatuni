import './AIMessage.css';
import "bootstrap-icons/font/bootstrap-icons.css";





interface MyMessageProps {
    message: string;
}

function AIMessage({ message }: MyMessageProps) {
    return (
        <div className="aiMsg">
            {message}
            {/* <button className="aiplayButton" ><i className="bi bi-play-fill"></i></button> */}
        </div>
    );
}

export default AIMessage;