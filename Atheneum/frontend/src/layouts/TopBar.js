import React, { Fragment, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import IssueReturnDialog from "./IssueReturnDialog"
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Logo from "../components/logo";
import RecommendationDialog from "./RecommendationDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  button: {
    fontFamily: "NTR",
    boxShadow: " 0px 6px 70px 4px rgba(250, 229, 189, 0.5)",
    margin: "10px",
    borderRadius: "5px",
    backgroundColor: "#FAE5BD",
    fontSize: "18px",
    paddingTop: "6px",
  },
}));

function TopBar(props) {
  const classes = useStyles();

  const [dialog, setDialog] = useState(false);

  const openDialog = () => {
    setDialog(true);
  };

  const closeDialog = () => {
    setDialog(false);
  };

  useEffect(() => {
    props.user(); // eslint-disable-next-line
  }, []);

  let username;
  if (!!props.current_user) {
    username = props.current_user.username;
  }

  let current_url = useLocation().pathname;

  return (
    <div className={classes.root}>
      <AppBar style={{ backgroundColor: "white",boxShadow:"none" }} position="static">
        <Toolbar
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid justify="space-between" container style={{ maxWidth: "90vw" }}>
            <Grid item>
              <Link to={current_url === "/home"?"/":"/home"}>
                <Logo />
              </Link>
            </Grid>

            <Grid item>
              {props.isAuthenticated && username === "admin" ? (
                <Fragment>
                  <IssueReturnDialog
                    open={dialog}
                    close={closeDialog}
                  ></IssueReturnDialog>
                  <Button className={classes.button} onClick={openDialog}>
                    Issue/Return
                  </Button>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="http://localhost:8000/admin"
                    style={{ textDecoration: "none" }}
                  >
                    <Button className={classes.button}>Admin Panel</Button>
                  </a>
                </Fragment>
              ) : null}

              {props.isAuthenticated && username !== "admin" ? (
                <Fragment>
                  <RecommendationDialog open={dialog} close={closeDialog} />
                  <Button className={classes.button} onClick={openDialog}>
                    Recommendation
                  </Button>
                </Fragment>
              ) : null}

              {current_url === "/" && (!props.isAuthenticated) ? (
                <Fragment>
                  <Link style={{textDecoration:"None"}} to="/login">
                  
                  <Button className={classes.button} >
                    Sign In
                  </Button>
                  </Link>
                </Fragment>
              ) : null}

              {props.isAuthenticated ? (
                <Link to='/update_password' style={{textDecoration:"none"}}>
                <Button
                  edge="end"
                  className={classes.button}
                  >
                  Update Password
                </Button>
                  </Link>
              ) : null}
              {props.isAuthenticated ? (
                <Button
                  className={classes.button}
                  onClick={() => props.logout()}
                >
                  Logout
                </Button>
              ) : null}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated:
      state.auth.token !== null && typeof state.auth.token !== "undefined",
    token: state.auth.token,
    current_user: state.auth.user,
  };
};

export default connect(mapStateToProps)(TopBar);
