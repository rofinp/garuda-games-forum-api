const InvariantError = require('../../Commons/exceptions/InvariantError');
const AuthenticationRepository = require('../../Domains/authentications/AuthenticationRepository');

class AuthenticationRepositoryPostgres extends AuthenticationRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addToken(token) {
    const insertTokenQuery = {
      text: 'INSERT INTO authentications (token) VALUES ($1)',
      values: [token],
    };

    await this._pool.query(insertTokenQuery);
  }

  async checkAvailabilityToken(token) {
    const checkTokenQuery = {
      text: 'SELECT * FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this._pool.query(checkTokenQuery);

    if (!result.rowCount) {
      throw new InvariantError('refresh token tidak ditemukan di database');
    }
  }

  async deleteToken(token) {
    const deleteTokenQuery = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this._pool.query(deleteTokenQuery);
  }
}

module.exports = AuthenticationRepositoryPostgres;
