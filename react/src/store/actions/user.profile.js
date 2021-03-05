import gql from "graphql-tag";
import { apolloClient } from "../../apollo";
import { parseError } from "../../helpers";
import { UserFragment } from "./../../graphql/user";
import { ToastsStore } from "./../../../packages/react-toasts";
import * as _ from "lodash";

export const SET_USER_TOKEN = "SET_USER_TOKEN";
export const LOGOUT_USER = "LOGOUT_USER";
export const SET_USER = "SET_USER";

export const GET_USER_PROFILE = "GET_USER_PROFILE";
export const USER_PROFILE_ERROR = "USER_PROFILE_ERROR";
export const UPDATE_PASSWORD_ERROR = "UPDATE_PASSWORD_ERROR";

export const GET_SECURITY_QUESTION = "GET_SECURITY_QUESTION";
export const GET_SECURITY_QUESTION_ERROR = "GET_SECURITY_QUESTION_ERROR";
export const UPDATE_SECURITY_QUESTION = "UPDATE_SECURITY_QUESTION";
export const ADD_SECURITY_QUESTION = "ADD_SECURITY_QUESTION";

export const GET_LOCATION = "GET_LOCATION";
export const GET_LOCATION_ERROR = "GET_LOCATION_ERROR";

export const ADD_CARD_SUCCESS = "ADD_CARD_SUCCESS";
export const ADD_CARD_ERROR = "ADD_CARD_ERROR";

export const GET_CARD_SUCCESS = "GET_CARD_SUCCESS";
export const GET_CARD_ERROR = "GET_CARD_ERROR";
export const DELETE_CARD_SUCCESS = "DELETE_CARD_SUCCESS";
export const UPDATE_CARD_SUCCESS = "UPDATE_CARD_SUCCESS";
export const UPDATE_PASSWORD = "UPDATE_PASSWORD";

