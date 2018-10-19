/*!
 * Ticket processor management class.
 *
 * Copyright (c) 2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const jwt = require('jsonwebtoken');
const CacheSet = require('./CacheSet');

module.exports = class TicketProcessor {
  constructor() {
    this.ticketCounter = 0;
    this.ipAddrBanlist = new CacheSet('ip-ban-list');
  }

  /**
   * 
   * @param {*} ipAddr 
   */
  banIpAddr(ipAddr) {
    this.ipAddrBanlist.add(ipAddr);
  }

  /**
   * 
   */
  banlist() {
    return this.ipAddrBanlist.values();
  }

  /**
   * 
   * @param {*} param0 
   */
  createTicket({blockHeight, did, ipAddr} = {}) {
    const ticketNumber = this.ticketCounter + 1;

    this.ensureTicketCreation({ticketNumber, ipAddr});

    const secretKey = _deriveSecretKey(_getPrivateKey());

    const ticket = _generateTicket({blockHeight, did, ticketNumber, secretKey});
    this.incrementCounter();

    return ticket;
  }

  /**
   * 
   * @param {*} param0 
   */
  async ensureTicketCreation({ticketNumber, ipAddr}) {
    if(ticketNumber > (await this.maxAllowedTickets())) {
      throw new Error('Failed to create ticket: max allowed tickets reached.');
    }
    if(this.isIpAddrBanned(ipAddr)) {
      throw new Error(`Failed to create ticket: ${ipAddr} is banned.`);
    }
  }

  /**
   * 
   */
  incrementCounter() {
    ++this.ticketCounter;
  }

  /**
   * 
   * @param {*} ipAddr 
   */
  isIpAddrBanned(ipAddr) {
    return this.ipAddrBanlist.has(ipAddr);
  }

  /**
   * 
   */
  async maxAllowedTickets() {
    return 10;
  }

  /**
   * 
   */
  resetCounter() {
    this.ticketCounter = 0;
  }

  /**
   * 
   * @param {*} ipAddr 
   */
  unbanIpAddr(ipAddr) {
    this.ipAddrBanlist.remove(ipAddr);
  }

  /**
   * 
   * @param {*} param0 
   */
  static async validateTicket({ticket}) {
    const secretKey = _deriveSecretKey(_getPrivateKey());
    try {
      await jwt.verify(ticket, secretKey);
    } catch(e) {
      console.error('Could not verify ticket.');
      throw e;
    }
  }

};

/**
 * 
 * @param {*} privateKey 
 */
const _deriveSecretKey = privateKey => {
  // TODO: Pick a suitable key derivation function
  return privateKey + 'secret';
};

/**
 * 
 * @param {*} param0 
 */
const _generateTicket = ({blockHeight, did, ticketNumber, secretKey}) => {
  return jwt.sign({
    // issuer, // elector's DID
    subject: did,
    jti: `${blockHeight}:${ticketNumber}`
  }, secretKey);
};

/**
 * 
 */
const _getPrivateKey = () => {
  // TODO: Get the Elector's private key
  return 'privatekey';
};
