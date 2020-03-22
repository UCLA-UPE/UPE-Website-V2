import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
// import Typography from '@material-ui/core/Typography'
// import Container from '@material-ui/core/Container'
// import Grid from '@material-ui/core/Grid'
// import Box from '@material-ui/core/Box'

import VisibilityFilterTable from "./VisibilityFilterTable";
import TestTable from "./TestTable";
import {
  Button,
  Popover,
  Container,
  Typography,
  Collapse,
  Grid,
  Box,
  TextField
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  grid: {
    padding: theme.spacing(4)
  },
  leftCol: {
    width: "100%",
    paddingRight: theme.spacing(1),
    textAlign: "right",
    display: "flex",
    alignItems: "center"
  },
  rightCol: {
    width: "100%"
  },
  whole_row: {
    width: "100%"
  },
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  form: {
    width: "100%" // Fix IE 11 issue.
  },
  popover_button: {
    margin: theme.spacing(1, 0, 2),
  }
}));

const Row = props => {
  const classes = useStyles();
  return (
    <>
      <Grid container item xs={3}>
        <Typography className={classes.leftCol} component="div">
          <Box fontWeight="fontWeightMedium">{props.title}</Box>
        </Typography>
      </Grid>
      <Grid container item xs={9}>
        <Typography className={classes.rightCol} component="div">
          <Box>{props.content}</Box>
        </Typography>
      </Grid>
    </>
  );
};

const ProfessorRowContent = props => {
  if (!props.professor) return "No";
  else
    return (
      <>
        You are verified as{" "}
        <span style={{ color: "fuchsia" }}>{props.professor.name}</span>.<br />
        Your visibility filters:
        <Box mt={3} mb={3}>
          <VisibilityFilterTable
            ax={props.ax}
            authCB={props.authCB}
            handleClickTestInfo={props.handleClickTestInfo}
            professor={props.professor.name}
          />
        </Box>
        Your tests:
        <Box mt={3}>
          <TestTable
            ax={props.ax}
            authCB={props.authCB}
            handleClickTestInfo={props.handleClickTestInfo}
            preFilters={[
              { field: "Professor", data: { name: props.professor.name } }
            ]}
            getHidden={true}
          />
        </Box>
      </>
    );
};
const ChangePassword = props => {
  const [oldPassword, setOldPassword] = React.useState();
  const [newPassword, setNewPassword] = React.useState();
  const [conPassword, setConPassword] = React.useState();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const popoverOpen = Boolean(anchorEl);
  const id = popoverOpen ? "simple-popover" : undefined;
  const [alert, setAlert] = React.useState();
  const [alertSeverity, setAlertSeverity] = React.useState();
  const alertOpen = Boolean(alert);
  const classes = useStyles();
  const {ax, email} = props;

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangePassword = async event => {
    event.preventDefault();
    // TODO: handle password validation (or done on the backend)
    if (conPassword !== newPassword) {
      setAlertSeverity("error");
      setAlert("Confirm password must match");
      return;
    }
    try {
      const data = {
        email,
        oldPassword,
        newPassword
      };
      const res = await ax.post('/changePassword', data);
      setAlertSeverity("success");
      setAlert("Successfully changed password");
    } catch (error) {
      setAlertSeverity("error");
      setAlert(error.response.data.reason);
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClick}>
        Change Password
      </Button>
      <Popover
        id={id}
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Collapse in={alertOpen}>
              <Alert severity={alertSeverity}>{alert}</Alert>
            </Collapse>
            <form
              className={classes.form}
              onSubmit={handleChangePassword}
              noValidate
            >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="oldPassword"
                label="Old Password"
                type="password"
                name="oldPassword"
                onChange={e => setOldPassword(e.target.value)}
                autoComplete="current-password"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                type="password"
                id="newPassword"
                onChange={e => setNewPassword(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="conPassword"
                label="Confirm Password"
                type="password"
                id="conPassword"
                onChange={e => setConPassword(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.popover_button}
              >
                Change Password
              </Button>
            </form>
          </div>
        </Container>
      </Popover>
    </div>
  );
};

export default React.memo(props => {
  const { ax, authCB, handleClickTestInfo } = props;
  const classes = useStyles();

  // is there a better way?
  const [email, setEmail] = React.useState();
  const [isUpeMember, setIsUpeMember] = React.useState();
  const [professor, setProfessor] = React.useState();
  const [testbankCredits, setTestbankCredits] = React.useState();
  const [testbankUploadedTests, setTestbankUploadedTests] = React.useState();

  const loadProfile = async () => {
    const res = await ax.post("/get-profile");
    setEmail(res.data.email);
    setIsUpeMember(res.data.isUpeMember);
    setProfessor(res.data.professor);
    setTestbankCredits(res.data.testbankCredits);
    setTestbankUploadedTests(res.data.testbankUploadedTests);
  };

  React.useEffect(() => {
    if (authCB.isLoggedIn()) {
      loadProfile();
    }
  }, []);

  return (
    <>
      <Typography variant="h2" component="h2">
        Profile
      </Typography>
      <Grid container spacing={2} className={classes.grid}>
        <Row title="Email" content={email} />
        {/* <Row title='Password' content='[encrypted]' /> */}
        <Row title="Password" content={<ChangePassword ax={ax} email={email}/>} />
        <Row title="UPE Status" content={isUpeMember ? "Yes" : "No"} />
        <Row
          title="Professor Status"
          content={
            <ProfessorRowContent
              ax={ax}
              authCB={authCB}
              handleClickTestInfo={handleClickTestInfo}
              professor={professor}
            />
          }
        />
        <Row title={<span>&nbsp;</span>} content="" />
        <Row title="Download Credits" content={testbankCredits} />
        <Row title="Uploaded Tests" content={testbankUploadedTests} />
      </Grid>
    </>
  );
});
