const { redisClient } = require("../config/redis")

async function rateLimit(key, limit, windowInSeconds) {
  const current = await redisClient.get(key)

  if (current && parseInt(current) >= limit) {
    return false
  }

  if (!current) {
    await redisClient.set(key, 1, { EX: windowInSeconds })
  } else {
    await redisClient.incr(key)
  }

  return true
}

module.exports = rateLimit