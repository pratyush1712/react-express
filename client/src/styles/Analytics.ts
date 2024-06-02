import {makeStyles} from "@mui/styles";
import background from "../assets/background.jpg";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundImage: `url(${background})`,
    padding: "40px",
    minHeight: "100vh",
    minWidth: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    textShadow: "2px 2px 4px #000000",
    marginBottom: "40px",
    marginLeft: "20px",
    paddingLeft: "100px"
  },
  listItem: {
    color: "#fff",
    fontWeight: "bold",
    textShadow: "2px 2px 4px #000000",
    marginBottom: "10px"
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
  }
}));

export default useStyles;
