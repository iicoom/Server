import http from 'http';
import app from '../app';
import config from '../config';
import { 
  connectDatabase,
  closeConnections, 
} from '../app/db';

const port = process.env.PORT || 3000;

(async () => {
  try {
    await connectDatabase(config.db);
  } catch (error) {
    console.error('www.js Unable to connect to database');
  }

  try {
    const server = http.createServer(app.callback()).listen(port);
    console.log(`Server started on port ${port}`);

    process.on('SIGINT', () => {
      closeConnections();
      server.close(() => {
        setTimeout(() => {
          // 300ms later the process kill it self to allow a restart
          process.exit(0);
        }, 300);
      });
    });
  } catch (error) {
    console.log(error);
  }
})();

