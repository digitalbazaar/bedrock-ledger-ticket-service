/*!
 * Copyright (c) 2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {asyncHandler, express} = require('bedrock-express');
const bedrock = require('bedrock');
const api = require('./api');

const router = express.Router();

// must delay defining router endpoints until validation schemas are loaded
// in `bedrock.init` handler in `bedrock-validation`
bedrock.events.on('bedrock.init', () => {
  // FIXME: add validation and authentication
  router.post(
    '/tickets', /* validate(),*/
    asyncHandler(async (req, res) => {
      const {did} = req.body;
      await api.createTicket(did);
      res.json({did});
    }));

  // FIXME: add validation and authentication
  router.post(
    '/tickets/redeem', /* validate(),*/
    asyncHandler(async (req, res) => {
      const {record, ticket} = req.body;
      const newRecord = api.redeem({record, ticket});
      res.json({record: newRecord});
    }));
});

module.exports = router;
