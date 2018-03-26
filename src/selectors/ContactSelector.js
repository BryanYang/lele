import { createSelector } from "reselect"
import _ from "lodash"

const currentContacts = (state, { path }) => {
    const contactType = path === "/message" ? "roster" : path
    console.log(path);
    return _.get(state, [ "entities", contactType ], [])
}

const getCurrentContacts = createSelector(
    [ currentContacts ],
    (contacts) => contacts
)

export default getCurrentContacts
