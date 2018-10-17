/*!
 * Ledger node operations management class.
 *
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

module.exports = class TicketProcessor {
  constructor() {
    this.ticketCounter = 0;
  }

  resetCounter() {
    this.ticketCounter = 0;
  }

  incrementCounter() {
    ++this.ticketCounter;
  }

  createTicket({did, blockHeight} = {}) {
    const privateKey = _getPrivateKey();
    const secretKey =
  }

}

const _deriveSecretKey = privateKey => {
  // TODO: Pick a suitable key derivation function
  return privateKey + 'secret';
}

const _getPrivateKey = () => {
  // TODO: Get the Elector's private key
  return 'privatekey';
}
