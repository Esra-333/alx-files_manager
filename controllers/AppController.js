/* eslint-disable import/no-named-as-default */
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

export default class AppController {
  /**
   * GET /status
   * Returns the status of Redis and the database.
   * Example response: { "redis": true, "db": true }
   */
  static getStatus(req, res) {
    // Check if Redis and the DB are alive, and return their statuses
    res.status(200).json({
      redis: redisClient.isAlive(),  // Calls isAlive() method to check Redis status
      db: dbClient.isAlive(),        // Calls isAlive() method to check DB status
    });
  }

  /**
   * GET /stats
   * Returns the number of users and files in the database.
   * Example response: { "users": 12, "files": 1231 }
   */
  static getStats(req, res) {
    // Use Promise.all to wait for both dbClient.nbUsers() and dbClient.nbFiles()
    Promise.all([dbClient.nbUsers(), dbClient.nbFiles()])
      .then(([usersCount, filesCount]) => {
        // Respond with a JSON object containing the number of users and files
        res.status(200).json({ users: usersCount, files: filesCount });
      })
      .catch((error) => {
        // Handle any potential errors
        res.status(500).json({ error: 'Unable to retrieve stats' });
      });
  }
}

