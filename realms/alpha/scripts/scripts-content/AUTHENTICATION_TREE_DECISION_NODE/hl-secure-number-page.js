/**
 * @file Display secure number screen
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
  nodeName: "hl-secure-number-page",
  secureNumberErrorMsg: "secureNumberErrorMsg",
  secretNumberField: "authEngineSecretNumber",
  secretNumberResponseField: "secretNumberResponse",
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

var secretNumberMap = {
  1: "1st",
  2: "2nd",
  3: "3rd",
  4: "4th",
  5: "5th",
  6: "6th",
};

function secureNumberMetadata(secureNumberRequirements) {
  var secureNumberMetadata = javaImports.JsonValue.json({
    output: {
      pageType: "secureNumberPage",
      firstPosition: secureNumberRequirements.firstPosition,
      secondPosition: secureNumberRequirements.secondPosition,
    },
  });

  var secureNumberMetadataCallback = new javaImports.MetadataCallback(
    secureNumberMetadata
  );
  return secureNumberMetadataCallback;
}

/**
 * find callback by type and label
 */
function getCallback(callbacks, type, label) {
  for (var i = 0; i < callbacks.length; ++i) {
    if (
      callbacks.get(i) instanceof type &&
      callbacks.get(i).getPrompt() == label
    ) {
      return callbacks.get(i);
    }
  }
  return null;
}

function getAction(secretNumber) {
  if (callbacks.isEmpty()) {
    var responseCallbacks = [];
    var errorMsg = sharedState.get(config.secureNumberErrorMsg);
    if (!!errorMsg) {
      responseCallbacks.push(
        new javaImports.TextOutputCallback(
          javaImports.TextOutputCallback.ERROR,
          errorMsg
        )
      );
    }
    // SDK only: send metadata to the fronted to influence how to display
    // responseCallbacks.push(secureNumberMetadata(secretNumber));

    responseCallbacks.push(
      new javaImports.TextOutputCallback(
        javaImports.TextOutputCallback.INFORMATION,
        "please enter the " +
          secretNumberMap[secretNumber.firstPosition] +
          " and " +
          secretNumberMap[secretNumber.secondPosition] +
          " digit of your secret number"
      )
    );
    responseCallbacks.push(
      new javaImports.PasswordCallback(
        secretNumberMap[secretNumber.firstPosition] + " digit",
        false
      )
    );
    responseCallbacks.push(
      new javaImports.PasswordCallback(
        secretNumberMap[secretNumber.secondPosition] + " digit",
        false
      )
    );

    return javaImports.Action.send(responseCallbacks).build();
  } else {
    var firstNumber = javaImports.String(
      getCallback(
        callbacks,
        javaImports.PasswordCallback,
        secretNumberMap[secretNumber.firstPosition] + " digit"
      ).getPassword()
    );
    var secondNumber = javaImports.String(
      getCallback(
        callbacks,
        javaImports.PasswordCallback,
        secretNumberMap[secretNumber.secondPosition] + " digit"
      ).getPassword()
    );
    nodeLogger.debug(
      "Got firstNumber " + firstNumber + " secondNumber: " + secondNumber
    );

    if (firstNumber != null && secondNumber != null) {
      transientState.put(
        config.secretNumberResponseField,
        JSON.stringify({ first: firstNumber, second: secondNumber })
      );
      return javaImports.Action.goTo(nodeOutcomes.SUCCESS).build();
    } else {
      nodeLogger.error("Error retrieving callbacks");
      return javaImports.Action.goTo(nodeOutcomes.ERROR).build();
    }
  }
}
(function () {
  try {
    nodeLogger.error("started");
    var secretNumberRaw = sharedState.get(config.secretNumberField);
    var secretNumber = JSON.parse(secretNumberRaw);
    action = getAction(secretNumber);
  } catch (e) {
    nodeLogger.error("Unexpected error: " + e);
    action = javaImports.Action.goTo(nodeOutcomes.ERROR).build();
  }
})();
