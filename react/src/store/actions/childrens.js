import gql from "graphql-tag";
import client from '../../../../admin/src/client';
import { apolloClient } from "../../apollo";
import { parseError } from "../../helpers";
import { ChildrenFragment } from "./../../graphql/children";
import { OrphanEducationsFragment } from "./../../graphql/orphan-educations";
import { OrphanHealthsFragment } from "./../../graphql/orphan-healths";
import { OrphanRequirementsFragment } from "./../../graphql/orphan-requirement";
import { PageInfoFragment } from "../../graphql/common";
import { ToastsStore } from "./../../../packages/react-toasts";
import * as _ from "lodash";
import {addNotification} from './notification';


export const GET_ALL_CHILDRENS = "GET_ALL_CHILDRENS";
export const GET_ALL_ACTIVE_CHILDRENS = "GET_ALL_ACTIVE_CHILDRENS";
export const GET_ALL_PENDING_CHILDRENS = "GET_ALL_PENDING_CHILDRENS";

export const GET_ALL_CHILDRENS_ERROR = "GET_ALL_CHILDRENS_ERROR";
export const GET_CHILDREN_PROFILE = "GET_CHILDREN_PROFILE";

export const GET_SEARCH_CHILDRENS = "GET_SEARCH_CHILDRENS";
export const GET_SEARCH_CHILDRENS_ERROR = "GET_SEARCH_CHILDRENS_ERROR";
export const REQUEST_SEARCH_GLOBAL_CHILDREN = "REQUEST_SEARCH_GLOBAL_CHILDREN";

export const ADOPT_CHILD_REQUEST_SUCCESS = "ADOPT_CHILD_REQUEST_SUCCESS";
export const ADOPT_CHILD_REQUEST_ERROR = "ADOPT_CHILD_REQUEST_ERROR";
export const REQUEST_ADOPT_CHILD = "REQUEST_ADOPT_CHILD";

export const ADD_ORPHAN_DETAILS = 'ADD_ORPHAN_DETAILS';

export const GET_ALL_HEADER = "GET_ALL_HEADER";
export const GET_ALL_HEADER_ERROR = "GET_ALL_HEADER_ERROR";

export const GET_ALL_ORPHANS = "GET_ALL_ORPHANS";
export const LOAD_MORE_ORPHANS = "LOAD_MORE_ORPHANS";

export const SEARCH_LOADER = "SEARCH_LOADER";

export const REMOVE_EDUCATION_HEALTH = "REMOVE_EDUCATION_HEALTH";


export function getAllChildrens() {
  const GET_CHILDRENS = gql`
    query orphans {
      orphans(condition: {status: "active"}) {
          nodes {
              ...BasicOrphanChild
          }
      }
    }
    ${ChildrenFragment.BasicOrphanChild}
  `;

  const request = apolloClient.query({
    fetchPolicy: "network-only",
    query: GET_CHILDRENS,
  });

  return (dispatch) =>
    request
      .then((response) => {
        dispatch({
          type: GET_ALL_CHILDRENS,
          payload: response.data.orphans.nodes,
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_ALL_CHILDRENS_ERROR,
          payload: parseError(error),
        });
        throw error;
      });
}

export function getChildrenProfile(id) {
  const CHILDREN_PROFILE_QUERY = gql`
    query orphan($id: BigInt!) {
      orphan(id: $id) {
          ...FullOrphanChild
      }
    }
    ${ChildrenFragment.FullOrphanChild}
  `;

  const request = apolloClient.query({
    fetchPolicy: "network-only",
    query: CHILDREN_PROFILE_QUERY,
    variables: { id },
  });

  return (dispatch) =>
    request
      .then((response) => {
        dispatch({
          type: GET_CHILDREN_PROFILE,
          payload: response.data.orphan,
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_ALL_CHILDRENS_ERROR,
          payload: parseError(error),
        });
        throw error;
      });
}

