import "./TutorBody.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import SearchBar from "./SearchBar";
import TutorContainer from "./TutorContainer";

function TutorBody() {
  return (
    <div className="tutorbackground">
      <SearchBar />
      <TutorContainer />
    </div>
  );
}

export default TutorBody;
