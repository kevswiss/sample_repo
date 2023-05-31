var roles = {
    jiraviewer: {
        _ref:"managed/alpha_role/jira-viewer"
    }, 
    jiraadmin: {
        _ref: "managed/alpha_role/jira-admin"
    },
}
if (object.frUnindexedString2 !== null) { 
    parsedRoles = object.frUnindexedString2.split(',') 
    effectiveRoles = parsedRoles.filter(r => !!roles[r]).map(r => roles[r]) 
    if (effectiveRoles.length > 0) {
         object.roles = effectiveRoles 
        } 
}