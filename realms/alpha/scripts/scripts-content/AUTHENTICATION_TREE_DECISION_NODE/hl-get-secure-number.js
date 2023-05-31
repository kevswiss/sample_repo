/**
 * @file Get secure number from Auth Engine.
 * @version 0.1
 * @license DISCLAIMER: The sample code described herein is provided on an "as is" basis, without warranty of any kind, to the fullest extent permitted by law. ForgeRock does not warrant or guarantee the individual success developers may have in implementing the sample code on their development platforms or in production configurations. ForgeRock does not warrant, guarantee or make any representations regarding the use, results of use, accuracy, timeliness or completeness of any data or information relating to the sample code. ForgeRock disclaims all warranties, expressed or implied, and in particular, disclaims all warranties of merchantability, and warranties related to the code, or any service or software related thereto.
 * ForgeRock shall not be liable for any direct, indirect or consequential damages or costs of any type arising out of any action taken by you or others related to the sample code.
 */

var javaImports = JavaImporter(
  org.forgerock.openam.auth.node.api.Action,
  javax.security.auth.callback.NameCallback,
  javax.security.auth.callback.HiddenValueCallback,
  com.sun.identity.authentication.callbacks.ScriptTextOutputCallback,
  com.sun.identity.authentication.spi.MetadataCallback,
  org.forgerock.openam.authentication.callbacks.NumberAttributeInputCallback,
  javax.security.auth.callback.TextOutputCallback,
  javax.security.auth.callback.PasswordCallback,
  org.forgerock.json.JsonValue,
  java.lang.String
);

var config = {
  nodeName: "hl-get-secure-numbers",
  secretNumberField: "authEngineSecretNumber",
};

var nodeOutcomes = {
  SUCCESS: "success",
  ERROR: "error",
};

var nodeLogger = {
  debug: function (message) {
    logger.message("***" + config.nodeName + " " + message);
  },
  warning: function (message) {
    logger.warning("***" + config.nodeName + " " + message);
  },
  error: function (message) {
    logger.error("***" + config.nodeName + " " + message);
  },
};

function getRequirementsFromAuthEngine() {
  //call auth engine and get the requirements for the secure number
  var secureNumber = {
    firstPosition: 2,
    secondPosition: 5,
  };
  return secureNumber;
}

(function () {
  nodeLogger.debug("Started");
  try {
    var secureNumber = getRequirementsFromAuthEngine();
    sharedState.put(config.secretNumberField, JSON.stringify(secureNumber));
    action = javaImports.Action.goTo(nodeOutcomes.SUCCESS).build();
  } catch (e) {
    nodeLogger.error("Unexpected Error: " + e);
    action = javaImports.Action.goTo(nodeOutcomes.ERROR).build();
  }
})();
