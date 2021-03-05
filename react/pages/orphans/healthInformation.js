import { Component } from "react";
import { Typography, withStyles, Grid, Divider, Button, Box } from "@material-ui/core";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Formsy from "formsy-react";
import { TextFieldFormsy, DatePickerFieldFormsy } from "../../components";
import { AddButton, DeleteButton } from "../../components/common";
import { getDateFormatDefualt } from '../../src/helpers';

const styles = (theme) => ({
	divider: {
		height: '2px',
		margin: '6px 0px 9px 0px',
		width: '100%'
	},
	description: {
		fontSize: "12px",
		color: "#7d7d7d",
	},
	boldDescription: {
		fontWeight: "600",
		fontSize: "12px",
		color: "#3D3D3D",
	},
	tabPersonalInfo: {
		padding: "5px",
	},
	textTransform: {
		textTransform: "none !important",
	},
	margin: {
		margin: "5px"
	},
	adoptChild: {
		textTransform: "none !important",
		padding: "10px 20px",
	},
});

class HealthInformation extends Component {
	state = {
		loading: false,
		canSubmit: false,
		isAdd: false,
	};
	componentWillReceiveProps(nextProps) {
		if (nextProps.addSuccess !== this.props.addSuccess) {
			this.setState({ isAdd: false });
		}
	}
	disableButton = () => {
		this.setState({ canSubmit: false });
	};

	enableButton = () => {
		this.setState({ canSubmit: true });
	};

	handleChange = (value, name) => {
		const { profile } = this.state
		profile[name] = value
		this.setState({ profile })
	}
	onSubmit = (model) => {
		this.props.onSaveHealth(model)
	}

