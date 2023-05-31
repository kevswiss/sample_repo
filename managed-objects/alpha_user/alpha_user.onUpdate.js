/**
 * @file This script updates a password in a remote LDAP directory
 * @version 0.1.0
 * @keywords ldap password update
 * @license
 * The contents of this file are subject to the terms of the Common Development and
 * Distribution License (the License). You may not use this file except in compliance with the
 * License.
 *
 * You can obtain a copy of the License at LICENSE.md. See the License for the
 * specific language governing permission and limitations under the License.
 *
 * When distributing Covered Software, include this CDDL Header Notice in each file and include
 * the License file at LICENSE.md. If applicable, add the following below the CDDL
 * Header, with the fields enclosed by brackets {{}} replaced by your own
 * information: "Portions copyright {{year}} {{name_of_copyright_owner}}".
 *
 * Copyright {{year}} ForgeRock AS.
 */
(function(){
  /**
   * configuration
   */
  var config = {
    nodeName: "alpha_user-onUpdate",
    ldapUserNameAttribute: "sAMAccountName",
    ldapConnectorName: "LdapConnector"
  };

  /**
   * Helper function to tag a message for logging purposes
   * @param {} message the message to be tagged
   * @returns tagged message
   */
  function _tag(message){
    return `${config.nodeName}:: ${message}`;
  }

  // Script entry point

  require('onUpdateUser').preserveLastSync(object, oldObject, request);
})();