export const requestSearch = () => ({
  type: REQUEST_SEARCH_GLOBAL_CHILDREN,
});

export function searchChild(searcha) {
  
  const SERACH_GLOBAL_CHILDREN = gql`

  mutation orphanSearch($filter: JSON) {
      orphanSearch(input: { filter: $filter}) {
        data {
          messages
          status
          data{
            first_name
            id
            date_of_birth
            country_of_birth
            comments
            age
            gender
            last_name
            image
            is_donated
          }
        }
      }
    }
  `;
  const request = apolloClient.mutate({
    mutation: SERACH_GLOBAL_CHILDREN,
    variables: { filter: searcha },
  });


  return (dispatch) => {
    dispatch({
      type: SEARCH_LOADER,
      payload: true,
    });
    dispatch(requestSearch());
    request
      .then((response) => {
        dispatch({
          type: GET_SEARCH_CHILDRENS,
          payload: response.data.orphanSearch.data.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_SEARCH_CHILDRENS_ERROR,
          payload: parseError(error),
        });
        throw error;
      });
  }
}

export function adoptChild(requestData) {
  const CHAMPION_ADOPT_CHILD_MUTATION = gql`
    mutation createChampionRequest($input: ChampionRequestInput!) {
      createChampionRequest(input: {championRequest: $input}) {
        championRequest{
          id
          orphanId
          championId
        }
      }
    }
  `;
  const input = {
    orphanId: requestData.orphanId,
    championId: requestData.championId,
  };
  const request = apolloClient.mutate({
    mutation: CHAMPION_ADOPT_CHILD_MUTATION,
    variables: { input },
  });
  return (dispatch) => {
    dispatch({
      type: REQUEST_ADOPT_CHILD,

    })
    return request
      .then((response) => {
        ToastsStore.success("Adopt child Request sent successfully.");
        dispatch({
          type: ADOPT_CHILD_REQUEST_SUCCESS,
          payload: response.data.createChampionRequest.championRequest,
        })
      }).catch((error) => {
        return dispatch({
          type: ADOPT_CHILD_REQUEST_ERROR,
          payload: error,
        });
      });
  };
}

function getApprovedChildQuery(args = {}) {
  const { limit = 25, after, before, userId } = args;
  const GET_NOTIFICATIONS_QUERY = gql`
      query orphans($userId: BigInt, $limit: Int, $after: Cursor, $before: Cursor) {
        orphans(filter : {championOrphans: {some: {championId: {equalTo: $userId } } } }, first: $limit, after: $after, before: $before)  {
              edges {
                cursor
                node {
                  id
                  firstName
                  image
                  lastName
                  placeOfBirth
                  dateOfBirth
                }
              }
              totalCount
              pageInfo {
                  ...PageInfo
              }
          },
      }
      ${PageInfoFragment}
  `;
  return apolloClient.query({
    fetchPolicy: "network-only",
    query: GET_NOTIFICATIONS_QUERY,
    variables: { limit, after, before, userId }
  });
}
export function getApprovedChildrens(prev = null) {
  return (dispatch, getState) => {
    const state = getState();
    let pageType = { userId: state.auth.user.id };
    if (state.childrens.activeChildrens.edges.length > 0){
        if(prev == null){
          pageType =  { after: state.childrens.activeChildrens.pageInfo.startCursor, userId: state.auth.user.id }
        }else{
          pageType =  { before: state.childrens.activeChildrens.pageInfo.endCursor, userId: state.auth.user.id }
        }
    }

    getApprovedChildQuery(pageType).then((response) => {
      dispatch({
        type: GET_ALL_ACTIVE_CHILDRENS,
        payload: response.data.orphans,
      });
    }).catch((error) => {
      ToastsStore.error('Something went wrong. Please try again later.');
      throw error;
    });
  }
}

