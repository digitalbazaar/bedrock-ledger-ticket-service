/*!
 * Copyright (c) 2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {asyncHandler, express} = require('bedrock-express');
const bedrock = require('bedrock');
const cuckooCycle = require('cuckoo-cycle');
const TicketProcessor = require('./TicketProcessor');
const ticketProcessor = new TicketProcessor();

const router = express.Router();
module.exports = router;

// must delay defining router endpoints until validation schemas are loaded
// in `bedrock.init` handler in `bedrock-validation`
bedrock.events.on('bedrock.init', () => {
  // FIXME: add validation and authentication
  router.post(
    '/tickets', /* validate(),*/
    asyncHandler(async (req, res) => {
      const {did} = req.body;
      const ipAddr = req.ip || 'IP_NOT_AVAILABLE';

      const {node: ledgerNode} = req.ledgerAgent;
      const meta = await ledgerNode.meta.get({});
      const ticket = await ticketProcessor.createTicket({
        blockHeight,
        did,
        ipAddr
      });
      return res.status(200).json({ticket});
    }));

  // FIXME: add validation and authentication
  router.post(
    '/tickets/redeem', /* validate(),*/
    asyncHandler(async (req, res) => {
      const {operation, ticket, proof} = req.body;
      try {
        await verify({ticket, operation, proof});
        return res.status(200).json({
          operation: newOperation,
          proof: invocationProof
        });
      } catch(e) {
        // TODO: handle error
        console.log(e);

        throw new Error('Could not redeem ticket at this time.');
      }
    }));
});

const verify = async ({ticket, operation, proof}) => {
  await TicketProcessor.validateTicket({ticket});
  await cuckooCycle.verify({input: operation, solution: proof});
};

