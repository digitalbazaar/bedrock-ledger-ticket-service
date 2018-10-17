/*!
 * Copyright (c) 2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const router = require('./http');
require('bedrock-ledger-context');

module.exports = {
  type: 'ledgerAgentPlugin',
  api: {
    router,
    serviceType: 'urn:v1:elector-ticket-service'
  }
};
