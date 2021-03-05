import { Component } from 'react'
import { DatePickerComponent } from './index'
import {
  Grid,
  Button,
  withStyles,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import { ReportGenerate } from '../../components/common';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { connect } from "react-redux";
import { withApollo } from "../../src/apollo";
import { withAuth } from "../../src/auth";
import { bindActionCreators } from "redux";
import { getLocations } from "../../src/store/actions";

const styles = (theme) => ({
  root: {
    
      padding: '3px',
  
    '& a': {
      textDecoration: 'none',
    }
  },
  pdfButton: {
    position: 'relative',
    left: '15px',
  },
  formControl: {
    // margin: theme.spacing(1),
    '& .MuiSelect-outlined': {
      height:'27px',
      lineHeight:'27px',
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      transform: 'translate(14px, -6px) scale(0.75) !important'
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-marginDense': {
        transform: 'translate(14px, 19px)'
    }
  },
});
class FilterComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      filter: {
        location: null,
        date: null,
        month: null,
        year: null,
      }
    }
  }

  componentDidMount() {
    this.props.getLocations()
  }
  handleSearch = (name, value) => {
    const { filter } = this.state
    filter[name] = value;
    this.setState({ filter },
      () => this.filterAction()
    )
  }
  filterAction = () => {
    
    this.props.handleFilter(this.state.filter)
  }
  resetFilter = () => {
    this.setState({ filter: { location: null, date: null, month: null, year: null } },
      () => this.filterAction()
    )
  }

  render() {
    const { classes, championData, type = 'angles', locations } = this.props;

    // const {data =[], totalData = {} } = this.props.championData;
    // console.log(totalData,'totalData');


    const { location, date, month, year } = this.state.filter
    return (
      <>
        <Grid container direction="row" justify="flex-start" spacing={1} className={classes.root} style={{ marginBottom: '10px' }}>
          {/* <Grid item xs={2} className={classes.filterDate}>
            <DatePickerComponent
              format="MM/dd/yyyy"
              label="Date"
              value={date} handleDateChange={(value) => this.handleSearch('date', value)} />
          </Grid> */}
          <Grid item xs={12} sm={6} md={4} lg={3} align="Left">
            <FormControl size={'small'} variant="outlined" className={classes.formControl} fullWidth>
              <InputLabel id="location">Location</InputLabel>
                <Select
                  labelId="location"
                  id="location"
                  value={location}
                  onChange={(e) => this.handleSearch('location', e.target.value)}
                  label="Location"
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {locations.map(location => (
                  <MenuItem key={location.id} value={location.name}>{location.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} className={classes.filterDate}>
            <DatePickerComponent
              label="Year"
              value={year}
              views={["year"]}
              handleDateChange={(value) => this.handleSearch('year', value)} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} className={classes.filterDate}>
            <DatePickerComponent
              format="MMMM"
              label="Month"
              value={month}
              views={["month"]}
              handleDateChange={(value) => this.handleSearch('month', value)} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Button onClick={() => this.resetFilter()} variant="contained" style={{ padding: '10px 20px' }}>Reset</Button>
            <PDFDownloadLink document={<ReportGenerate type={type} reportData={championData} />} fileName="report.pdf">
              {({ loading }) => (loading ? <Button variant="contained" size="medium" color="primary" align="left" className={classes.pdfButton}>Loading..</Button> : <Button variant="contained" size="medium" color="primary" align="left" className={classes.pdfButton}>Pdf</Button>)}
            </PDFDownloadLink>
          </Grid>
        </Grid>
      </>
    )
  }
}
// export default withStyles(styles, { withTheme: true })(FilterComponent);

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getLocations: getLocations,
    },
    dispatch
  );
};

function mapStateToProps({ userProfile }) {
  return {
    locations: userProfile.locations,
  };
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withApollo(withAuth(FilterComponent)))
);
