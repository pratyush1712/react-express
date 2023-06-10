import {makeStyles} from "@mui/styles";
import background from "../assets/background.jpg";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    padding: "40px",
    minHeight: "100vh",
    minWidth: "100vw",
    display: "flex",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    textShadow: "2px 2px 4px #000000",
    position: "absolute",
    top: "16%",
    left: "8%"
  },
  caption: {
    color: "#fff",
    fontWeight: "bold",
    textShadow: "2px 2px 4px #000000",
    position: "absolute",
    left: "56%"
  },
  login: {
    position: "absolute",
    top: "40%",
    left: "30%",
    transform: "translate(-50%, -50%)"
  },
  button: {
    fontSize: "20px",
    color: "#fff",
    fontWeight: "bold",
    textShadow: "2px 2px 4px #000000",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
      boxShadow: "0 0 0 0.2rem rgba(200,200,200,.8)"
    }
  },
  subTitle: {
    color: "#fff",
    fontWeight: "bold",
    textShadow: "2px 2px 4px #000000",
    top: "50%",
    left: "27%",
    textTransform: "uppercase"
  },
  buttonStyle: {
    fontSize: "20px",
    color: "#fff",
    fontWeight: "bold",
    textShadow: "2px 2px 4px #000000",
    textDecoration: "none",
    maxWidth: "600px",
    postion: "absolute",
    top: "70%",
    boxShadow: "0 0 0 0.2rem rgba(220,220,220)",
    "&:hover": {
      textDecoration: "none"
    }
  },
  listItemStyle: {
    display: "flex",
    borderBottom: "1px solid #fff",
    "&:hover": {
      textDecoration: "none",
      boxShadow: "0 0 0 0.2rem rgba(200,200,200,.8)"
    }
  },
  listStyle: {
    overflowY: "scroll",
    maxHeight: "45vh",
    textUnderlinePosition: "under",
    width: "45vw",
    position: "absolute",
    mt: "3.5%",
    left: "26%",
    "&::-webkit-scrollbar": {
      width: "0.4em",
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,200,.4)"
    },
    "&::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,.4)"
    }
  },
  trackNameStyle: {
    marginRight: 2,
    color: "#fff",
    textShadow: "2px 2px 4px #000000",
    overflowX: "hidden"
  }
}));

export default useStyles;
