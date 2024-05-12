import './MyMessage.css';
import "bootstrap-icons/font/bootstrap-icons.css";

interface MyMessageProps {
    message: string;
}

function MyMessage({ message }: MyMessageProps) {
    return (
        <div className="myMsg">
            {message}
            {/* <button className="myplayButton"><i className="bi bi-play-fill"></i></button> */}
        </div>
    );
}

export default MyMessage;