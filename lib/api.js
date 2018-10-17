/*!
 * Copyright (c) 2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const cuckooCycle = require('cuckoo-cycle');
const TicketProcessor = require('./TicketProcessor');
const ticketProcessor = new TicketProcessor();

// module API
const api = {};
module.exports = api;

api.createTicket = ({blockHeight, did, ipAddr}) => {
  try {
    const ticket = ticketProcessor.createTicket({blockHeight, did, ipAddr});
    return ticket;
  } catch(e) {
    // handle error
    console.log(e);

    throw new Error('Error creating ticket.');
  }
};

api.redeemTicket = ({ticket, record}) => {
  try {
    await TicketProcessor.validateTicket({ticket});
    await cuckooCycle.verify({input: record, solution: record.proof})
  } catch(e) {
    // TODO: handle error
    console.log(e);

    throw new Error('Error redeeming ticket.');
  }
};
