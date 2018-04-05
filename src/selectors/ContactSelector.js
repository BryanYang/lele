import { createSelector } from "reselect";
import _ from "lodash";

const currentContacts = (state, { path }) => {
  const contactType = path === "/message" ? "roster" : path;
  /*
  if (contactType === "roster") {
    return [
      ..._.get(state, ["entities", "roster"], []),
      // ..._.get(state, ["entities", "group"], [])
    ];
  }
  */
  return _.get(state, ["entities", 'group'], []);
};

const getCurrentContacts = createSelector(
  [currentContacts],
  contacts => contacts
);

export default getCurrentContacts;
