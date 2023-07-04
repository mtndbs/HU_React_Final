import AnimationSharpIcon from "@mui/icons-material/AnimationSharp";
import { useNavigate } from "react-router-dom";
interface Props {
  size?: any;
}

function AppTitle({ size = "20px" }: Props) {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="logo"
        style={{ cursor: "pointer" }}
        onClick={() => {
          navigate("/");
        }}
      >
        <span style={{ fontSize: size }}>BuisCase</span>
        <AnimationSharpIcon sx={{ color: "#d4af37", width: size, height: size }} />
      </div>
    </>
  );
}

export default AppTitle;
