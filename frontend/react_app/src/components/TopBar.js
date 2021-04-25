import React, { Fragment,useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import IssueReturnDialog from "./IssueReturnDialog";
import { connect } from "react-redux";
import Logo from "./logo";

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

  let username;
  if (!!props.current_user){
    username = props.current_user.username
  }


  return (
    <div className={classes.root}>
      <AppBar style={{ backgroundColor: "white" }} position="static">
        <Toolbar
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid
            justify="space-between" // Add it here :)
            container
            style={{ maxWidth: "90vw" }}
          >
            <Grid item>
              <Logo />
            </Grid>

            <Grid item>
              {(props.isAuthenticated && username==='admin')?
              <Fragment>

              <IssueReturnDialog
              open={dialog}
              close={closeDialog}
              ></IssueReturnDialog>
                <Button className={classes.button} onClick={openDialog}>
                  Issue/Return
                </Button>
              </Fragment>
              :null}

              
              {props.isAuthenticated ? (
                <Button
                  edge="end"
                  className={classes.button}
                  href="/update_password"
                >
                  Update Password
                </Button>
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
