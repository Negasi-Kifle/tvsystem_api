import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler, sendErrorResponse } from '../shared/utils/error-handler';
import globalErrorHandler from '../shared/utils/global-error-handler';

const app = express();

app.use(express.json());
app.use(cors({ origin: "*", credentials: false }));
app.use(helmet());
app.use(morgan('combined'));

app.use('/api', routes);

// Unknown endpoint handler
app.use(/.*/, (req, res) => {
    sendErrorResponse(res, 404, 'API endpoint not found');
});

app.use(globalErrorHandler);

export default app;