export function getPendingChildrens(championId) {
  const GET_PENDING_CHILDRENS = gql`
    query championRequests($championId: BigInt!) {
      championRequests(condition: {status: "pending", championId:$championId}) {
          nodes {
            id
            orphan {
              comments
              firstName
              lastName
              middelName
              image
            }
          }
      }
    }
  `;

  const request = apolloClient.query({
    fetchPolicy: "network-only",
    query: GET_PENDING_CHILDRENS,
    variables: { championId },
  });

  return (dispatch) =>
    request
      .then((response) => {
        dispatch({
          type: GET_ALL_PENDING_CHILDRENS,
          payload: response.data.championRequests.nodes,
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_ALL_CHILDRENS_ERROR,
          payload: parseError(error),
        });
        throw error;
      });
}

export function onDeleteHealth(id, profileId) {
  const DELETE_EDUCATION_MUTATION = gql`
      mutation deleteOrphanHealth($id : BigInt!){
        deleteOrphanHealth(input: { id: $id }) {
              clientMutationId
          }
      }
  `;
  
  return (dispatch, getState) => {
    const request = client.mutate({ mutation: DELETE_EDUCATION_MUTATION, fetchPolicy: "no-cache", variables: { id: id } });
    request
      .then((response) => {
        ToastsStore.success('Orphan Health successfully deleted'),
        dispatch({
          type: REMOVE_EDUCATION_HEALTH,
          payload: 'success',
        });
        dispatch(getChildrenProfile(profileId));
      })
      .catch((error) => {
          ToastsStore.error('Something went wrong. Please try again later.');
          throw error;
      });
  };
}

export function onDeleteEducation(id, profileId) {
    const DELETE_EDUCATION_MUTATION = gql`
        mutation deleteOrphanEducation($id : BigInt!){
          deleteOrphanEducation(input: { id: $id }) {
                clientMutationId
            }
        }
    `;
    
    return (dispatch, getState) => {
      const request = client.mutate({ mutation: DELETE_EDUCATION_MUTATION, fetchPolicy: "no-cache", variables: { id: id } });
      request
        .then((response) => {
          ToastsStore.success('Orphan Education successfully deleted'),
          dispatch({
            type: REMOVE_EDUCATION_HEALTH,
            payload: 'success',
          });
          dispatch(getChildrenProfile(profileId));
        })
        .catch((error) => {
          ToastsStore.error('Something went wrong. Please try again later.');
          throw error;
        });
    };
}

export function addEducation(data) {

  const CREATE_ORPHAN_MUTATION = gql`
  mutation createOrphanEducation($input: OrphanEducationInput!) {
    createOrphanEducation(input: { orphanEducation: $input}) {
        orphanEducation {
              ...FullOrphanEducations
          }
      }
  }
  ${OrphanEducationsFragment.FullOrphanEducations}
`;

  return (dispatch, getState) => {
    const input = {
      grade: data.grade,
      comment: data.comment,
      educationReviewDate: data.educationReviewDate,
      orphanId: Number(data.orphanId),
    }

    const request = client.mutate({ mutation: CREATE_ORPHAN_MUTATION, fetchPolicy: "no-cache", variables: { input } });
    request
      .then((response) => {
        ToastsStore.success("Children education added successfully.");
        dispatch({
          type: ADD_ORPHAN_DETAILS,
          payload: 'success',
        });
        dispatch(getChildrenProfile(data.orphanId));
      })
      .catch((error) => {
        dispatch({
          type: GET_ALL_CHILDRENS_ERROR,
          payload: parseError(error),
        });
        throw error;
      });
  };
}

