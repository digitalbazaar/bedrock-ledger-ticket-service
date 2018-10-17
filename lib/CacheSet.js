/*!
 * Copyright (c) 2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const TICKET_SERVICE_CACHE_KEY = 'v1|ticket-service';

module.exports = class CacheList {
  constructor(key) {
    this.cache = require('bedrock-redis');
    this.key = `${TICKET_SERVICE_CACHE_KEY}|${key}`;
  }

  async add(id) {
    return await this.cache.sadd(this.key, id) === 1;
  }

  async has(id) {
    return (await this.sismember(this.key, id)) === 1;
  }

  async remove(id) {
    return this.cache.srem(this.key, id) === 1;
  }

  async values() {
    return this.cache.smembers(this.key);
  }
};
