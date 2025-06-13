import { DataFactory } from '@/factories/DataFactory';
import { ModelFactory } from '@/factories/ModelFactory';
import { IncomeTransaction, OutcomeTransaction } from '@types';
import rawData from './mockup/data.json';

// TODO recuperer les data d'une DB
const records = ModelFactory.createTransactionRecord(
	rawData as unknown as Array<IncomeTransaction | OutcomeTransaction>
);
const data = new DataFactory(records);

export default data;
