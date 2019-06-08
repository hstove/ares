import { createContext } from 'react';
import { UserSession, AppConfig } from 'blockstack';

const appConfig = new AppConfig(['store_write', 'publish_data'], process.env.RADIKS_API_SERVER);
const userSession = new UserSession({ appConfig });

export default createContext({ userSession });