export function addHealth(data) {
  const CREATE_ORPHAN_MUTATION = gql`
  mutation createOrphanHealth($input: OrphanHealthInput!) {
    createOrphanHealth(input: { orphanHealth: $input}) {
      orphanHealth {
              ...FullOrphanHealth
          }
      }
  }
  ${OrphanHealthsFragment.FullOrphanHealth}
`;

  return (dispatch, getState) => {
    const input = {
      lastDoctor: data.lastDoctor,
      healthReviewDate: data.healthReviewDate,
      doctorName: data.doctorName,
      vaccinations: data.vaccinations,
      disabilities: data.disabilities,
      orphanId: data.orphanId,
    }

    const request = client.mutate({ mutation: CREATE_ORPHAN_MUTATION, variables: { input } });
    request
      .then((response) => {
        ToastsStore.success("Children health added successfully.");
        dispatch({
          type: ADD_ORPHAN_DETAILS,
          payload: 'success',
        });
        dispatch(getChildrenProfile(data.orphanId));
      })
      .catch((error) => {
        dispatch({
          type: GET_ALL_CHILDRENS_ERROR,
          payload: parseError(error),
        });
        throw error;
      });
  };
}

export function addRequirement(data) {
  const CREATE_ORPHAN_MUTATION = gql`
  mutation createOrphanNeed($input: OrphanNeedInput!) {
    createOrphanNeed(input: { orphanNeed: $input}) {
      orphanNeed {
            orphan {
              firstName
              lastName
            }
            ...FullOrphanRequirement
          }
      }
  }
  ${OrphanRequirementsFragment.FullOrphanRequirement}
`;

  return (dispatch) => {
    const input = {
      amount: data.amount,
      closeDate: data.closeDate,
      description: data.description,
      title: data.title,
      orphanId: data.orphanId,
    }
    const request = client.mutate({ mutation: CREATE_ORPHAN_MUTATION, variables: { input } });
    request
      .then((response) => {
        const orphanNeed = response.data.createOrphanNeed.orphanNeed;
        const description = `$${orphanNeed.amount} requirment added for ${orphanNeed.orphan.firstName} ${orphanNeed.orphan.lastName}`;
        ToastsStore.success("Requirement added successfully.");
        dispatch({
          type: ADD_ORPHAN_DETAILS,
          payload: 'success',
        }),
        dispatch(addNotification('New Requirement', {description : description}, false)),
        dispatch(getChildrenProfile(data.orphanId));
      })
      .catch((error) => {
        dispatch({
          type: GET_ALL_CHILDRENS_ERROR,
          payload: parseError(error),
        });
        throw error;
      });
  };
}


function query(args = {}) {
  console.log(args, 'args');
  const { limit = 10, after, before, age ='', category= '', champion= '', fund= '', gender='', roleName= '' } = args;
  const GET_ORPHANS_QUERY = gql`
      query orphans($age: Int, $limit: Int, $after: Cursor, $before: Cursor) {
          orphans(filter: { age: {equalTo: $age} }, orderBy: CREATED_AT_DESC, first: $limit, after: $after, before: $before)  {
              edges {
                  cursor
                  node {
                    id
                    image
                    firstName
                    age
                    lastName
                    gender
                    comments
                  }
              }
              totalCount
              pageInfo {
                  ...PageInfo
              }
          },
      }
      ${PageInfoFragment}
  `;
  return apolloClient.query({
      fetchPolicy: "network-only",
      query: GET_ORPHANS_QUERY,
      variables: { limit, after, before }
  });
}

export function getAllOrphans(args = {}) {
  return (dispatch, getState) => {
      const state = getState();
      query({ ...args }).then((response) => {
          dispatch({
              type: GET_ALL_ORPHANS,
              payload: response.data.orphans,
          })
      }).catch((error) => {
          ToastsStore.error('Something went wrong. Please try again later.');
          throw error;
      });
  }
}

export function loadMoreOrphans(cursor) {
  return (dispatch, getState) => {
      const state = getState();
      query({ after: cursor }).then((response) => {
          dispatch({
              type: LOAD_MORE_ORPHANS,
              payload: response.data.orphans,
          })
      }).catch((error) => {
          ToastsStore.error('Something went wrong. Please try again later.');
          throw error;
      });
  }
}