export function setDefaultCard(requestData) {
  const DEFUALUT_CARD_MUTATION = gql`
    mutation ($stripe_id:String!, $cardId:String, $type:String){
      userStripeCard(input: { stripe_id: $stripe_id, cardId:$cardId, type:$type}) {
          data {
            messages
            status
          }
      }
    }
  `;
  const request = apolloClient.mutate({
    mutation: DEFUALUT_CARD_MUTATION,
    variables: { ...requestData },
  });
  return (dispatch) => {
    return request
      .then((response) => {
        if (response.data.userStripeCard.data.status == 200) {
          ToastsStore.success(response.data.userStripeCard.data.messages);
          dispatch(getCards(requestData.stripe_id))
        } else {
          return dispatch({
            type: ADD_CARD_ERROR,
            payload: response.data.userStripeCard.data.messages,
          });
        }
      }).catch((error) => {
        throw error;
      });
  };
}
export function deleteCard(requestData) {
  const DELETE_CARD_MUTATION = gql`
    mutation ($stripe_id:String!, $cardId:String, $type:String){
      userStripeCard(input: { stripe_id: $stripe_id, cardId:$cardId, type:$type}) {
          data {
            messages
            status
          }
      }
    }
  `;
  const request = apolloClient.mutate({
    mutation: DELETE_CARD_MUTATION,
    variables: { ...requestData },
  });
  return (dispatch) => {
    return request
      .then((response) => {
        if (response.data.userStripeCard.data.status == 200) {
          ToastsStore.success(response.data.userStripeCard.data.messages);
          dispatch(getCards(requestData.stripe_id))
        } else {
          return dispatch({
            type: ADD_CARD_ERROR,
            payload: response.data.userStripeCard.data.messages,
          });
        }

      }).catch((error) => {
        ToastsStore.error(parseError(error));
        throw error;
      });
  };
}
export function addCard(requestData) {
  const ADD_CARD_MUTATION = gql`
    mutation ($stripe_id:String!, $card_number: String!, $name:String!, $exp_month:String!, $exp_year:String!, $cvc:String, $type:String, $cardId:String){
      userStripeCard(input: { stripe_id: $stripe_id, card_number:$card_number,name:$name, exp_month:$exp_month, exp_year:$exp_year, cvc:$cvc, type: $type, cardId:$cardId}) {
          data {
            messages
            status
          }
      }
    }
  `;
  const request = apolloClient.mutate({
    mutation: ADD_CARD_MUTATION,
    variables: { ...requestData },
  });
  return (dispatch) => {
    return request
      .then((response) => {
        if (response.data.userStripeCard.data.status == 200) {
          ToastsStore.success("Card details added successfully.");
          dispatch({
            type: ADD_CARD_SUCCESS,
            payload: 'success',
          })
          dispatch(getCards(requestData.stripe_id))
        } else {
          return dispatch({
            type: ADD_CARD_ERROR,
            payload: response.data.userStripeCard.data.messages,
          });
        }

      }).catch((error) => {
        ToastsStore.error(parseError(error));
        throw error;
      });
  };
}
export function updateCard(requestData) {
  const UPDATE_CARD_MUTATION = gql`
    mutation ($stripe_id:String!, $name:String!, $exp_month:String!, $exp_year:String!, $type:String, $cardId:String){
      userStripeCard(input: { stripe_id: $stripe_id, name:$name, exp_month:$exp_month, exp_year:$exp_year, type: $type, cardId:$cardId}) {
          data {
            messages
            status
          }
      }
    }
  `;
  const request = apolloClient.mutate({
    mutation: UPDATE_CARD_MUTATION,
    variables: { ...requestData },
  });
  return (dispatch) => {
    return request
      .then(async (response) => {
        if (response.data.userStripeCard.data.status == 200) {
          await dispatch({
            type: UPDATE_CARD_SUCCESS,
            payload: 'success',
          })
          await dispatch(getCards(requestData.stripe_id))
          ToastsStore.success("Card details updated successfully.");
        } else {
          return dispatch({
            type: ADD_CARD_ERROR,
            payload: response.data.userStripeCard.data.messages,
          });
        }

      }).catch((error) => {
        ToastsStore.error(parseError(error));
        throw error;
      });
  };
}
export function getCards(stripe_id) {
  const GET_CARD_MUTATION = gql`
    mutation ($stripe_id :String!){
      userStripeGetCard(input: { stripe_id : $stripe_id }) {
          data {
            data {
              brand
              customer
              default_source
              exp_month
              exp_year
              id
              last4
              name
              object
            }
            messages
            status
          }
        }
      }
  `;
  const request = apolloClient.mutate({
    mutation: GET_CARD_MUTATION,
    variables: { stripe_id },
  });

  return (dispatch) => {
    return request.then((response) => {
      Promise.all([
        dispatch({
          type: GET_CARD_SUCCESS,
          payload: response.data.userStripeGetCard.data.data,
        }),
      ]);
    }).catch((error) => {
      ToastsStore.error(parseError(error));
      throw error;
    });
  };
}
export function getCurrentUser(id) {
  const CURRENT_USER_QUERY = gql`
    query user($id: BigInt!) {
      user(id: $id) {
        ...FullUser
      }
      usersSecurityQuestions {
        nodes {
          id
          answer
          securityQuestionId
        }
      }
    }
    ${UserFragment.FullUser}
  `;
  const request = apolloClient.query({
    fetchPolicy: "network-only",
    query: CURRENT_USER_QUERY,
    variables: { id },
  });

  return (dispatch) =>
    request
      .then((response) => {
        dispatch({
          type: GET_USER_PROFILE,
          payload: response.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: USER_PROFILE_ERROR,
          payload: parseError(error),
        });
        throw error;
      });
}
export function getSecurityQuestions() {
  const GET_SECURITY_QUESTIONS = gql`
    query securityQuestions {
      securityQuestions {
        nodes {
          id
          question
        }
      }
    }
  `;

  const request = apolloClient.query({
    fetchPolicy: "network-only",
    query: GET_SECURITY_QUESTIONS,
  });

  return (dispatch) =>
    request
      .then((response) => {
        dispatch({
          type: GET_SECURITY_QUESTION,
          payload: response.data.securityQuestions.nodes,
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_SECURITY_QUESTION_ERROR,
          payload: parseError(error),
        });
        throw error;
      });
}

export function getLocations() {
  const GET_LOCATION_QUERY = gql`
    query countries {
      countries {
        nodes {
          id
          name
        }
      }
    }
  `;

  const request = apolloClient.query({
    fetchPolicy: "network-only",
    query: GET_LOCATION_QUERY,
  });

  return (dispatch) =>
    request
      .then((response) => {
        dispatch({
          type: GET_LOCATION,
          payload: response.data.countries.nodes,
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_LOCATION_ERROR,
          payload: parseError(error),
        });
        throw error;
      });
}

