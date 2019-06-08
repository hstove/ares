import { Model } from 'radiks';

export default class HighScore extends Model {
  static className = 'HighScore'

  static schema = {
    score: {
      type: String,
      decrypted: true,
    },
    version: {
      type: String,
      decrypted: true,
    },
    username: {
      type: String,
      decrypted: true,
    },
  }
}
