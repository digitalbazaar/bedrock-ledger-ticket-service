/*!
 * Copyright (c) 2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {asyncHandler, express} = require('bedrock-express');
const bedrock = require('bedrock');

const router = express.Router();

// must delay defining router endpoints until validation schemas are loaded
// in `bedrock.init` handler in `bedrock-validation`
bedrock.events.on('bedrock.init', () => {
  // FIXME: add validation and authentication
  router.post(
    '/', /* validate(),*/
    asyncHandler(async (req, res) => {
      // const {id: ledgerAgentId} = req.ledgerAgent;
      // const {id: ledgerNodeId} = req.ledgerAgent.node;
      const {node: ledgerNode} = req.ledgerAgent;
      const {maxBlockHeight, query} = req.body;
      const {ftapocQuery} = ledgerNode.storage.operations
        .plugins['ftapoc-storage'];
      const result = await ftapocQuery({maxBlockHeight, query});
      res.json(result);
    }));
});

module.exports = router;
