import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import CssBaseline from "@material-ui/core/CssBaseline";
// import { makeStyles } from "@material-ui/core/styles";
import { Grid, Button } from "@material-ui/core";
import MaterialTable, { MTableToolbar } from "material-table";

// const useStyles = makeStyles((theme) => ({
//   container: {
//     maxWidth: "85%",
//     marginTop: "3vh",
//     marginBottom: "3vh",
//     borderRadius: "6px",
//     backgroundColor: "#FAE5BD",
//   },
//   title: {
//     marginTop: theme.spacing(2),
//     marginBottom: theme.spacing(2),
//     padding: theme.spacing(1),
//     paddingLeft: theme.spacing(4),
//     color: theme.palette.primary.main,
//   },
// }));

// ########################################################
// The main Home component returned by this Module
// ########################################################
function Home(props) {
  // const classes = useStyles();

  const [tableContent, setTableContent] = useState([]);
  const [tabtit, setTabtit] = React.useState(null);

  // for table manipulation
  const [col, setCol] = React.useState([]);

  //getissueRec
  const getissueRec = (event) => {
    setTabtit("Issue Records");

    setCol([
      { title: "ID", field: "id" },
      { title: "IssuedAt", field: "doi" },
      { title: "Book", field: "tob_id" },
      { title: "Issued_To", field: "nop" },
    ]);

    //Axios variables required to call the API
    let headers = {
      Authorization: `Token ${props.token}`,
    };

    let url = "http://127.0.0.1:8000/api/lib/getissuerec/";
    let method = "post";
    let config = { headers, method, url };

    //Axios predict API call
    axios(config)
      .then((res) => {
        setTableContent(res.data["issue"]);
      })
      .catch((error) => {
        alert("Only Admin can view Records");
      });
  };

  const getLogRec = (event) => {
    setTabtit("LOG HISTORY RECORDS");

    setCol([
      { title: "ID", field: "id" },
      { title: "Was_Issued_at", field: "doi_log" },
      { title: "Submitted_at", field: "dor_log" },
      { title: "Book", field: "tob_log_id" },
      { title: "Issued_To", field: "nop_log" },
    ]);

    //Axios variables required to call the API
    let headers = {
      Authorization: `Token ${props.token}`,
    };

    let url = "http://127.0.0.1:8000/api/lib/getlogrec/";
    let method = "post";
    let config = { headers, method, url };

    //Axios predict API call
    axios(config)
      .then((res) => {
        setTableContent(res.data["issue"]);
      })
      .catch((error) => {
        alert("Only Admin can view History LOG of issue");
      });
  };

  // Function to make the predict API call and update the state variable - Prediction
  const getBooks = (event) => {
    setTabtit("Books in LIBRARY");

    setCol([
      { title: "ID", field: "id" },
      { title: "Title", field: "title" },
      { title: "Genre", field: "cat" },
      { title: "Author", field: "author_id" },
      { title: "Status", field: "Status" },
      { title: "URL", field: "book_url" },
    ]);

    //Axios variables required to call the API
    let headers = {
      Authorization: `Token ${props.token}`,
      // Content-Type
    };
    //    let url = settings.API_SERVER + '/api/predict/';
    let url = "http://127.0.0.1:8000/api/lib/books/";
    let method = "post";
    let config = { headers, method, url };

    //Axios predict API call
    return axios(config)
      .then((res) => {
        setTableContent(res.data["Books"]);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getBooks();
  }, []);

  useEffect(() => {
    props.user();
  });
  const buttonStyle = {

    margin: "2px 10px", color: "black", backgroundColor: "white" 
  }

  const toolbarButtons = (props) => (
    <div>
      <MTableToolbar {...props}></MTableToolbar>

      <Button
        variant="outlined"
        onClick={getBooks}
        style={buttonStyle}
      >
        All Books
      </Button>
      <Button
        variant="outlined"
        style={buttonStyle}
        onClick={getissueRec}
      >
        Currently Issued
      </Button>

      <Button
        variant="outlined"
        style={buttonStyle}
        onClick={getLogRec}
      >
        Issue History
      </Button>
    </div>
  );

   const materialTableOptions = {
    search: true,
    headerStyle: {
      width: "10px",
    },
    rowStyle: {
      fontFamily: "NTR",
      fontSize: "17px",
    },
    headerStyle: {
      fontFamily: "NTR",
      fontWeight: "bold",
      fontSize: "20px",
    },
    padding: "dense",
    pageSizeOptions: 5,
    paginationType: "normal",
    paginationPosition: "bottom", //stepped
  }

  let username;
  if (!!props.current_user){
    username = props.current_user.username
  }
  
  function ButtonsOrNot(){
    if(props.isAuthenticated && username==='admin'){
      return {Toolbar:toolbarButtons}
    }else{
      return{}
    }
  }

  const materialTableComponents = ButtonsOrNot()
  
  

  return (
    <React.Fragment>
      <CssBaseline />

      <Grid item>
        <div>
          <MaterialTable
            components={materialTableComponents}
            options={materialTableOptions}
            title={tabtit}
            data={tableContent}
            columns={col}
          />
        </div>
      </Grid>
    </React.Fragment>
  );
}

//This means that one or more of the redux states in the store are available as props
const mapStateToProps = (state) => {
  return {
    isAuthenticated:
      state.auth.token !== null && typeof state.auth.token !== "undefined",
    token: state.auth.token,
    current_user:state.auth.user
  };
};



export default connect(mapStateToProps)(Home);

