import gql from "graphql-tag";
import { apolloClient } from "../../apollo";
import { ToastsStore } from "../../../packages/react-toasts";
import _ from 'lodash';
import moment from 'moment'
export const GET_REPORTS = 'GET_REPORTS';
export const REPORTS_SUCCESS = 'REPORTS_SUCCESS';
export const GET_CHAMPION_REPORTS = 'GET_CHAMPION_REPORTS';

export function getReports(id, roleName, { location = null, date = null, year = null, month = null } = {}) {
    const GET_REPORT_MUTATION = gql`
        mutation ($id: Int!,$roleName: String!, $filter:JSON) {
            reports(input: {id: $id, roleName : $roleName, filter:$filter}) {
                data {
                    data {
                      angel_first_name
                      angel_last_name
                      angel_email
                      angel_address
                      angel_phone
                      transaction_id
                      orphan_date_of_birth
                      orphan_country_of_birth
                      orphan_institution_name
                      orphan_description
                      amount
                      id
                      orphan_age
                      orphan_first_name
                      orphan_last_name
                      created_at
                    }
                    status
                    total
                    messages
                    filtersData {
                        location
                        month
                        year
                    }
                  }
                }
        }
    `
    return (dispatch) => {
        const request = apolloClient.mutate({
            mutation: GET_REPORT_MUTATION,
            variables: {
                id: Number(id),
                roleName: roleName,
                filter: {
                    location: location ? location : null,
                    date: date ? moment(date).format("MM/DD/YYYY") : null,
                    year: year ? moment(year).format("YYYY") : null,
                    month: month ? moment(month).format("MM") : null
                }
            }
        });
        request.then((response) => {
            if (response.data.reports.data.status == 200) {
                dispatch({
                    type: GET_REPORTS,
                    payload: response.data.reports.data,
                });
            } else {
                ToastsStore.error(response.data.reports.data.messages);
            }
        }).catch((error) => {
            ToastsStore.error('Something went wrong. Please try again later.');
            throw error;
        });
    }
}

export function getChampionReports(id, roleName, { date = null, year = null, month = null } = {}) {
    const GET_CHAMPION_REPORT_MUTATION = gql`
        mutation ($id: Int!,$roleName: String!, $filter:JSON) {
            reports(input: {id: $id, roleName : $roleName, filter:$filter}) {
                data {
                    totalData {
                      donation
                      adoptedChild
                      requirement
                      requirementComplete
                      requirementPending
                    }
                    data {
                        angel_first_name
                        angel_last_name
                        angel_email
                        angel_address
                        angel_phone
                        orphan_first_name
                        orphan_last_name
                        orphan_date_of_birth
                        orphan_country_of_birth
                        orphan_institution_name
                        orphan_description
                        orphan_age
                        donation_amount
                        id
                        orphan_name
                        totalrequirement
                        totaldonations
                        created_at
                        age
                    }
                    status
                    total
                    messages
                    filtersData {
                        location
                        month
                        year
                    }
                  }
                }
        }
    `
    return (dispatch) => {
        const request = apolloClient.mutate({
            mutation: GET_CHAMPION_REPORT_MUTATION,
            variables: {
                id: Number(id),
                roleName: roleName,
                filter: {
                    date: date ? moment(date).format("MM/DD/YYYY") : null,
                    year: year ? moment(year).format("YYYY") : null,
                    month: month ? moment(month).format("MM") : null
                }
            }
        });
        request.then((response) => {
            if (response.data.reports.data.status == 200) {
                dispatch({
                    type: GET_CHAMPION_REPORTS,
                    payload: response.data.reports.data,
                });
            } else {
                ToastsStore.error(response.data.reports.data.messages);
            }
        }).catch((error) => {
            ToastsStore.error('Something went wrong. Please try again later.');
            throw error;
        });
    }
}


