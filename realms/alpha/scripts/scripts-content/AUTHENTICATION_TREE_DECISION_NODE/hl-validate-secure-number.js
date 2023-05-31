/**
 * @file Validate secure number with AuthEngine
 * @version 0.1
 * @license DISCLAIMER: The sample code described herein is provided on an "as is" basis, without warranty of any kind, to the fullest extent permitted by law. ForgeRock does not warrant or guarantee the individual success developers may have in implementing the sample code on their development platforms or in production configurations. ForgeRock does not warrant, guarantee or make any representations regarding the use, results of use, accuracy, timeliness or completeness of any data or information relating to the sample code. ForgeRock disclaims all warranties, expressed or implied, and in particular, disclaims all warranties of merchantability, and warranties related to the code, or any service or software related thereto.
 * ForgeRock shall not be liable for any direct, indirect or consequential damages or costs of any type arising out of any action taken by you or others related to the sample code.
 */

var javaImports = JavaImporter(
  org.forgerock.openam.auth.node.api.Action,
  javax.security.auth.callback.NameCallback,
  com.sun.identity.authentication.callbacks.ScriptTextOutputCallback,
  com.sun.identity.authentication.spi.MetadataCallback,
  org.forgerock.openam.authentication.callbacks.NumberAttributeInputCallback,
  javax.security.auth.callback.TextOutputCallback,
  javax.security.auth.callback.PasswordCallback,
  org.forgerock.json.JsonValue,
  java.lang.String
);

var config = {
  nodeName: "hl-validate-secure-number",
  secretNumberResponseField: "secretNumberResponse",
  secureNumberErrorMsg: "secureNumberErrorMsg",
};

var nodeOutcomes = {
  SUCCESS: "success",
  ERROR: "error",
  FAIL: "fail",
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
function validateSecureNumberWithAuthEngine(secureNumberResponse) {
  var secureNumber = JSON.parse(secureNumberResponse);
  // hardcoded response for illustration only, in reality:
  // call auth engine with collected response
  // parse response and return outcome
  if (secureNumber.first == 2 && secureNumber.second == 4) {
    return true;
  }
  return false;
}
function getAction(secureNumberResponse) {
  var result = validateSecureNumberWithAuthEngine(secureNumberResponse);
  if (!!result) {
    return javaImports.Action.goTo(nodeOutcomes.SUCCESS).build();
  }
  sharedState.put(
    config.secureNumberErrorMsg,
    "The number you entered did not match. Try again."
  );
  return javaImports.Action.goTo(nodeOutcomes.FAIL).build();
}

(function () {
  try {
    var secureNumber = transientState.get(config.secretNumberResponseField);
    action = getAction(secureNumber);
  } catch (e) {
    nodeLogger.error("Unexpected Error: " + e);
    action = javaImports.Action.goTo(nodeOutcomes.ERROR).build();
  }
})();