	handleForm = () => {
		this.setState({ isAdd: !this.state.isAdd });
	}
	deleteHelth = (id) => {
		this.props.onDeleteHealth(id, this.props.childrenProfile.id)
	}
	render() {
		const { classes, childrenProfile } = this.props;
		const { orphanHealths } = childrenProfile;
		const { loading, canSubmit, isAdd } = this.state;
		let index = 0;
		return (
			<React.Fragment>

				{isAdd ?
					<Grid container justify="center" alignItems="right">
						<Grid item xs={12}>
							<Formsy
								onValidSubmit={this.onSubmit}
								onValid={this.enableButton}
								onInvalid={this.disableButton}
								ref={(form) => (this.form = form)}
								className={classes.FormRoot}
							>
								{" "}
								<div><br />
									<Grid container spacing={2} justify="left" alignItems="right">
										<Grid item xs={12}>
											<DatePickerFieldFormsy
												format="MM/dd/yyyy"
												label="Health Review Date"
												name="healthReviewDate"
												required
												value={new Date()}
												emptyLabel={'Select date'}
												disabled
											/>
										</Grid>
										<Grid item xs={9}>
											<TextFieldFormsy
												id="outlined-number"
												label="Vaccinations Administered"
												name="vaccinations"
												type="text"
												fullWidth
												InputLabelProps={{
													shrink: true,
												}}
												variant="outlined"
												required
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<DatePickerFieldFormsy
												format="MM/dd/yyyy"
												label="Last Doctors visit"
												name="lastDoctor"
												required
												defaultValue={null}
												emptyLabel={'Select date'}
												disableFuture
											/>
											{/* <TextFieldFormsy
												id="outlined-number"
												label="Last Doctors visit"
												name="lastDoctor"
												type="text"
												fullWidth
												InputLabelProps={{
													shrink: true,
												}}
												variant="outlined"
												required
											/> */}
										</Grid>
										<Grid item xs={9}>
											<TextFieldFormsy
												id="outlined-number"
												label="Injuries/Disabilities"
												name="disabilities"
												type="text"
												fullWidth
												InputLabelProps={{
													shrink: true,
												}}
												variant="outlined"
												required
											/>
										</Grid>

										<Grid item xs={6}>
											<TextFieldFormsy
												id="outlined-number"
												label="Doctor Name"
												name="doctorName"
												type="text"
												fullWidth
												InputLabelProps={{
													shrink: true,
												}}
												variant="outlined"
												required
											/>
										</Grid>
										{/* <Grid item xs={12}>
											<TextFieldFormsy
												id="outlined-number"
												label="Comment"
												name="comments"
												type="text"
												fullWidth
												InputLabelProps={{
													shrink: true,
												}}
												variant="outlined"
												required
											/>
										</Grid> */}
									</Grid>
									<br />
									<Box align="right">
										<Button
											type="submit"
											variant="contained"
											color="primary"
											size={"medium"}
											disabled={!canSubmit || loading}
											className={classes.adoptChild}
										>
											Save
                    					</Button>

										<Button onClick={this.handleForm} variant="contained" size="medium" className={[classes.margin, classes.adoptChild]}>
											Cancel
                    					</Button>
									</Box>
								</div>
							</Formsy>

						</Grid>
					</Grid>

					:
					<Grid container justify="center" alignItems="right">
						<Grid container spacing={0} direction="column" align="right" justify="right" >
							<Grid item xs={12}>
								<AddButton row={childrenProfile} onClick={this.handleForm} />
							</Grid>
						</Grid>
					</Grid>
				}
				<br />
				{orphanHealths?.nodes.length > 0 && orphanHealths.nodes.map((health) => (
					<ExpansionPanel key={health}>
						<ExpansionPanelSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<Typography className={classes.expansionHeading}>
								<b className={classes.expansionNumber}>{++index}{" Health Review Date : "}
                				&nbsp;&nbsp;&nbsp;{getDateFormatDefualt(health.healthReviewDate)} </b>
								{/* <b className={classes.expansionNumber}>{++index}</b> &nbsp;&nbsp;&nbsp;{health.vaccinations ? health.vaccinations : "-"} */}
							</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<Grid container>
								<Grid container>
									<Grid item xs={12} sm={3} md={3} lg={2} className={classes.tabPersonalInfo}>
										<Typography variant="subtitle1" className={classes.description}>
											Vaccinations Administered:
                						</Typography>
									</Grid>
									<Grid item xs={12} sm={9} md={9} lg={10} className={classes.tabPersonalInfo}>
										<Typography
											variant="subtitle1"
											className={classes.boldDescription}
										>
											{health.vaccinations ? health.vaccinations : "-"}
										</Typography>
									</Grid>
								</Grid>
								<Grid container justify="center" alignItems="center">
									<Grid item xs={12} sm={3} md={3} lg={2} className={classes.tabPersonalInfo}>
										<Typography variant="subtitle1" className={classes.description}>
											Last Doctors visit:
                						</Typography>
									</Grid>
									<Grid item xs={12} sm={9} md={9} lg={10} className={classes.tabPersonalInfo}>
										<Typography
											variant="subtitle1"
											className={classes.boldDescription}
										>

											{getDateFormatDefualt(health.lastDoctor)}
										</Typography>
									</Grid>
								</Grid>

								<Grid container justify="center" alignItems="center">
									<Grid item xs={12} sm={3} md={3} lg={2} className={classes.tabPersonalInfo}>
										<Typography variant="subtitle1" className={classes.description}>
											Injuries/Disabilities:
                						</Typography>
									</Grid>
									<Grid item xs={12} sm={9} md={9} lg={10} className={classes.tabPersonalInfo}>
										<Typography
											variant="subtitle1"
											className={classes.boldDescription}
										>
											{health.disabilities ? health.disabilities : "-"}
										</Typography>
									</Grid>
								</Grid>

								<Grid container justify="center" alignItems="center">
									<Grid item xs={12} sm={3} md={3} lg={2} className={classes.tabPersonalInfo}>
										<Typography variant="subtitle1" className={classes.description}>
											Doctor Name:
                						</Typography>
									</Grid>
									<Grid item xs={12} sm={9} md={9} lg={10} className={classes.tabPersonalInfo}>
										<Typography
											variant="subtitle1"
											className={classes.boldDescription}
										>
											{health.doctorName ? health.doctorName : "-"}
										</Typography>
									</Grid>
								</Grid>

								<Grid container>
									<Grid item xs={12} sm={9} md={9} lg={10} className={classes.tabPersonalInfo}>
										<DeleteButton row={childrenProfile} onClick={() => this.deleteHelth(health.id)} />
									</Grid>
								</Grid>
							</Grid>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				))}
				{orphanHealths?.nodes.length === 0 &&
					<Typography
						variant="h6"
						align="center"
					>
						Health Information not found!
          			</Typography>
				}
			</React.Fragment>
		);
	}
}

export default withStyles(styles, { withTheme: true })(HealthInformation);