export function createSecurityQuestion(questionModel) {
  const CREATE_SECURITY_QUES_MUTATION = gql`
    mutation createUsersSecurityQuestion($input: UsersSecurityQuestionInput!) {
      createUsersSecurityQuestion(input: { usersSecurityQuestion: $input }) {
        usersSecurityQuestion {
          id
        }
      }
    }
  `;
  const input = {
    securityQuestionId: questionModel.securityQuestionId,
    answer: questionModel.security_answer,
    userId: questionModel.user_id,
  };

  const request = apolloClient.mutate({
    mutation: CREATE_SECURITY_QUES_MUTATION,
    variables: { input },
  });

  return (dispatch) => {
    return request.then((response) => {
      ToastsStore.success("Security question successfully updated");
      Promise.all([
        dispatch({
          type: ADD_SECURITY_QUESTION,
          payload: response.data,
        }),
      ]).then(() => dispatch(getCurrentUser(questionModel.user_id)));
    });
  };
}
export function updateSecurityQuestion(questionModel) {
  const UPDATE_SEQURITY_QUESTION_MUTATION = gql`
    mutation updateUsersSecurityQuestion(
      $patch: UsersSecurityQuestionPatch!
      $id: BigInt!
    ) {
      updateUsersSecurityQuestion(input: { patch: $patch, id: $id }) {
        usersSecurityQuestion {
          id
        }
      }
    }
  `;
  const patch = {
    securityQuestionId: questionModel.securityQuestionId,
    answer: questionModel.security_answer,
    userId: questionModel.user_id,
  };
  const request = apolloClient.mutate({
    mutation: UPDATE_SEQURITY_QUESTION_MUTATION,
    variables: { patch, id: questionModel.id },
  });

  return (dispatch) => {
    return request.then((response) => {
      ToastsStore.success("Security question successfully updated");
      Promise.all([
        dispatch({
          type: UPDATE_SECURITY_QUESTION,
          payload: response.data,
        }),
      ]).then(() => dispatch(getCurrentUser(questionModel.user_id)));
    })
  };
}

export function updateProfile(user) {

  const EMAIL_VERIFICATION = gql`
  mutation ($id: Int!) {
      registerUser(input: { id: $id, type: "update" }) {
          data {
              messages
              status
          }
      }
  }
  `
  const UPDATE_USER_MUTATION = gql`
    mutation updateUser($patch: UserPatch!, $id: BigInt!) {
      updateUser(input: { patch: $patch, id: $id }) {
        user {
          ...FullUser
        }
      }
    }
    ${UserFragment.FullUser}
  `;
  const patch = _.pick(user, [
    "firstName",
    "lastName",
    "email",
    "dob",
    "phone",
    "address",
    "image",
    "updatedEmail"
  ]);
  const request = apolloClient.mutate({
    mutation: UPDATE_USER_MUTATION,
    variables: { patch, id: user.id },
  });
  if (user.isMailUpdated == true) {
    const CHECK_USER_EMAIL = gql`
      query userByEmail($email: String!) {
        userByEmail(email: $email) {
          id
        }
      }
    `;
    const email = user.updatedEmail;
    const emailRequest = apolloClient.query({
      query: CHECK_USER_EMAIL,
      variables: {
        email,
      },
    });
    return async (dispatch) => {
      return emailRequest
        .then((response) => {
          if (response.data.userByEmail === null) {
            return request
              .then(async (response) => {
                if (user.isMailUpdated) {
                  const id = Number(response.data.updateUser.user.id);
                  await apolloClient.mutate({ mutation: EMAIL_VERIFICATION, variables: { id } }).then((res) => res.data)
                }
                ToastsStore.success("Profile updated successfully.");
                // Promise.all([
                //   dispatch({
                //     type: GET_USER_PROFILE,
                //     payload: response.data.updateUser,
                //   }),
                // ]);
              })
              .catch((error) => {
                dispatch({
                  type: USER_PROFILE_ERROR,
                  payload: error,
                });
              });
          } else {
            dispatch({
              type: USER_PROFILE_ERROR,
              payload: `${email} this email already taken`,
            });
          }
        })
    }
  } else {
    return async (dispatch) => {
      return request
        .then(async (response) => {
          if (user.isMailUpdated) {
            const id = Number(response.data.updateUser.user.id);
            await apolloClient.mutate({ mutation: EMAIL_VERIFICATION, variables: { id } }).then((res) => res.data)
          }
          ToastsStore.success("Profile updated successfully.");
          // Promise.all([
          //   dispatch({
          //     type: GET_USER_PROFILE,
          //     payload: response.data.updateUser,
          //   }),
          // ]);
        })
        .catch((error) => {
          dispatch({
            type: USER_PROFILE_ERROR,
            payload: error,
          });
        });
    };
  }
}

export function updatePassword(userPassword) {
  const CHANGE_PASSWORD_MUTATION = gql`
    mutation changePassword($input: ChangePasswordInput!) {
      changePassword(input: $input) {
        boolean
      }
    }
  `;

  return (dispatch) => {
    const input = {
      oldPassword: userPassword.old_password,
      newPassword: userPassword.new_password,
    };
    const request = apolloClient.mutate({
      fetchPolicy: "no-cache",
      mutation: CHANGE_PASSWORD_MUTATION,
      variables: { input },
    });
    return request
      .then((response) => {
        ToastsStore.success("Password updated successfully.");
        Promise.all([
          dispatch({
            type: UPDATE_PASSWORD,
            payload: response.data.changePassword,
          }),
        ]);
      })
      .catch((error) => {
        return dispatch({
          type: UPDATE_PASSWORD_ERROR,
          payload: error,
        });
      });
  };
}
