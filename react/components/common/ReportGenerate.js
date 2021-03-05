import { Document, Page, Image, Text, View, StyleSheet } from '@react-pdf/renderer';
import { getDateFormat } from './../../src/helpers'
import { Component } from 'react'
import SentimentVerySatisfiedRoundedIcon from '@material-ui/icons/SentimentVerySatisfiedRounded';
import moment from 'moment'

const borderColor = '#4D5763'
const stylesPdf = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 11,
        paddingTop: 30,
        paddingLeft: 60,
        paddingRight: 60,
        lineHeight: 1.5,
        flexDirection: 'column',
    },
    logo: {
        width: 74,
        height: 66,
        marginLeft: '200px',
        marginRight: 'auto',
        textAlign: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        marginTop: 24,
    },
    textCenter: {
        textAlign: 'center',
    },
    reportTitle: {
        // color: '#61dafb',
        letterSpacing: 4,
        fontSize: 14,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    reportDescription: {
        fontSize: 9,
    },
    reportFooterDescription: {
        fontSize: 8,
    },
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 24,
        borderWidth: 1,
        borderColor: '#5F6368',
    },

    container: {
        flexDirection: 'row',
        borderBottomColor: '#5F6368',
        backgroundColor: '#E1402A',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        textAlign: 'center',
        fontStyle: 'bold',
        flexGrow: 1,
    },
    description: {
        width: '50%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        color: "white",
    },
    age: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        color: "white",
    },
    totaldonations: {
        width: '29%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        color: "white",
    },
    rate: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        color: "white",
    },
    date: {
        width: '25%',
        color: "white",
    },
    row: {
        flexDirection: 'row',
        borderBottomColor: '#5F6368',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        fontStyle: 'bold',
    },
    rowName: {
        width: '50%',
        textAlign: 'left',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingLeft: 8,
    },
    rowAge: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    rowAmount: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    rowDate: {
        width: '25%',
        textAlign: 'right',
        paddingRight: 8,
    },
    rowtotaldonations: {
        width: '29%',
        textAlign: 'right',
        paddingRight: 8,
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    rowtotalHeader: {
        width: '100%',
        textAlign: 'center',
        color: "white",
    },
    rowtotaltext: {
        width: '70%',
        textAlign: 'left',
        paddingLeft: 8,
    },
    rowtotaldetail: {
        width: '30%',
        textAlign: 'left',
        paddingLeft: 8,
        borderLeftColor: borderColor,
        borderLeftWidth: 1,
    },
});
class ReportGenerate extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { reportData, type = 'angles' } = this.props;
        
    const { data = [], totalData = {}, total = 0, filtersData = {}} = reportData;
    const { location, year, month } = filtersData;
    
    let currentMonth = moment().format('MM');
        console.log(moment(month, 'MM').format('MMMM'), typeof currentMonth, typeof month);

        console.log(this.props, 'reportData this.props...');
        // const { totalData } = championData;
        console.log(reportData, 'reportData');

        const ReportTitle = ({ title }) => (
            <div>
                <View style={stylesPdf.titleContainer}>
                    <Text style={stylesPdf.reportTitle}>Charitable Contribution Statement</Text>
                </View>
                <View style={stylesPdf.titleContainer}>
                    {type == "champion" ?
                        (<>
                            <Text style={stylesPdf.reportDescription}>Thank you for your generous gift to
                            Orphan Angels. We are thrilled to have your support.
                            Through your donation we have been able to accomplish orphan goals and continue working
                            towards bright futures for orphan children's. You truly make the difference for us,
                            and we are extremely grateful</Text>
                        </>)
                        : (<>
                            <Text style={stylesPdf.reportDescription}>Thank you for your generous efforts towards
                            Orphan Angels. We are thrilled to have your support. It is your continued support
                            that sustains our mission and makes all the difference.</Text>
                        </>)
                    }

                </View>
            </div>
        );
        const ReportTotalTableHeader = () => (
            <View style={stylesPdf.container}>
                <Text style={stylesPdf.rowtotalHeader}>Summary of Contributions</Text>
            </View>
        );

        // const ReportSummaryTableHeader = () => (
        //     <View style={stylesPdf.container}>
        //         <Text style={stylesPdf.rowtotalHeader}>Summary</Text>
        //     </View>
        // );

        const ReportTotalTableRow = () => {
            const rows =
                <>
                    {type == "champion" ? (
                        <>
                            <View style={stylesPdf.row}>
                                <Text style={stylesPdf.rowtotaltext}>No. of children adopted</Text>
                                <Text style={stylesPdf.rowtotaldetail}>{ totalData.adoptedChild }</Text>
                            </View>
                            <View style={stylesPdf.row}>
                                <Text style={stylesPdf.rowtotaltext}>Total donation collected</Text>
                                <Text style={stylesPdf.rowtotaldetail}>${ totalData.donation }</Text>
                            </View>
                            <View style={stylesPdf.row}>
                                <Text style={stylesPdf.rowtotaltext}>Donation required</Text>
                                <Text style={stylesPdf.rowtotaldetail}>${ totalData.requirement }</Text>
                            </View>
                            <View style={stylesPdf.row}>
                                <Text style={stylesPdf.rowtotaltext}>Requirements completed</Text>
                                <Text style={stylesPdf.rowtotaldetail}>${ totalData.requirementComplete }</Text>
                            </View>
                            <View style={stylesPdf.row}>
                                <Text style={stylesPdf.rowtotaltext}>Requirements pending</Text>
                                <Text style={stylesPdf.rowtotaldetail}>${ totalData.requirementPending }</Text>
                            </View>
                        </>)
                        :
                        (<>
                            <View style={stylesPdf.row}>
                                <Text style={stylesPdf.rowtotaltext}>Total donation</Text>
                                <Text style={stylesPdf.rowtotaldetail}>${ total }</Text>
                            </View>
                        </>)
                    }
                </>
            return (<>{rows}</>)
        };

        const ReportSummaryTableRow = () => {
            const rows =
                <>
                    <>
                        <View style={stylesPdf.row}>
                            <Text style={stylesPdf.rowtotaltext}>Filter Range</Text>
                            <Text style={stylesPdf.rowtotaldetail}>
                                {currentMonth == month && year == null ? moment(month, 'MM').format('MMMM') + '-' + 'Till Now Date' : ''}
                                {currentMonth != month && month != null && year == null? moment(month, 'MM').format('MMMM') : ''}
                                {month == null && year != null ? year : ''}
                                {month != null && year != null ? moment(month, 'MM').format('MMMM') + '-' + year : ''}
                                {month == null && year == null ? 'Till Now Date' : ''}
                            </Text>
                        </View>
                    </>
                </>
            return (<>{rows}</>)
        };

        const ReportTableHeader = () => (
            <View style={stylesPdf.container}>
                <Text style={stylesPdf.description}>Children name</Text>
                <Text style={stylesPdf.age}>Age</Text>
                {type == "champion" ?
                    (<>
                        <Text style={stylesPdf.totaldonations}>Donation collected</Text>
                        <Text style={stylesPdf.date}>Requirements</Text>
                    </>)
                    : (<>
                        <Text style={stylesPdf.rate}>Amount</Text>
                        <Text style={stylesPdf.date}>Date</Text>
                    </>)
                }

            </View>
        );

        const ReportTableRow = () => {
            const rows = data.map(item =>
                <View style={stylesPdf.row} key={item.id}>
                    <Text style={stylesPdf.rowName}>
                        {type == "champion" ? `${item.orphan_name}` : `${item.orphan_first_name} ${item.orphan_last_name}`}
                    </Text>
                    <Text style={stylesPdf.rowAge}>{item.orphan_age ? item.orphan_age : '-'}</Text>
                    {type == "champion" ? (
                        <>
                            <Text style={stylesPdf.rowtotaldonations}>{item.totaldonations != null ? `$${item.totaldonations}` : `$0`}</Text>
                            <Text style={stylesPdf.rowDate}>{item.totalrequirement != null ? `$${item.totalrequirement}` : `$0`}</Text>
                        </>)
                        :
                        (<>
                            <Text style={stylesPdf.rowAmount}>${item.amount}</Text>
                            <Text style={stylesPdf.rowDate}>{getDateFormat(item.created_at)}</Text>
                        </>)
                    }

                </View>
            )
            return (<>{rows}</>)
        };

        const ReportTableFooter = () => (
            <View style={stylesPdf.titleContainer}>
                {type == "champion" ?
                    (<>
                        <Text style={stylesPdf.reportFooterDescription}>Supporting our team and childrens through <b>orphan helpers</b> with your generous donations.
                      You provide independence, hope, and joy every day to <b>orphan children</b> through your gifts.</Text>
                    </>)
                    : (<>
                        {/* <Text style={stylesPdf.reportFooterDescription}>Supporting our recipients and childrens through <b>orphan angels</b> with your generous collected donations.
                      You provide independence, hope, and joy every day to <b>orphan children</b> through your efforts.</Text> */}
                        <Text style={stylesPdf.reportFooterDescription}>Thank you for supporting our orphan children with your donations. You provide hope, joy, and independence to orphans every day through your generosity.</Text>
                    </>)
                }

            </View>
        );

        const ReportItemsTable = () => (
            <View style={stylesPdf.tableContainer}>
                <ReportTableHeader />
                <ReportTableRow />
            </View>
        );

        const ReportTotalItemsTable = () => (
            <View style={stylesPdf.tableContainer}>
                <ReportTotalTableHeader />
                <ReportSummaryTableRow />
                <ReportTotalTableRow />
            </View>
        );

        // const ReportSummaryItemsTable = () => (
        //     <View style={stylesPdf.tableContainer}>
        //         <ReportSummaryTableHeader />
        //         <ReportSummaryTableRow />
        //     </View>
        // );

        if (data.length == 0) {
            return (
                <Document>
                    <Page size="A4" style={stylesPdf.page}>
                        <Image style={stylesPdf.logo} src={'/images/logo.png'} />
                        <ReportTitle title='Report' />
                        <Text style={stylesPdf.textCenter}>Data not found</Text>
                    </Page>
                </Document>
            )
        }
        return (
            <Document>
                <Page size="A4" style={stylesPdf.page}>
                    <Image style={stylesPdf.logo} src={'/images/logo.png'} />
                    <ReportTitle title='Report' />
                    {/* <ReportSummaryItemsTable /> */}
                    <ReportTotalItemsTable />
                    <ReportItemsTable />
                    <ReportTableFooter />
                </Page>
            </Document>
        );
    }
}
export default ReportGenerate
