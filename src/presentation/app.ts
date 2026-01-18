import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler, sendErrorResponse } from '../shared/utils/error-handler';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

app.use('/api', routes);

// Unknown endpoint handler
app.use(/.*/, (req, res) => {
    sendErrorResponse(res, 404, 'API endpoint not found');
});

app.use(errorHandler);

export default app;
